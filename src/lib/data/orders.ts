import { prisma } from "@/lib/prisma";
import type { Order } from "@/types";

export async function getOrders(): Promise<Order[]> {
  // status/doneness lưu String trong Prisma (không dùng enum, xem schema.prisma) —
  // ép kiểu về union hẹp của app, giá trị runtime luôn nằm trong tập hợp lệ.
  return prisma.order.findMany({
    include: { items: { include: { dish: true } } },
    orderBy: { createdAt: "desc" },
  }) as unknown as Promise<Order[]>;
}

const PAGE_SIZE = 20;

export async function getOrdersPaged(page: number): Promise<{ orders: Order[]; totalPages: number }> {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: { items: { include: { dish: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count(),
  ]);
  return {
    orders: orders as unknown as Order[],
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getHasPurchasedDish(userId: string, dishId: string): Promise<boolean> {
  const item = await prisma.orderItem.findFirst({
    where: { dishId, order: { userId, status: "COMPLETED" } },
    select: { id: true },
  });
  return item !== null;
}
