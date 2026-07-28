import { z } from "zod";

export const promotionFormSchema = z
  .object({
    title: z.string().trim().min(2, "Vui lòng nhập tiêu đề"),
    description: z.string().trim().min(1, "Vui lòng nhập mô tả"),
    imageUrl: z.string().trim().min(1, "Vui lòng nhập URL ảnh"),
    badgeLabel: z.string().trim().min(1, "Vui lòng nhập nhãn badge"),
    badgeOffer: z.string().trim().min(1, "Vui lòng nhập nội dung ưu đãi"),
    scheduleText: z.string().trim().min(1, "Vui lòng nhập lịch áp dụng"),
    discountType: z.enum(["PERCENT", "FIXED", "NONE"]),
    discountValue: z.number().int().min(0, "Giá trị giảm không hợp lệ"),
    scope: z.enum(["ALL", "CATEGORY", "DISH"]),
    targetCategoryId: z.string().nullable(),
    targetDishId: z.string().nullable(),
    daysOfWeek: z.string(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    minSubtotal: z.number().int().min(0, "Hóa đơn tối thiểu không hợp lệ"),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
  })
  .refine((data) => data.scope !== "CATEGORY" || !!data.targetCategoryId, {
    message: "Vui lòng chọn danh mục áp dụng",
    path: ["targetCategoryId"],
  })
  .refine((data) => data.scope !== "DISH" || !!data.targetDishId, {
    message: "Vui lòng chọn món áp dụng",
    path: ["targetDishId"],
  });

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
