"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { reservationFormSchema, type ReservationFormValues } from "@/lib/validations/reservation";
import type { ReservationStatus } from "@/types";

const RESERVATION_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "CANCELLED",
  "NO_SHOW",
];

export async function createReservation(values: ReservationFormValues, promotionId: string | null) {
  const parsed = reservationFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await auth();
  const { guestName, guestPhone, guestEmail, date, timeSlot, partySize, note } = parsed.data;

  await prisma.reservation.create({
    data: {
      id: `res-${randomUUID()}`,
      userId: session?.user?.id ?? null,
      promotionId,
      guestName,
      guestPhone,
      guestEmail,
      date,
      timeSlot,
      partySize,
      note: note || null,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  return { success: true as const };
}

export async function updateReservationStatus(reservationId: string, status: ReservationStatus) {
  if (!RESERVATION_STATUSES.includes(status)) return { error: "Trạng thái không hợp lệ." };

  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) return { error: "Không tìm thấy đặt bàn." };

  await prisma.reservation.update({ where: { id: reservationId }, data: { status } });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  return { success: true as const };
}
