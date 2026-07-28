import { describe, expect, it } from "vitest";
import { dishFormSchema } from "./dish";

const base = {
  name: "Bít Tết Wagyu A5",
  description: "Thịt bò Wagyu A5 nhập khẩu, nướng chuẩn vị.",
  price: 890000,
  imageUrl: "/images/wagyu.jpg",
  categoryId: "cat-steak",
  isAvailable: true,
  isFeatured: false,
  weightGram: 300,
  hasDoneness: true,
};

describe("dishFormSchema", () => {
  it("dữ liệu hợp lệ -> pass", () => {
    expect(dishFormSchema.safeParse(base).success).toBe(true);
  });

  it("weightGram = null (không bắt buộc) -> pass", () => {
    expect(dishFormSchema.safeParse({ ...base, weightGram: null }).success).toBe(true);
  });

  it("tên quá ngắn -> lỗi", () => {
    expect(dishFormSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("giá âm -> lỗi", () => {
    expect(dishFormSchema.safeParse({ ...base, price: -1000 }).success).toBe(false);
  });

  it("thiếu categoryId -> lỗi", () => {
    expect(dishFormSchema.safeParse({ ...base, categoryId: "" }).success).toBe(false);
  });
});
