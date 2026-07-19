import { getReservations } from "@/lib/data/reservations";
import { ReservationsTable } from "@/components/admin/reservations-table";

export const metadata = { title: "Admin — Đặt Bàn" };

export default async function AdminReservationsPage() {
  const reservations = await getReservations();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Đặt Bàn</h1>
      <ReservationsTable initialReservations={reservations} />
    </div>
  );
}
