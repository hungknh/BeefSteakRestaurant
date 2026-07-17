import { MOCK_PROMOTIONS } from "@/lib/data/_mock";
import type { Promotion } from "@/types";

export async function getPromotions(): Promise<Promotion[]> {
  return MOCK_PROMOTIONS.filter((p) => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}
