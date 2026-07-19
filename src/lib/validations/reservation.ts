import { z } from "zod";

export const reservationFormSchema = z.object({
  guestName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  guestPhone: z.string().regex(/^0[35789]\d{8}$/, "Số điện thoại không hợp lệ"),
  guestEmail: z.union([z.string().trim().email("Email không hợp lệ"), z.literal("")]),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  timeSlot: z.string().min(1, "Vui lòng chọn khung giờ"),
  partySize: z.coerce.number().int().min(1, "Tối thiểu 1 khách").max(20, "Tối đa 20 khách"),
  note: z.string().trim(),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
