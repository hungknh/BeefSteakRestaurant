import { describe, expect, it } from "vitest";
import { parseSearch, parseSortDir, parseSortKey, tableHref } from "./table-query";

const ALLOWED = ["code", "total", "createdAt"] as const;

describe("parseSortKey", () => {
  it("nhận cột nằm trong whitelist", () => {
    expect(parseSortKey("total", ALLOWED, "createdAt")).toBe("total");
  });

  // Quan trọng nhất: `sort` đi thẳng vào orderBy của Prisma.
  it("cột lạ -> rơi về mặc định, không lọt xuống Prisma", () => {
    expect(parseSortKey("password", ALLOWED, "createdAt")).toBe("createdAt");
    expect(parseSortKey("", ALLOWED, "createdAt")).toBe("createdAt");
    expect(parseSortKey(undefined, ALLOWED, "createdAt")).toBe("createdAt");
  });
});

describe("parseSortDir", () => {
  it("chỉ nhận asc/desc", () => {
    expect(parseSortDir("asc")).toBe("asc");
    expect(parseSortDir("desc")).toBe("desc");
  });

  it("giá trị lạ -> mặc định desc", () => {
    expect(parseSortDir("ASC")).toBe("desc");
    expect(parseSortDir("random")).toBe("desc");
    expect(parseSortDir(undefined)).toBe("desc");
  });
});

describe("parseSearch", () => {
  it("trim và coi chuỗi rỗng là không tìm", () => {
    expect(parseSearch("  bít tết  ")).toBe("bít tết");
    expect(parseSearch("   ")).toBeUndefined();
    expect(parseSearch(undefined)).toBeUndefined();
  });

  it("cắt còn 100 ký tự", () => {
    expect(parseSearch("x".repeat(500))).toHaveLength(100);
  });
});

describe("tableHref", () => {
  it("bỏ tham số rỗng/undefined", () => {
    expect(tableHref("/admin/orders", { q: undefined, sort: "", dir: "asc" })).toBe(
      "/admin/orders?dir=asc",
    );
  });

  it("bỏ page=1 vì đó là mặc định", () => {
    expect(tableHref("/admin/orders", { page: 1 })).toBe("/admin/orders");
    expect(tableHref("/admin/orders", { page: 3 })).toBe("/admin/orders?page=3");
  });

  it("không có tham số nào -> trả về basePath trơn", () => {
    expect(tableHref("/admin/orders", {})).toBe("/admin/orders");
  });

  it("giữ q khi đổi trang — thiếu là bấm Sau mất kết quả tìm kiếm", () => {
    expect(tableHref("/admin/orders", { q: "BS-2025", page: 2 })).toBe(
      "/admin/orders?q=BS-2025&page=2",
    );
  });

  it("encode dấu tiếng Việt", () => {
    expect(tableHref("/admin/reservations", { q: "Nguyễn" })).toContain("Nguy%E1%BB%85n");
  });
});
