"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { slugify } from "@/lib/slug";
import { promotionFormSchema, type PromotionFormValues } from "@/lib/validations/promotion";

function revalidatePromotionPaths(slug?: string) {
  revalidatePath("/admin/promotions");
  revalidatePath("/admin");
  revalidatePath("/khuyen-mai");
  revalidatePath("/dat-ban");
  if (slug) revalidatePath(`/khuyen-mai/${slug}`);
}

export async function createPromotion(values: PromotionFormValues) {
  const parsed = promotionFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const slug = slugify(parsed.data.title);
  const existing = await prisma.promotion.findUnique({ where: { slug } });
  if (existing) return { error: "Đã có khuyến mãi trùng tiêu đề (trùng đường dẫn), đổi tiêu đề khác." };

  await prisma.promotion.create({
    data: { id: `promo-${randomUUID()}`, slug, ...parsed.data },
  });

  revalidatePromotionPaths(slug);
  return { success: true as const };
}

export async function updatePromotion(promotionId: string, values: PromotionFormValues) {
  const parsed = promotionFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
  if (!promotion) return { error: "Không tìm thấy khuyến mãi." };

  // Không đổi slug khi sửa — giữ nguyên URL đã có, tránh vỡ link/SEO.
  await prisma.promotion.update({ where: { id: promotionId }, data: parsed.data });

  revalidatePromotionPaths(promotion.slug);
  return { success: true as const };
}

export async function deletePromotion(promotionId: string) {
  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
  if (!promotion) return { error: "Không tìm thấy khuyến mãi." };

  try {
    await prisma.promotion.delete({ where: { id: promotionId } });
  } catch {
    return {
      error:
        'Không thể xóa khuyến mãi này vì đã có đơn hàng/đặt bàn liên quan. Chuyển sang "Tắt kích hoạt" thay vì xóa.',
    };
  }

  revalidatePromotionPaths(promotion.slug);
  return { success: true as const };
}
