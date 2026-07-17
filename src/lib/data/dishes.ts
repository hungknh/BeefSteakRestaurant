import { MOCK_DISHES } from "@/lib/data/_mock";
import type { Dish } from "@/types";

export async function getDishes(filter?: { category?: string }): Promise<Dish[]> {
  const all = MOCK_DISHES;
  return filter?.category ? all.filter((d) => d.category?.slug === filter.category) : all;
}
