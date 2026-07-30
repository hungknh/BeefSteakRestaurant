import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { SortDir } from "@/lib/admin/table-query";
import type { Reservation } from "@/types";

/** Cột được phép sort — xem ghi chú whitelist trong `orders.ts`. */
export const RESERVATION_SORT_KEYS = ["guestName", "date", "createdAt"] as const;
export type ReservationSortKey = (typeof RESERVATION_SORT_KEYS)[number];

export async function getReservations(): Promise<Reservation[]> {
  // status lưu String trong Prisma (không dùng enum) — ép kiểu về union hẹp của app.
  return prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  }) as unknown as Promise<Reservation[]>;
}

const PAGE_SIZE = 20;

export async function getReservationsPaged(
  page: number,
  q?: string,
  sort: ReservationSortKey = "date",
  dir: SortDir = "desc",
): Promise<{ reservations: Reservation[]; totalPages: number }> {
  // Chỉ tìm theo tên khách — đúng phạm vi search client-side trước đây. Về dấu
  // tiếng Việt: xem ghi chú trong `getOrdersPaged`.
  const where: Prisma.ReservationWhereInput = q
    ? { guestName: { contains: q, mode: "insensitive" } }
    : {};

  // `id` làm tiêu chí phụ để phân trang ổn định — xem ghi chú trong `getOrdersPaged`.
  // Đặt bàn rất dễ trùng `date` (nhiều bàn cùng một ngày) nên chỗ này càng cần.
  const orderBy: Prisma.ReservationOrderByWithRelationInput[] = [{ [sort]: dir }, { id: "asc" }];

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.reservation.count({ where }),
  ]);
  return {
    reservations: reservations as unknown as Reservation[],
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
