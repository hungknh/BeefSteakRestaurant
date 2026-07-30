import { describe, expect, it } from "vitest";
import { categoryName, dishDescription, dishName, promoTitle } from "@/lib/i18n-content";
import type { Category, Dish, Promotion } from "@/types";

const dish = {
  name: "Bít Tết Ribeye Úc",
  nameEn: "Australian Ribeye Steak",
  description: "Ribeye Úc vân mỡ đều.",
  descriptionEn: "Evenly marbled Australian ribeye.",
} as Dish;

describe("i18n-content", () => {
  it("locale vi -> luôn lấy bản tiếng Việt", () => {
    expect(dishName(dish, "vi")).toBe("Bít Tết Ribeye Úc");
    expect(dishDescription(dish, "vi")).toBe("Ribeye Úc vân mỡ đều.");
  });

  it("locale en -> lấy bản dịch", () => {
    expect(dishName(dish, "en")).toBe("Australian Ribeye Steak");
  });

  // Món admin tự tạo chưa có bản dịch. Hiện tên tiếng Việt vẫn tốt hơn ô trống.
  it("en nhưng bản dịch null -> rơi về tiếng Việt, KHÔNG trả rỗng", () => {
    const chuaDich = { ...dish, nameEn: null, descriptionEn: null };
    expect(dishName(chuaDich, "en")).toBe("Bít Tết Ribeye Úc");
    expect(dishDescription(chuaDich, "en")).toBe("Ribeye Úc vân mỡ đều.");
  });

  // Bẫy thật: form admin lưu ô để trống thành "" chứ không phải null.
  it("en nhưng bản dịch là chuỗi rỗng/khoảng trắng -> vẫn rơi về tiếng Việt", () => {
    expect(dishName({ ...dish, nameEn: "" }, "en")).toBe("Bít Tết Ribeye Úc");
    expect(dishName({ ...dish, nameEn: "   " }, "en")).toBe("Bít Tết Ribeye Úc");
  });

  it("locale lạ -> coi như tiếng Việt", () => {
    expect(dishName(dish, "fr")).toBe("Bít Tết Ribeye Úc");
  });

  it("dùng được cho Category và Promotion", () => {
    expect(categoryName({ name: "Bít Tết", nameEn: "Steaks" } as Category, "en")).toBe("Steaks");
    expect(
      promoTitle({ title: "Đêm Bít Tết", titleEn: "Steak Night" } as Promotion, "en"),
    ).toBe("Steak Night");
  });
});
