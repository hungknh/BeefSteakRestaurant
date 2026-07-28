import { prisma } from "@/lib/prisma";
import type { Reservation } from "@/types";

export async function getReservations(): Promise<Reservation[]> {
  // status lưu String trong Prisma (không dùng enum) — ép kiểu về union hẹp của app.
  return prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  }) as unknown as Promise<Reservation[]>;
}
