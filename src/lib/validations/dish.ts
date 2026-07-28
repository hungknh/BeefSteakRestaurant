import { z } from "zod";

export const dishFormSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập tên món"),
  description: z.string().trim().min(1, "Vui lòng nhập mô tả"),
  price: z.number().int().min(0, "Giá không hợp lệ"),
  imageUrl: z.string().trim().min(1, "Vui lòng nhập URL ảnh"),
  categoryId: z.string().trim().min(1, "Vui lòng chọn danh mục"),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  weightGram: z.number().int().min(0, "Cân nặng không hợp lệ").nullable(),
  hasDoneness: z.boolean(),
});

export type DishFormValues = z.infer<typeof dishFormSchema>;
