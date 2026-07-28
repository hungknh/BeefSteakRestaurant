"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { bestPromotion, type CartLine } from "@/lib/promotions/apply";
import { orderFormSchema, type OrderFormValues } from "@/lib/validations/order";
import type { Dish, Doneness, OrderStatus, Promotion } from "@/types";

const SHIPPING_FEE = 30000;

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

// ponytail: đếm đơn trong ngày để sinh mã — có race condition lý thuyết nếu 2 đơn
// tạo cùng lúc, chấp nhận được ở quy mô demo. Nâng cấp bằng sequence DB nếu cần thật.
async function generateOrderCode(now: Date): Promise<string> {
  const isoDate = now.toISOString().slice(0, 10);
  const countToday = await prisma.order.count({
    where: { createdAt: { startsWith: isoDate } },
  });
  return `BS-${isoDate.replace(/-/g, "")}-${String(countToday + 1).padStart(3, "0")}`;
}

export async function createOrder(values: OrderFormValues, items: OrderCartItemInput[]) {
  const parsed = orderFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };
  if (items.length === 0) return { error: "Giỏ hàng trống." };

  const session = await auth();

  const [dbDishes, dbPromos] = await Promise.all([
    prisma.dish.findMany({ where: { id: { in: items.map((i) => i.dishId) } } }),
    prisma.promotion.findMany({ where: { isActive: true } }),
  ]);

  const dishes = dbDishes as unknown as Dish[];
  const promos = dbPromos as unknown as Promotion[];
  const dishMap = new Map(dishes.map((d) => [d.id, d]));

  const lines: CartLine[] = [];
  for (const item of items) {
    const dish = dishMap.get(item.dishId);
    if (!dish) return { error: "Có món trong giỏ hàng không còn tồn tại." };
    lines.push({ dish, quantity: item.quantity });
  }

  // ⚠️ Giá + khuyến mãi luôn tính lại ở server, không tin số client gửi (PLAN.md mục 6).
  const now = new Date();
  const subtotal = lines.reduce((s, l) => s + l.dish.price * l.quantity, 0);
  const promoResult = bestPromotion(lines, promos, now);
  const discount = promoResult?.discount ?? 0;
  const shippingFee = parsed.data.deliveryMethod === "DELIVERY" ? SHIPPING_FEE : 0;
  const total = subtotal - discount + shippingFee;

  const order = await prisma.order.create({
    data: {
      id: `order-${randomUUID()}`,
      code: await generateOrderCode(now),
      userId: session?.user?.id ?? null,
      status: "PENDING",
      subtotal,
      discount,
      shippingFee,
      total,
      appliedPromotionId: promoResult?.promotion.id ?? null,
      appliedPromotionTitle: promoResult?.promotion.title ?? null,
      receiverName: parsed.data.receiverName,
      receiverPhone: parsed.data.receiverPhone,
      address: parsed.data.deliveryMethod === "PICKUP" ? "Lấy tại quầy" : parsed.data.address,
      createdAt: now.toISOString(),
      items: {
        create: items.map((item) => ({
          id: `orderitem-${randomUUID()}`,
          dishId: item.dishId,
          quantity: item.quantity,
          unitPrice: dishMap.get(item.dishId)!.price,
          doneness: item.doneness,
          note: item.note || null,
        })),
      },
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true as const, code: order.code };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) return { error: "Trạng thái không hợp lệ." };

  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: "Không tìm thấy đơn hàng." };

  await prisma.order.update({ where: { id: orderId }, data: { status } });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true as const };
}
