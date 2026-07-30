"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { Prisma } from "@/generated/prisma/client";
import { bestPromotion, type CartLine } from "@/lib/promotions/apply";
import { computeCartTotals } from "@/lib/cart/totals";
import { orderFormSchema, orderItemsSchema, type OrderFormValues } from "@/lib/validations/order";
import type { Dish, Doneness, OrderStatus, Promotion } from "@/types";
import { getTranslations } from "next-intl/server";

const SHIPPING_FEE = 30000;

// Địa chỉ ghi vào đơn khi khách chọn nhận tại quầy. Là dữ liệu lưu trữ (không phải chữ
// trên UI) nên KHÔNG dịch — đơn cũ phải đọc y nguyên bất kể sau này đổi ngôn ngữ.
const PICKUP_ADDRESS = "Lấy tại quầy";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
];

export type OrderCartItemInput = {
  dishId: string;
  quantity: number;
  doneness: Doneness | null;
  note: string;
};

/**
 * Mã đơn dạng `BS-20260730-001` — đếm đơn trong ngày rồi +1 để mã đọc được.
 *
 * ⚠️ Cách này có race thật: 2 đơn tạo cùng lúc đếm ra cùng số, mà `code` là `@unique` nên
 * `create` thứ hai ném P2002. Trước đây lỗi đó không được bắt → khách thấy trang lỗi thay
 * vì thông báo. Giờ `createOrderWithRetry` bắt P2002 và đếm lại (xem dưới) — giữ được mã
 * dễ đọc mà không crash. Muốn bỏ hẳn race thì cần sequence trong DB.
 */
async function generateOrderCode(now: Date): Promise<string> {
  const isoDate = now.toISOString().slice(0, 10);
  const countToday = await prisma.order.count({
    where: { createdAt: { startsWith: isoDate } },
  });
  return `BS-${isoDate.replace(/-/g, "")}-${String(countToday + 1).padStart(3, "0")}`;
}

/** Lỗi vi phạm ràng buộc unique của Prisma. */
function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
}

/**
 * Tạo đơn, sinh lại mã nếu trùng.
 *
 * `generateOrderCode` đếm-rồi-+1 nên 2 đơn đồng thời ra cùng mã. Lần tạo thứ hai ném P2002;
 * đếm lại là ra số mới vì đơn kia đã nằm trong DB. 3 lần thử là quá đủ cho quy mô này —
 * hết lượt thì để lỗi nổi lên chứ không âm thầm tạo đơn sai mã.
 */
async function createOrderWithRetry(
  now: Date,
  data: Omit<Prisma.OrderUncheckedCreateInput, "code">,
): Promise<{ code: string }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.order.create({
        data: { ...data, code: await generateOrderCode(now) } as Prisma.OrderUncheckedCreateInput,
        select: { code: true },
      });
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;
      lastError = e;
    }
  }
  throw lastError;
}

export async function createOrder(values: OrderFormValues, items: OrderCartItemInput[]) {
  const t = await getTranslations("Errors");
  const parsed = orderFormSchema.safeParse(values);
  if (!parsed.success) return { error: t("invalidData") };

  // ⚠️ Mảng giỏ hàng cũng phải validate, không chỉ `values`: Server Action nhận dữ liệu
  // qua network nên type TypeScript không chặn được gì lúc runtime. Thiếu bước này thì
  // `quantity: -10` từ client vào thẳng phép tính tiền và tạo được đơn có total âm.
  const parsedItems = orderItemsSchema.safeParse(items);
  if (!parsedItems.success) {
    return { error: items.length === 0 ? t("cartEmpty") : t("invalidData") };
  }

  const session = await auth();

  const [dbDishes, dbPromos] = await Promise.all([
    prisma.dish.findMany({ where: { id: { in: parsedItems.data.map((i) => i.dishId) } } }),
    prisma.promotion.findMany({ where: { isActive: true } }),
  ]);

  const dishes = dbDishes as unknown as Dish[];
  const promos = dbPromos as unknown as Promotion[];
  const dishMap = new Map(dishes.map((d) => [d.id, d]));

  const lines: CartLine[] = [];
  // Chuẩn hoá lại từng dòng theo dữ liệu DB, không tin client.
  const normalizedItems: OrderCartItemInput[] = [];
  for (const item of parsedItems.data) {
    const dish = dishMap.get(item.dishId);
    if (!dish) return { error: t("dishGone") };
    lines.push({ dish, quantity: item.quantity });
    normalizedItems.push({
      ...item,
      // Món không cho chọn độ chín thì bỏ giá trị client gửi — nếu không, DB lưu được
      // "Tiramisu — Chín Kỹ" và bếp nhận phiếu vô nghĩa.
      doneness: dish.hasDoneness ? item.doneness : null,
    });
  }

  // ⚠️ Giá + khuyến mãi luôn tính lại ở server, không tin số client gửi (PLAN.md mục 6).
  // Dùng CHUNG `computeCartTotals` với client để hai bên không thể lệch công thức.
  const now = new Date();
  const shippingFee = parsed.data.deliveryMethod === "DELIVERY" ? SHIPPING_FEE : 0;
  const totals = computeCartTotals(lines, promos, now, shippingFee);
  const promoResult = bestPromotion(lines, promos, now);

  const order = await createOrderWithRetry(now, {
    id: `order-${randomUUID()}`,
    userId: session?.user?.id ?? null,
    status: "PENDING",
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingFee,
    total: totals.total,
    appliedPromotionId: promoResult?.promotion.id ?? null,
    appliedPromotionTitle: promoResult?.promotion.title ?? null,
    receiverName: parsed.data.receiverName,
    receiverPhone: parsed.data.receiverPhone,
    address: parsed.data.deliveryMethod === "PICKUP" ? PICKUP_ADDRESS : parsed.data.address,
    createdAt: now.toISOString(),
    items: {
      create: normalizedItems.map((item) => ({
        id: `orderitem-${randomUUID()}`,
        dishId: item.dishId,
        quantity: item.quantity,
        unitPrice: dishMap.get(item.dishId)!.price,
        doneness: item.doneness,
        note: item.note || null,
      })),
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true as const, code: order.code };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const t = await getTranslations("Errors");
  if (!ORDER_STATUSES.includes(status)) return { error: t("invalidStatus") };

  const session = await requireAdminSession();
  if (!session) return { error: t("noPermission") };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: t("orderNotFound") };

  await prisma.order.update({ where: { id: orderId }, data: { status } });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true as const };
}
