import { z } from "zod";

// Các field `*En` là bản dịch tiếng Anh, KHÔNG bắt buộc: để trống thì bản tiếng Anh của
// web hiện tên/mô tả tiếng Việt (xem `src/lib/i18n-content.ts`). Cho phép chuỗi rỗng chứ
// không dùng `.optional()` vì input HTML luôn gửi lên "" khi bỏ trống.
export const dishFormSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập tên món"),
  nameEn: z.string().trim(),
  description: z.string().trim().min(1, "Vui lòng nhập mô tả"),
  descriptionEn: z.string().trim(),
  price: z.number().int().min(0, "Giá không hợp lệ"),
  imageUrl: z.string().trim().min(1, "Vui lòng nhập URL ảnh"),
  categoryId: z.string().trim().min(1, "Vui lòng chọn danh mục"),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  weightGram: z.number().int().min(0, "Cân nặng không hợp lệ").nullable(),
  hasDoneness: z.boolean(),
});

export type DishFormValues = z.infer<typeof dishFormSchema>;
