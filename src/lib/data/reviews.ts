import { MOCK_REVIEWS } from "@/lib/data/_mock";
import type { Review } from "@/types";

export async function getReviews(filter?: { dishId?: string }): Promise<Review[]> {
  const all = MOCK_REVIEWS;
  return filter?.dishId ? all.filter((r) => r.dishId === filter.dishId) : all;
}
