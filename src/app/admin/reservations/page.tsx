import { getReservationsPaged } from "@/lib/data/reservations";
import { ReservationsTable } from "@/components/admin/reservations-table";
import { Pager } from "@/components/admin/pager";

export const metadata = { title: "Admin — Đặt Bàn" };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function AdminReservationsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { reservations, totalPages } = await getReservationsPaged(page);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đặt Bàn</h1>
      <ReservationsTable initialReservations={reservations} />
      <Pager currentPage={page} totalPages={totalPages} basePath="/admin/reservations" />
    </div>
  );
}
