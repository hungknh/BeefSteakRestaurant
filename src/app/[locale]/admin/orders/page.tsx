import { getOrdersPaged } from "@/lib/data/orders";
import { OrdersTable } from "@/components/admin/orders-table";
import { Pager } from "@/components/admin/pager";

export const metadata = { title: "Admin — Đơn Hàng" };

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  // Cắt 100 ký tự: `q` đi thẳng vào truy vấn DB (đã tham số hoá nên không có
  // injection), chặn chuỗi rác dài vô hạn từ URL là đủ.
  const search = q?.trim().slice(0, 100) || undefined;
  const { orders, totalPages } = await getOrdersPaged(page, search);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đơn Hàng</h1>
      <OrdersTable initialOrders={orders} search={search} />
      <Pager
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/orders"
        search={search}
      />
    </div>
  );
}
