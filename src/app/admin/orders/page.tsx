import { getOrders } from "@/lib/data/orders";
import { OrdersTable } from "@/components/admin/orders-table";

export const metadata = { title: "Admin — Đơn Hàng" };

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đơn Hàng</h1>
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
