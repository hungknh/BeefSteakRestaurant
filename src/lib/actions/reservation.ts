"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reservationFormSchema, type ReservationFormValues } from "@/lib/validations/reservation";

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
