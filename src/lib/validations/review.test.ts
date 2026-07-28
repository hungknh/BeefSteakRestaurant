import { describe, expect, it } from "vitest";
import { reviewFormSchema } from "./review";

describe("reviewFormSchema", () => {
  it("rating hợp lệ (1-5) + content đủ dài -> pass", () => {
    const result = reviewFormSchema.safeParse({
      rating: 5,
      content: "Món ăn rất ngon, phục vụ chu đáo.",
    });
    expect(result.success).toBe(true);
  });

  it("rating = 0 -> lỗi", () => {
    const result = reviewFormSchema.safeParse({
      rating: 0,
      content: "Món ăn rất ngon, phục vụ chu đáo.",
    });
    expect(result.success).toBe(false);
  });

  it("rating = 6 -> lỗi", () => {
    const result = reviewFormSchema.safeParse({
      rating: 6,
      content: "Món ăn rất ngon, phục vụ chu đáo.",
    });
    expect(result.success).toBe(false);
  });

  it("content quá ngắn (< 10 ký tự) -> lỗi", () => {
    const result = reviewFormSchema.safeParse({ rating: 5, content: "Ngon" });
    expect(result.success).toBe(false);
  });

  it("content quá dài (> 1000 ký tự) -> lỗi", () => {
    const result = reviewFormSchema.safeParse({ rating: 5, content: "a".repeat(1001) });
    expect(result.success).toBe(false);
  });
});
