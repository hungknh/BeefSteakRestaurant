"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { SITE } from "@/lib/site";
import { isBookingDateAllowed, MAX_BOOKING_DAYS_AHEAD } from "@/lib/reservation/time-slots";
import { reservationFormSchema, type ReservationFormValues } from "@/lib/validations/reservation";
import type { ReservationStatus } from "@/types";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("Errors");
  const parsed = reservationFormSchema.safeParse(values);
  if (!parsed.success) return { error: t("invalidData") };

  const session = await auth();
  const { guestName, guestPhone, guestEmail, date, timeSlot, partySize, note } = parsed.data;

  // `min={today}` trên input chỉ chặn ở client — request tự soạn bỏ qua được. Không kiểm
  // ở đây thì tạo được đặt bàn cho ngày đã qua, hoặc đặt trước vài năm.
  if (!isBookingDateAllowed(date, new Date())) {
    return { error: t("invalidBookingDate", { days: MAX_BOOKING_DAYS_AHEAD }) };
  }

  // Rate limit đếm thẳng trong DB, không cần store ngoài. Đơn đã hủy không tính vào hạn
  // mức — khách hủy rồi đặt lại giờ khác là hành vi bình thường, không phải spam.
  const sameDayCount = await prisma.reservation.count({
    where: { guestPhone, date, status: { not: "CANCELLED" } },
  });
  if (sameDayCount >= MAX_RESERVATIONS_PER_PHONE_PER_DAY) {
    return {
      error: t("reservationLimit", {
        max: MAX_RESERVATIONS_PER_PHONE_PER_DAY,
        date,
        phone: SITE.phone,
      }),
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
  const t = await getTranslations("Errors");
  if (!RESERVATION_STATUSES.includes(status)) return { error: t("invalidStatus") };

  const session = await requireAdminSession();
  if (!session) return { error: t("noPermission") };

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) return { error: t("reservationNotFound") };

  await prisma.reservation.update({ where: { id: reservationId }, data: { status } });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  return { success: true as const };
}
