import { describe, expect, it } from "vitest";
import { reservationFormSchema } from "./reservation";

const base = {
  guestName: "Nguyễn Văn A",
  guestPhone: "0912345678",
  guestEmail: "",
  date: "2026-07-20",
  timeSlot: "19:00",
  partySize: 2,
  note: "",
};

describe("reservationFormSchema", () => {
  it("dữ liệu hợp lệ, email rỗng -> pass", () => {
    expect(reservationFormSchema.safeParse(base).success).toBe(true);
  });

  it("email hợp lệ -> pass", () => {
    expect(
      reservationFormSchema.safeParse({ ...base, guestEmail: "a@example.com" }).success,
    ).toBe(true);
  });

  it("email sai định dạng -> lỗi", () => {
    expect(reservationFormSchema.safeParse({ ...base, guestEmail: "khong-hop-le" }).success).toBe(
      false,
    );
  });

  it("số điện thoại sai định dạng -> lỗi", () => {
    expect(reservationFormSchema.safeParse({ ...base, guestPhone: "123" }).success).toBe(false);
  });

  it("partySize truyền dạng chuỗi vẫn coerce được", () => {
    const result = reservationFormSchema.safeParse({ ...base, partySize: "4" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.partySize).toBe(4);
  });

  it("partySize vượt quá 20 -> lỗi", () => {
    expect(reservationFormSchema.safeParse({ ...base, partySize: 25 }).success).toBe(false);
  });
});
