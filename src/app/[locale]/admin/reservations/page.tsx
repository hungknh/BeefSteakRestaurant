import { getReservationsPaged } from "@/lib/data/reservations";
import { ReservationsTable } from "@/components/admin/reservations-table";
import { Pager } from "@/components/admin/pager";

export const metadata = { title: "Admin — Đặt Bàn" };

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function AdminReservationsPage({ searchParams }: Props) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  // Cắt 100 ký tự — xem ghi chú ở `admin/orders/page.tsx`.
  const search = q?.trim().slice(0, 100) || undefined;
  const { reservations, totalPages } = await getReservationsPaged(page, search);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đặt Bàn</h1>
      <ReservationsTable initialReservations={reservations} search={search} />
      <Pager
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/reservations"
        search={search}
      />
    </div>
  );
}
