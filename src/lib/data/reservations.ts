import { prisma } from "@/lib/prisma";
import type { Reservation } from "@/types";

export async function getReservations(): Promise<Reservation[]> {
  // status lưu String trong Prisma (không dùng enum) — ép kiểu về union hẹp của app.
  return prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  }) as unknown as Promise<Reservation[]>;
}

const PAGE_SIZE = 20;

export async function getReservationsPaged(
  page: number,
): Promise<{ reservations: Reservation[]; totalPages: number }> {
  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.reservation.count(),
  ]);
  return {
    reservations: reservations as unknown as Reservation[],
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
