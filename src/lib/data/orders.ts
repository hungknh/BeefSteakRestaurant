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
