import { describe, expect, it } from "vitest";
import { isSlotDisabled, toLocalDateStr } from "./time-slots";

describe("isSlotDisabled", () => {
  const today = new Date(2026, 6, 16, 19, 15); // Thứ Năm 16/7/2026, 19:15

  it("chọn ngày khác hôm nay -> không giờ nào bị disable", () => {
    expect(isSlotDisabled("17:00", "2026-07-17", today)).toBe(false);
  });

  it("chọn hôm nay, giờ đã qua -> disable", () => {
    expect(isSlotDisabled("19:00", toLocalDateStr(today), today)).toBe(true);
  });

  it("chọn hôm nay, giờ chưa tới -> không disable", () => {
    expect(isSlotDisabled("19:30", toLocalDateStr(today), today)).toBe(false);
  });
});
