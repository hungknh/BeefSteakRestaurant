import { getOrdersPaged } from "@/lib/data/orders";
import { OrdersTable } from "@/components/admin/orders-table";
import { Pager } from "@/components/admin/pager";

export const metadata = { title: "Admin — Đơn Hàng" };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { orders, totalPages } = await getOrdersPaged(page);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đơn Hàng</h1>
      <OrdersTable initialOrders={orders} />
      <Pager currentPage={page} totalPages={totalPages} basePath="/admin/orders" />
    </div>
  );
}
