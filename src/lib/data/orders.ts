import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
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

export async function getOrdersPaged(
  page: number,
  q?: string,
): Promise<{ orders: Order[]; totalPages: number }> {
  // ponytail: `contains` + mode "insensitive" (Postgres) — không bỏ dấu tiếng Việt,
  // gõ "hang" không khớp "Hằng", y hệt search client-side trước đây. Muốn khớp
  // không dấu thì cần cột unaccent/pg_trgm, chưa đáng cho ~600 bản ghi.
  const where: Prisma.OrderWhereInput = q
    ? {
        OR: [
          { code: { contains: q, mode: "insensitive" } },
          { receiverName: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { dish: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
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
