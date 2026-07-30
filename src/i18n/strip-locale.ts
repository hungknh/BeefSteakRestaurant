import { LOCALES, routing, type Locale } from "./routing";

/**
 * Bỏ prefix locale khỏi pathname: "/en/admin" -> "/admin", "/admin" -> "/admin".
 *
 * Cần thiết vì `localePrefix: "as-needed"` khiến mỗi trang có 2 URL. Mọi chỗ so khớp
 * đường dẫn (chặn quyền trong `proxy.ts`, robots...) phải so trên bản đã bỏ prefix,
 * không thì bản tiếng Anh lọt qua.
 *
 * Cố ý không import next-intl: dùng ở Edge runtime.
 */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Locale đọc từ pathname. Không có prefix = defaultLocale (as-needed). */
export function localeFromPathname(pathname: string): Locale {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale;
  }
  return routing.defaultLocale;
}

/** Thêm prefix locale vào đường dẫn (đường dẫn truyền vào KHÔNG có prefix). */
export function withLocale(locale: string, path: string): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}
