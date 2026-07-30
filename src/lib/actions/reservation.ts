"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { SITE } from "@/lib/site";
import { reservationFormSchema, type ReservationFormValues } from "@/lib/validations/reservation";
import type { ReservationStatus } from "@/types";

const RESERVATION_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "CANCELLED",
  "NO_SHOW",
];

/** Số đặt bàn tối đa cho 1 số điện thoại trong cùng 1 ngày — chống spam form. */
const MAX_RESERVATIONS_PER_PHONE_PER_DAY = 3;

export async function createReservation(values: ReservationFormValues, promotionId: string | null) {
  const parsed = reservationFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await auth();
  const { guestName, guestPhone, guestEmail, date, timeSlot, partySize, note } = parsed.data;

  // Rate limit đếm thẳng trong DB, không cần store ngoài. Đơn đã hủy không tính vào hạn
  // mức — khách hủy rồi đặt lại giờ khác là hành vi bình thường, không phải spam.
  const sameDayCount = await prisma.reservation.count({
    where: { guestPhone, date, status: { not: "CANCELLED" } },
  });
  if (sameDayCount >= MAX_RESERVATIONS_PER_PHONE_PER_DAY) {
    return {
      error: `Số điện thoại này đã có ${MAX_RESERVATIONS_PER_PHONE_PER_DAY} đặt bàn trong ngày ${date}. Vui lòng gọi ${SITE.phone} nếu cần thêm bàn.`,
    };
  }

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
