import { MOCK_CATEGORIES } from "@/lib/data/_mock";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  return [...MOCK_CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
}
