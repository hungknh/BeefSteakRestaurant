import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { SortDir } from "@/lib/admin/table-query";
import type { Order } from "@/types";

/** Cột được phép sort — dùng chung cho page (validate URL) và bảng (dựng link header). */
export const ORDER_SORT_KEYS = ["code", "total", "createdAt"] as const;
export type OrderSortKey = (typeof ORDER_SORT_KEYS)[number];

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
  sort: OrderSortKey = "createdAt",
  dir: SortDir = "desc",
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

  // `sort` đã qua whitelist ORDER_SORT_KEYS ở page nên an toàn để đưa vào orderBy.
  // Thêm `id` làm tiêu chí phụ: sort theo cột có giá trị trùng nhau (vd nhiều đơn cùng
  // `total`) mà không có tiebreaker thì Postgres không bảo đảm thứ tự ổn định giữa các
  // trang — cùng một bản ghi có thể hiện ở cả trang 1 và trang 2, hoặc mất hẳn.
  const orderBy: Prisma.OrderOrderByWithRelationInput[] = [{ [sort]: dir }, { id: "asc" }];

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { dish: true } } },
      orderBy,
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
