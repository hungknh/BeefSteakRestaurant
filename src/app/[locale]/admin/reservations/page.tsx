import { getReservationsPaged, RESERVATION_SORT_KEYS } from "@/lib/data/reservations";
import { ReservationsTable } from "@/components/admin/reservations-table";
import { Pager } from "@/components/admin/pager";
import { parseSearch, parseSortDir, parseSortKey } from "@/lib/admin/table-query";

export const metadata = { title: "Admin — Đặt Bàn" };

type Props = {
  searchParams: Promise<{ page?: string; q?: string; sort?: string; dir?: string }>;
};

export default async function AdminReservationsPage({ searchParams }: Props) {
  const { page: pageParam, q, sort: sortParam, dir: dirParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = parseSearch(q);
  // Whitelist — xem ghi chú ở `admin/orders/page.tsx`.
  const sort = parseSortKey(sortParam, RESERVATION_SORT_KEYS, "date");
  const dir = parseSortDir(dirParam);

  const { reservations, totalPages } = await getReservationsPaged(page, search, sort, dir);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đặt Bàn</h1>
      <ReservationsTable
        reservations={reservations}
        search={search}
        sort={sort}
        dir={dir}
      />
      <Pager
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/reservations"
        search={search}
        sort={sort}
        dir={dir}
      />
    </div>
  );
}
