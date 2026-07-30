import { z } from "zod";

// ⚠️ Message ở đây là **key** trong namespace `Validation` của `messages/*.json`,
// không phải chữ hiển thị. Xem ghi chú đầy đủ trong `auth.ts`.

export const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "ratingRequired").max(5, "ratingMax"),
  content: z
    .string()
    .trim()
    .min(10, "reviewTooShort")
    .max(1000, "reviewTooLong"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
