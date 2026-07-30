import { describe, expect, it } from "vitest";
import { CATEGORIES, DISHES, PROMOTIONS } from "./menu";
import { DISH_EN, PROMOTION_EN } from "./menu-en";

// Bẫy thật: thêm món/khuyến mãi mới vào menu.ts mà quên thêm bản dịch vào menu-en.ts.
// UI sẽ tự rơi về tiếng Việt nên KHÔNG vỡ gì — nghĩa là không ai phát hiện. Test này để
// phát hiện.

describe("menu-en", () => {
  it("mọi món đều có bản dịch", () => {
    const thieu = DISHES.filter((d) => !DISH_EN[d.id]).map((d) => d.id);
    expect(thieu).toEqual([]);
  });

  it("mọi khuyến mãi đều có bản dịch", () => {
    const thieu = PROMOTIONS.filter((p) => !PROMOTION_EN[p.id]).map((p) => p.id);
    expect(thieu).toEqual([]);
  });

  it("mọi danh mục đều có nameEn", () => {
    const thieu = CATEGORIES.filter((c) => !c.nameEn).map((c) => c.id);
    expect(thieu).toEqual([]);
  });

  it("không có bản dịch mồ côi (id không còn tồn tại trong menu.ts)", () => {
    const dishIds = new Set(DISHES.map((d) => d.id));
    const promoIds = new Set(PROMOTIONS.map((p) => p.id));
    expect(Object.keys(DISH_EN).filter((id) => !dishIds.has(id))).toEqual([]);
    expect(Object.keys(PROMOTION_EN).filter((id) => !promoIds.has(id))).toEqual([]);
  });

  it("bản dịch không được để rỗng", () => {
    for (const [id, en] of Object.entries(DISH_EN)) {
      expect(en.nameEn.trim(), `${id}.nameEn`).not.toBe("");
      expect(en.descriptionEn.trim(), `${id}.descriptionEn`).not.toBe("");
    }
  });

  // Chuỗi tiếng Anh mà còn dấu tiếng Việt gần như chắc chắn là copy sót chưa dịch.
  //
  // Chỉ liệt kê dấu RIÊNG của tiếng Việt, cố ý bỏ các dấu dùng chung với tiếng Pháp/
  // Latin-1 (à á â è é ê ì í î ò ó ô ù ú û ý ç ë ï): tên món tiếng Anh hợp lệ vẫn có thể
  // chứa chúng — "Crème Brûlée" từng làm test này báo sai. Mọi cụm tiếng Việt thực tế
  // đều có ít nhất một dấu riêng (ế, ư, ộ, đ...) nên vẫn bắt được.
  it("bản dịch không còn sót dấu tiếng Việt", () => {
    const coDauTiengViet = /[ảãạăằắẳẵặầấẩẫậẻẽẹềếểễệỉĩịỏõọồốổỗộơờớởỡợủũụưừứửữựỳỷỹỵđ]/i;
    for (const [id, en] of Object.entries(DISH_EN)) {
      expect(coDauTiengViet.test(en.nameEn), `${id}.nameEn: ${en.nameEn}`).toBe(false);
      expect(coDauTiengViet.test(en.descriptionEn), `${id}.descriptionEn`).toBe(false);
    }
    for (const [id, en] of Object.entries(PROMOTION_EN)) {
      expect(coDauTiengViet.test(en.titleEn), `${id}.titleEn: ${en.titleEn}`).toBe(false);
      expect(coDauTiengViet.test(en.descriptionEn), `${id}.descriptionEn`).toBe(false);
    }
  });
});
