import { prisma } from "@/lib/prisma";
import type { Review } from "@/types";

export async function getReviews(filter?: { dishId?: string }): Promise<Review[]> {
  return prisma.review.findMany({
    where: filter?.dishId ? { dishId: filter.dishId } : undefined,
    // select tường minh (không include user: true) — User có cột password (hash),
    // include thẳng sẽ lộ hash ra tận client qua props của component.
    select: {
      id: true,
      dishId: true,
      userId: true,
      rating: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true, image: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  }) as unknown as Promise<Review[]>;
}
