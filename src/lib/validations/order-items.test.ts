import { describe, expect, it } from "vitest";
import {
  MAX_LINES_PER_ORDER,
  MAX_QUANTITY_PER_LINE,
  orderItemsSchema,
} from "@/lib/validations/order";

const line = {
  dishId: "dish-ribeye-uc",
  quantity: 2,
  doneness: "MEDIUM_RARE" as const,
  note: "",
};

/**
 * Đây là lớp chặn cho lỗ hổng thật: trước khi có schema này, `createOrder` chỉ validate
 * `values` còn mảng items nhận nguyên từ client. Type TypeScript bị xoá lúc runtime nên
 * `quantity: -10` vào thẳng phép tính tiền → tạo được đơn có total âm.
 */
describe("orderItemsSchema", () => {
  it("dòng hợp lệ -> pass", () => {
    expect(orderItemsSchema.safeParse([line]).success).toBe(true);
  });

  it("giỏ rỗng -> lỗi", () => {
    expect(orderItemsSchema.safeParse([]).success).toBe(false);
  });

  // ⭐ Chính lỗ hổng đã sửa.
  it("số lượng âm -> lỗi (nếu pass thì tạo được đơn total âm)", () => {
    expect(orderItemsSchema.safeParse([{ ...line, quantity: -10 }]).success).toBe(false);
  });

  it("số lượng 0 -> lỗi", () => {
    expect(orderItemsSchema.safeParse([{ ...line, quantity: 0 }]).success).toBe(false);
  });

  it("số lượng không nguyên -> lỗi", () => {
    expect(orderItemsSchema.safeParse([{ ...line, quantity: 1.5 }]).success).toBe(false);
  });

  it("số lượng vượt trần -> lỗi", () => {
    expect(
      orderItemsSchema.safeParse([{ ...line, quantity: MAX_QUANTITY_PER_LINE + 1 }]).success,
    ).toBe(false);
  });

  it("số lượng đúng bằng trần -> pass", () => {
    expect(orderItemsSchema.safeParse([{ ...line, quantity: MAX_QUANTITY_PER_LINE }]).success).toBe(
      true,
    );
  });

  it("quá nhiều dòng -> lỗi", () => {
    const nhieu = Array.from({ length: MAX_LINES_PER_ORDER + 1 }, () => line);
    expect(orderItemsSchema.safeParse(nhieu).success).toBe(false);
  });

  it("doneness lạ -> lỗi", () => {
    expect(orderItemsSchema.safeParse([{ ...line, doneness: "CHIN_QUA" }]).success).toBe(false);
  });

  it("doneness null -> pass (món không chọn độ chín)", () => {
    expect(orderItemsSchema.safeParse([{ ...line, doneness: null }]).success).toBe(true);
  });

  it("dishId rỗng -> lỗi", () => {
    expect(orderItemsSchema.safeParse([{ ...line, dishId: "" }]).success).toBe(false);
  });

  it("ghi chú quá dài -> lỗi", () => {
    expect(orderItemsSchema.safeParse([{ ...line, note: "x".repeat(501) }]).success).toBe(false);
  });

  it("thiếu field -> lỗi", () => {
    expect(orderItemsSchema.safeParse([{ dishId: "dish-x", quantity: 1 }]).success).toBe(false);
  });
});
