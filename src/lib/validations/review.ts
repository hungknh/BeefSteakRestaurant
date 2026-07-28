import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "Vui lòng chọn số sao").max(5, "Tối đa 5 sao"),
  content: z
    .string()
    .trim()
    .min(10, "Đánh giá cần ít nhất 10 ký tự")
    .max(1000, "Đánh giá tối đa 1000 ký tự"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
