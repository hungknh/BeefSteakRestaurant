import { describe, expect, it } from "vitest";
import {
  isBookingDateAllowed,
  isSlotDisabled,
  MAX_BOOKING_DAYS_AHEAD,
  toLocalDateStr,
} from "./time-slots";

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

/**
 * Lớp chặn cho lỗ hổng đã sửa: `min={today}` trên `<input type="date">` chỉ chặn ở client,
 * request tự soạn tạo được đặt bàn cho ngày đã qua.
 */
describe("isBookingDateAllowed", () => {
  const now = new Date("2026-07-30T12:00:00");

  it("hôm nay -> cho phép", () => {
    expect(isBookingDateAllowed("2026-07-30", now)).toBe(true);
  });

  it("ngày mai -> cho phép", () => {
    expect(isBookingDateAllowed("2026-07-31", now)).toBe(true);
  });

  // ⭐ Chính lỗ hổng đã sửa.
  it("ngày đã qua -> từ chối", () => {
    expect(isBookingDateAllowed("2026-07-29", now)).toBe(false);
    expect(isBookingDateAllowed("2020-01-01", now)).toBe(false);
  });

  it("đúng mốc tối đa -> cho phép, quá 1 ngày -> từ chối", () => {
    const limit = new Date(now);
    limit.setDate(limit.getDate() + MAX_BOOKING_DAYS_AHEAD);
    expect(isBookingDateAllowed(toLocalDateStr(limit), now)).toBe(true);

    limit.setDate(limit.getDate() + 1);
    expect(isBookingDateAllowed(toLocalDateStr(limit), now)).toBe(false);
  });

  it("chuỗi rác -> từ chối", () => {
    for (const rac of ["abc", "", "2026-7-30", "30-07-2026", "2026-07-30T00:00", "9999-99-99"]) {
      expect(isBookingDateAllowed(rac, now), rac).toBe(false);
    }
  });

  // Bẫy múi giờ: so sánh bằng chuỗi YYYY-MM-DD nên không lệch khi gần nửa đêm.
  it("23:59 hôm nay vẫn cho đặt hôm nay", () => {
    expect(isBookingDateAllowed("2026-07-30", new Date("2026-07-30T23:59:00"))).toBe(true);
  });
});
