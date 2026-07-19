import { MOCK_RESERVATIONS } from "@/lib/data/_mock";
import type { Reservation } from "@/types";

export async function getReservations(): Promise<Reservation[]> {
  return [...MOCK_RESERVATIONS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
