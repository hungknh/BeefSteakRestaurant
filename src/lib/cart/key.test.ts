import { describe, expect, it } from "vitest";
import { cartItemKey } from "./key";

describe("cartItemKey", () => {
  it("giống dishId + doneness + note -> cùng key (gộp dòng)", () => {
    expect(cartItemKey("d1", "MEDIUM_RARE", "")).toBe(cartItemKey("d1", "MEDIUM_RARE", ""));
  });

  it("khác doneness -> khác key (tách dòng riêng)", () => {
    expect(cartItemKey("d1", "RARE", "")).not.toBe(cartItemKey("d1", "WELL_DONE", ""));
  });

  it("khác note -> khác key", () => {
    expect(cartItemKey("d1", null, "không hành")).not.toBe(cartItemKey("d1", null, "ít cay"));
  });

  it("note thừa khoảng trắng -> vẫn cùng key (trim)", () => {
    expect(cartItemKey("d1", null, "không hành")).toBe(cartItemKey("d1", null, "  không hành  "));
  });
});
