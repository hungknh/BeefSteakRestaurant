import { MOCK_PROMOTIONS } from "@/lib/data/_mock";
import type { Promotion } from "@/types";

export async function getPromotions(): Promise<Promotion[]> {
  return MOCK_PROMOTIONS.filter((p) => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Bao gồm cả khuyến mãi đã tắt — dùng cho admin. */
export async function getAllPromotions(): Promise<Promotion[]> {
  return [...MOCK_PROMOTIONS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPromotionBySlug(slug: string): Promise<Promotion | null> {
  return MOCK_PROMOTIONS.find((p) => p.slug === slug) ?? null;
}
