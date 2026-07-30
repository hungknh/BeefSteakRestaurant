import { z } from "zod";
import { TIME_SLOTS } from "@/lib/reservation/time-slots";

// ⚠️ Message ở đây là **key** trong namespace `Validation` của `messages/*.json`,
// không phải chữ hiển thị. Xem ghi chú đầy đủ trong `auth.ts`.

export const reservationFormSchema = z.object({
  guestName: z.string().trim().min(2, "nameRequired"),
  guestPhone: z.string().regex(/^0[35789]\d{8}$/, "phoneInvalid"),
  guestEmail: z.union([z.string().trim().email("emailInvalid"), z.literal("")]),
  // Kiểm định dạng, không chỉ "không rỗng": `date` rác ("abc") từng lọt vào DB được.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateRequired"),
  // Chỉ nhận đúng các khung giờ nhà hàng mở — client tự soạn request từng gửi được "03:00".
  timeSlot: z.enum(TIME_SLOTS, { message: "timeSlotRequired" }),
  partySize: z.coerce.number().int().min(1, "partySizeMin").max(20, "partySizeMax"),
  note: z.string().trim(),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
