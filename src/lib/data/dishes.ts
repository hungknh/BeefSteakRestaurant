import { prisma } from "@/lib/prisma";
import type { Dish } from "@/types";

export async function getDishes(filter?: { category?: string }): Promise<Dish[]> {
  return prisma.dish.findMany({
    where: filter?.category ? { category: { slug: filter.category } } : undefined,
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });
}

export async function getDishBySlug(slug: string): Promise<Dish | null> {
  return prisma.dish.findUnique({ where: { slug }, include: { category: true } });
}
