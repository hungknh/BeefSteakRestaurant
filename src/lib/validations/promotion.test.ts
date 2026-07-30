import { describe, expect, it } from "vitest";
import { promotionFormSchema } from "./promotion";

const base = {
  title: "Giờ Vàng",
  titleEn: "Happy Hour",
  description: "Giảm giá khung giờ thấp điểm.",
  descriptionEn: "Off-peak discount.",
  imageUrl: "/images/gio-vang.jpg",
  badgeLabel: "HÀNG NGÀY",
  badgeLabelEn: "DAILY",
  badgeOffer: "GIẢM 20%",
  badgeOfferEn: "20% OFF",
  scheduleText: "T2-T6, 14:00-17:00",
  scheduleTextEn: "MON-FRI, 14:00-17:00",
  discountType: "PERCENT" as const,
  discountValue: 20,
  scope: "ALL" as const,
  targetCategoryId: null,
  targetDishId: null,
  daysOfWeek: "1,2,3,4,5",
  startTime: "14:00",
  endTime: "17:00",
  minSubtotal: 0,
  startDate: null,
  endDate: null,
  isActive: true,
  sortOrder: 1,
};

describe("promotionFormSchema", () => {
  // Bản dịch không bắt buộc: để trống thì bản tiếng Anh hiện nội dung tiếng Việt.
  it("mọi field tiếng Anh để rỗng -> vẫn pass", () => {
    const khongDich = {
      ...base,
      titleEn: "",
      descriptionEn: "",
      badgeLabelEn: "",
      badgeOfferEn: "",
      scheduleTextEn: "",
    };
    expect(promotionFormSchema.safeParse(khongDich).success).toBe(true);
  });

  it("scope ALL, dữ liệu hợp lệ -> pass", () => {
    expect(promotionFormSchema.safeParse(base).success).toBe(true);
  });

  it("scope CATEGORY thiếu targetCategoryId -> lỗi", () => {
    const result = promotionFormSchema.safeParse({ ...base, scope: "CATEGORY", targetCategoryId: null });
    expect(result.success).toBe(false);
  });

  it("scope CATEGORY có targetCategoryId -> pass", () => {
    const result = promotionFormSchema.safeParse({
      ...base,
      scope: "CATEGORY",
      targetCategoryId: "cat-steak",
    });
    expect(result.success).toBe(true);
  });

  it("scope DISH thiếu targetDishId -> lỗi", () => {
    const result = promotionFormSchema.safeParse({ ...base, scope: "DISH", targetDishId: null });
    expect(result.success).toBe(false);
  });

  it("thiếu badgeLabel -> lỗi", () => {
    expect(promotionFormSchema.safeParse({ ...base, badgeLabel: "" }).success).toBe(false);
  });
});
