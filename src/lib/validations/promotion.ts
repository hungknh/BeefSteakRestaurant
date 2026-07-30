import { z } from "zod";

export const promotionFormSchema = z
  .object({
    title: z.string().trim().min(2, "Vui lòng nhập tiêu đề"),
    // Các field `*En` KHÔNG bắt buộc — để trống thì bản tiếng Anh hiện nội dung tiếng Việt
    // (xem `src/lib/i18n-content.ts`). Cho phép chuỗi rỗng vì input HTML luôn gửi "".
    titleEn: z.string().trim(),
    description: z.string().trim().min(1, "Vui lòng nhập mô tả"),
    descriptionEn: z.string().trim(),
    imageUrl: z.string().trim().min(1, "Vui lòng nhập URL ảnh"),
    badgeLabel: z.string().trim().min(1, "Vui lòng nhập nhãn badge"),
    badgeLabelEn: z.string().trim(),
    badgeOffer: z.string().trim().min(1, "Vui lòng nhập nội dung ưu đãi"),
    badgeOfferEn: z.string().trim(),
    scheduleText: z.string().trim().min(1, "Vui lòng nhập lịch áp dụng"),
    scheduleTextEn: z.string().trim(),
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
