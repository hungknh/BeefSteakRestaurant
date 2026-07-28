import { prisma } from "@/lib/prisma";
import type { Promotion } from "@/types";

// discountType/scope lưu String trong Prisma (không dùng enum) — ép kiểu về union
// hẹp của app, giá trị runtime luôn nằm trong tập hợp lệ (xem schema.prisma).

export async function getPromotions(): Promise<Promotion[]> {
  return prisma.promotion.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  }) as unknown as Promise<Promotion[]>;
}

/** Bao gồm cả khuyến mãi đã tắt — dùng cho admin. */
export async function getAllPromotions(): Promise<Promotion[]> {
  return prisma.promotion.findMany({
    orderBy: { sortOrder: "asc" },
  }) as unknown as Promise<Promotion[]>;
}

export async function getPromotionBySlug(slug: string): Promise<Promotion | null> {
  return prisma.promotion.findUnique({ where: { slug } }) as unknown as Promise<Promotion | null>;
}
