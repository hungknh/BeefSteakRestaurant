import { MOCK_ORDERS } from "@/lib/data/_mock";
import type { Order } from "@/types";

export async function getOrders(): Promise<Order[]> {
  return [...MOCK_ORDERS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
