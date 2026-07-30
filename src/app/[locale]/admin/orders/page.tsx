import { getOrdersPaged, ORDER_SORT_KEYS } from "@/lib/data/orders";
import { OrdersTable } from "@/components/admin/orders-table";
import { Pager } from "@/components/admin/pager";
import { parseSearch, parseSortDir, parseSortKey } from "@/lib/admin/table-query";

export const metadata = { title: "Admin — Đơn Hàng" };

type Props = {
  searchParams: Promise<{ page?: string; q?: string; sort?: string; dir?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { page: pageParam, q, sort: sortParam, dir: dirParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = parseSearch(q);
  // Whitelist trước khi xuống Prisma — cột lạ trong URL sẽ rơi về mặc định chứ không
  // làm vỡ truy vấn.
  const sort = parseSortKey(sortParam, ORDER_SORT_KEYS, "createdAt");
  const dir = parseSortDir(dirParam);

  const { orders, totalPages } = await getOrdersPaged(page, search, sort, dir);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đơn Hàng</h1>
      <OrdersTable orders={orders} search={search} sort={sort} dir={dir} />
      <Pager
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/orders"
        search={search}
        sort={sort}
        dir={dir}
      />
    </div>
  );
}
