import { prisma } from "@/lib/prisma";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}
