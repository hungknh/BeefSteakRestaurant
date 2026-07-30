import { describe, expect, it } from "vitest";
import { formatDaysOfWeek, formatVND } from "@/lib/format";

// Intl chèn U+00A0 (no-break space) trước "₫" trong locale vi-VN, không phải space
// thường — chuẩn hoá trước khi so sánh để test không phụ thuộc ký tự khó thấy này.
const normalize = (s: string) => s.replace(/ /g, " ");

describe("formatVND", () => {
  it("có dấu phân cách nghìn và ký hiệu ₫", () => {
    expect(normalize(formatVND(1250000))).toBe("1.250.000 ₫");
  });

  it("không hiện phần thập phân (VND không có xu)", () => {
    expect(normalize(formatVND(99000))).toBe("99.000 ₫");
  });

  it("0 đồng vẫn ra chuỗi hợp lệ", () => {
    expect(normalize(formatVND(0))).toBe("0 ₫");
  });

  it("số âm (hoàn tiền/giảm giá) giữ dấu trừ", () => {
    expect(normalize(formatVND(-50000))).toBe("-50.000 ₫");
  });
});

describe("formatDaysOfWeek", () => {
  it("chuỗi rỗng = mọi ngày", () => {
    expect(formatDaysOfWeek("")).toBe("Mọi ngày trong tuần");
    expect(formatDaysOfWeek("   ")).toBe("Mọi ngày trong tuần");
  });

  it("CSV nhiều ngày dịch đúng thứ tự đã truyền", () => {
    expect(formatDaysOfWeek("1,4,6")).toBe("Thứ Hai, Thứ Năm, Thứ Bảy");
  });

  it("0 là Chủ Nhật", () => {
    expect(formatDaysOfWeek("0")).toBe("Chủ Nhật");
  });

  it("bỏ qua giá trị rác thay vì ném lỗi", () => {
    expect(formatDaysOfWeek("1,99,2")).toBe("Thứ Hai, Thứ Ba");
  });
});
