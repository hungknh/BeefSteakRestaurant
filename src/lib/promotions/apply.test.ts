import { describe, expect, it } from "vitest";
import { bestPromotion, type CartLine } from "./apply";
import type { Dish, Promotion } from "@/types";

function makeDish(overrides: Partial<Dish> = {}): Dish {
  return {
    id: "d1",
    name: "Bít Tết Ribeye",
    slug: "bit-tet-ribeye",
    description: "",
    price: 300000,
    imageUrl: "",
    categoryId: "cat-steak",
    isAvailable: true,
    isFeatured: false,
    weightGram: 250,
    hasDoneness: true,
    avgRating: 0,
    reviewCount: 0,
    ...overrides,
  };
}

function makePromo(overrides: Partial<Promotion> = {}): Promotion {
  return {
    id: "promo-1",
    title: "Ưu đãi",
    slug: "uu-dai",
    description: "",
    imageUrl: "",
    badgeLabel: "",
    badgeOffer: "",
    scheduleText: "",
    discountType: "PERCENT",
    discountValue: 10,
    scope: "ALL",
    targetCategoryId: null,
    targetDishId: null,
    daysOfWeek: "",
    startTime: null,
    endTime: null,
    minSubtotal: 0,
    startDate: null,
    endDate: null,
    isActive: true,
    sortOrder: 1,
    ...overrides,
  };
}

// Thứ Năm, 2026-07-16 19:00 giờ địa phương.
const THURSDAY_19H = new Date(2026, 6, 16, 19, 0);

describe("bestPromotion", () => {
  it("áp PERCENT cơ bản cho scope=ALL", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ discountType: "PERCENT", discountValue: 10 });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)).toEqual({ promotion: promo, discount: 30000 });
  });

  it("giỏ rỗng trả về null, không chia cho 0", () => {
    expect(bestPromotion([], [makePromo()], THURSDAY_19H)).toBeNull();
  });

  it("PERCENT làm tròn xuống (Math.floor), có lợi cho quán", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 101 }), quantity: 1 }];
    const promo = makePromo({ discountType: "PERCENT", discountValue: 50 });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)?.discount).toBe(50); // 50.5 -> 50
  });

  it("FIXED lớn hơn subtotal thì bị giới hạn bằng subtotal (Math.min)", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ discountType: "FIXED", discountValue: 500000 });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)?.discount).toBe(300000);
  });

  it("scope=DISH không khớp món trong giỏ -> không áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ id: "d2" }), quantity: 1 }];
    const promo = makePromo({ scope: "DISH", targetDishId: "d1" });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)).toBeNull();
  });

  it("scope=DISH khớp món -> chỉ tính giảm trên món đó", () => {
    const lines: CartLine[] = [
      { dish: makeDish({ id: "d1", price: 300000 }), quantity: 1 },
      { dish: makeDish({ id: "d2", price: 100000 }), quantity: 1 },
    ];
    const promo = makePromo({ scope: "DISH", targetDishId: "d1", discountType: "PERCENT", discountValue: 10 });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)?.discount).toBe(30000);
  });

  it("2 promo giảm bằng nhau -> giữ cái xuất hiện đầu tiên (ổn định, không random)", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const first = makePromo({ id: "promo-a", discountType: "FIXED", discountValue: 30000 });
    const second = makePromo({ id: "promo-b", discountType: "FIXED", discountValue: 30000 });
    expect(bestPromotion(lines, [first, second], THURSDAY_19H)?.promotion.id).toBe("promo-a");
  });

  it("dưới minSubtotal -> không áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 100000 }), quantity: 1 }];
    const promo = makePromo({ minSubtotal: 300000 });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)).toBeNull();
  });

  it("isActive=false -> không áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ isActive: false });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)).toBeNull();
  });

  it("daysOfWeek không khớp ngày hiện tại -> không áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ daysOfWeek: "5,6,0" }); // T6-CN, hôm nay là Thứ Năm (4)
    expect(bestPromotion(lines, [promo], THURSDAY_19H)).toBeNull();
  });

  it("ngoài khoảng startDate/endDate -> không áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ startDate: "2026-08-01", endDate: "2026-08-31" });
    expect(bestPromotion(lines, [promo], THURSDAY_19H)).toBeNull();
  });

  it("khung giờ vắt qua nửa đêm (22:00-02:00): trong khung trước nửa đêm -> áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ startTime: "22:00", endTime: "02:00" });
    const at23h = new Date(2026, 6, 16, 23, 0);
    expect(bestPromotion(lines, [promo], at23h)?.discount).toBeGreaterThan(0);
  });

  it("khung giờ vắt qua nửa đêm (22:00-02:00): trong khung sau nửa đêm -> áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ startTime: "22:00", endTime: "02:00" });
    const at01h = new Date(2026, 6, 17, 1, 0);
    expect(bestPromotion(lines, [promo], at01h)?.discount).toBeGreaterThan(0);
  });

  it("khung giờ vắt qua nửa đêm (22:00-02:00): ngoài khung -> không áp dụng", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ startTime: "22:00", endTime: "02:00" });
    const at10h = new Date(2026, 6, 16, 10, 0);
    expect(bestPromotion(lines, [promo], at10h)).toBeNull();
  });

  it("chọn khuyến mãi giảm nhiều nhất trong nhiều lựa chọn", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 1000000 }), quantity: 1 }];
    const small = makePromo({ id: "promo-small", discountType: "FIXED", discountValue: 50000 });
    const big = makePromo({ id: "promo-big", discountType: "PERCENT", discountValue: 20 });
    expect(bestPromotion(lines, [small, big], THURSDAY_19H)?.promotion.id).toBe("promo-big");
  });
});
