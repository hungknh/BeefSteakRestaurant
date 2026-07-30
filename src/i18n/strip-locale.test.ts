import { describe, expect, it } from "vitest";
import { localeFromPathname, stripLocale, withLocale } from "@/i18n/strip-locale";

describe("stripLocale", () => {
  it("bỏ prefix locale không mặc định", () => {
    expect(stripLocale("/en/admin")).toBe("/admin");
    expect(stripLocale("/en/tai-khoan")).toBe("/tai-khoan");
    expect(stripLocale("/en/thuc-don/biet-tet-ribeye-uc")).toBe("/thuc-don/biet-tet-ribeye-uc");
  });

  it("đường dẫn tiếng Việt (không prefix) giữ nguyên", () => {
    expect(stripLocale("/admin")).toBe("/admin");
    expect(stripLocale("/")).toBe("/");
  });

  it("chỉ có locale, không có path -> /", () => {
    expect(stripLocale("/en")).toBe("/");
    expect(stripLocale("/vi")).toBe("/");
  });

  // Bẫy thật: nếu cắt bằng `startsWith("/en")` thay vì `"/en/"` thì các đường dẫn dưới đây
  // bị cắt sai thành "…" và mất quyền chặn.
  it("không cắt nhầm segment chỉ TÌNH CỜ bắt đầu bằng mã locale", () => {
    expect(stripLocale("/english-menu")).toBe("/english-menu");
    expect(stripLocale("/entrees")).toBe("/entrees");
    expect(stripLocale("/vietnam")).toBe("/vietnam");
  });

  it("locale mặc định cũng bỏ được nếu URL có ghi tường minh", () => {
    expect(stripLocale("/vi/admin")).toBe("/admin");
  });
});

describe("localeFromPathname", () => {
  it("có prefix -> đúng locale đó", () => {
    expect(localeFromPathname("/en/admin")).toBe("en");
    expect(localeFromPathname("/en")).toBe("en");
  });

  it("không prefix -> locale mặc định", () => {
    expect(localeFromPathname("/admin")).toBe("vi");
    expect(localeFromPathname("/")).toBe("vi");
  });

  it("segment chỉ tình cờ bắt đầu bằng mã locale -> vẫn là mặc định", () => {
    expect(localeFromPathname("/entrees")).toBe("vi");
  });
});

describe("withLocale", () => {
  it("locale mặc định không thêm prefix", () => {
    expect(withLocale("vi", "/dang-nhap")).toBe("/dang-nhap");
  });

  it("locale khác thì thêm prefix", () => {
    expect(withLocale("en", "/dang-nhap")).toBe("/en/dang-nhap");
  });

  // Bảo vệ vòng lặp: chặn quyền ở proxy.ts dựa vào cặp hàm này khớp nhau.
  it("withLocale rồi stripLocale ra lại đường dẫn gốc", () => {
    for (const locale of ["vi", "en"]) {
      expect(stripLocale(withLocale(locale, "/tai-khoan"))).toBe("/tai-khoan");
    }
  });
});
