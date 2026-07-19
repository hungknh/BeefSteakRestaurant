import { describe, expect, it } from "vitest";
import { computeCartTotals } from "./totals";
import type { CartLine } from "@/lib/promotions/apply";
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

const NOW = new Date(2026, 6, 16, 19, 0);

describe("computeCartTotals", () => {
  it("không có khuyến mãi -> discount 0, total = subtotal", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const totals = computeCartTotals(lines, [], NOW);
    expect(totals).toEqual({ subtotal: 300000, discount: 0, promotionTitle: null, total: 300000 });
  });

  it("có khuyến mãi khớp -> trừ discount vào total", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ discountType: "PERCENT", discountValue: 10 });
    const totals = computeCartTotals(lines, [promo], NOW);
    expect(totals.discount).toBe(30000);
    expect(totals.promotionTitle).toBe("Ưu đãi");
    expect(totals.total).toBe(270000);
  });

  it("cộng thêm shippingFee sau khi đã trừ discount", () => {
    const lines: CartLine[] = [{ dish: makeDish({ price: 300000 }), quantity: 1 }];
    const promo = makePromo({ discountType: "FIXED", discountValue: 50000 });
    const totals = computeCartTotals(lines, [promo], NOW, 30000);
    expect(totals.total).toBe(300000 - 50000 + 30000);
  });

  it("giỏ rỗng -> subtotal 0, total = shippingFee", () => {
    const totals = computeCartTotals([], [], NOW, 30000);
    expect(totals).toEqual({ subtotal: 0, discount: 0, promotionTitle: null, total: 30000 });
  });
});
