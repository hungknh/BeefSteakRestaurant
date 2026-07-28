import { prisma } from "@/lib/prisma";
import type { Order, OrderStatus } from "@/types";

export async function getOrderCount(): Promise<number> {
  return prisma.order.count();
}

export async function getOrderStatusCounts(): Promise<Partial<Record<OrderStatus, number>>> {
  const grouped = await prisma.order.groupBy({ by: ["status"], _count: { status: true } });
  const counts: Partial<Record<OrderStatus, number>> = {};
  for (const g of grouped) counts[g.status as OrderStatus] = g._count.status;
  return counts;
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  }) as unknown as Promise<Order[]>;
}

export type MonthlyRevenue = { month: string; revenue: number; orderCount: number };

/** Doanh thu theo tháng (YYYY-MM), chỉ tính đơn đã hoàn thành. */
export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  const rows = await prisma.order.findMany({
    where: { status: "COMPLETED" },
    select: { createdAt: true, total: true },
  });

  const byMonth = new Map<string, { revenue: number; orderCount: number }>();
  for (const r of rows) {
    const month = r.createdAt.slice(0, 7);
    const cur = byMonth.get(month) ?? { revenue: 0, orderCount: 0 };
    cur.revenue += r.total;
    cur.orderCount += 1;
    byMonth.set(month, cur);
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, ...v }));
}

export type TopDish = { id: string; name: string; imageUrl: string; quantitySold: number; revenue: number };

/** Món bán chạy nhất theo số lượng đã bán (chỉ tính đơn không bị hủy). */
export async function getTopDishes(limit = 5): Promise<TopDish[]> {
  const items = await prisma.orderItem.findMany({
    where: { order: { status: { not: "CANCELLED" } } },
    select: { dishId: true, quantity: true, unitPrice: true },
  });

  const stats = new Map<string, { quantity: number; revenue: number }>();
  for (const it of items) {
    const cur = stats.get(it.dishId) ?? { quantity: 0, revenue: 0 };
    cur.quantity += it.quantity;
    cur.revenue += it.quantity * it.unitPrice;
    stats.set(it.dishId, cur);
  }

  const topIds = [...stats.entries()]
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, limit)
    .map(([dishId]) => dishId);

  const dishes = await prisma.dish.findMany({
    where: { id: { in: topIds } },
    select: { id: true, name: true, imageUrl: true },
  });
  const dishById = new Map(dishes.map((d) => [d.id, d]));

  return topIds.map((id) => ({
    ...dishById.get(id)!,
    quantitySold: stats.get(id)!.quantity,
    revenue: stats.get(id)!.revenue,
  }));
}

export type TopCustomer = { id: string; name: string; email: string; orderCount: number; totalSpent: number };

/** Khách mua nhiều nhất theo tổng chi tiêu (chỉ tính đơn không bị hủy, có tài khoản). */
export async function getTopCustomers(limit = 5): Promise<TopCustomer[]> {
  const orders = await prisma.order.findMany({
    where: { userId: { not: null }, status: { not: "CANCELLED" } },
    select: { userId: true, total: true },
  });

  const stats = new Map<string, { orderCount: number; totalSpent: number }>();
  for (const o of orders) {
    const cur = stats.get(o.userId!) ?? { orderCount: 0, totalSpent: 0 };
    cur.orderCount += 1;
    cur.totalSpent += o.total;
    stats.set(o.userId!, cur);
  }

  const topIds = [...stats.entries()]
    .sort(([, a], [, b]) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
    .map(([userId]) => userId);

  const users = await prisma.user.findMany({
    where: { id: { in: topIds } },
    select: { id: true, name: true, email: true },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  return topIds.map((id) => ({
    ...userById.get(id)!,
    orderCount: stats.get(id)!.orderCount,
    totalSpent: stats.get(id)!.totalSpent,
  }));
}
