import { describe, expect, it } from "vitest";
import { orderFormSchema } from "./order";

const base = {
  receiverName: "Nguyễn Văn A",
  receiverPhone: "0912345678",
  deliveryMethod: "PICKUP" as const,
  address: "",
  note: "",
};

describe("orderFormSchema", () => {
  it("PICKUP không cần địa chỉ", () => {
    expect(orderFormSchema.safeParse(base).success).toBe(true);
  });

  it("DELIVERY thiếu địa chỉ -> lỗi", () => {
    const result = orderFormSchema.safeParse({ ...base, deliveryMethod: "DELIVERY" });
    expect(result.success).toBe(false);
  });

  it("DELIVERY có địa chỉ hợp lệ -> pass", () => {
    const result = orderFormSchema.safeParse({
      ...base,
      deliveryMethod: "DELIVERY",
      address: "123 Đường ABC, Quận 1",
    });
    expect(result.success).toBe(true);
  });

  it("số điện thoại sai định dạng -> lỗi", () => {
    const result = orderFormSchema.safeParse({ ...base, receiverPhone: "123" });
    expect(result.success).toBe(false);
  });
});
