import { LOCALES, routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

/** Đường dẫn tuyệt đối cho 1 locale. `vi` là defaultLocale nên không có prefix (as-needed). */
export function localeUrl(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale
    ? `${SITE.url}${clean || "/"}`
    : `${SITE.url}/${locale}${clean}`;
}

/**
 * `alternates` cho `generateMetadata` — canonical trỏ đúng bản đang xem (KHÔNG phải luôn
 * trỏ bản tiếng Việt), kèm hreflang cho cả 2 ngôn ngữ. Next tự render
 * `<link rel="alternate" hreflang="...">` từ `languages`.
 *
 * `path` là đường dẫn KHÔNG có prefix locale, ví dụ "/thuc-don".
 */
export function localeAlternates(path: string, locale: string) {
  return {
    canonical: localeUrl(locale, path),
    languages: Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, path)])),
  };
}

/** Mã locale dạng OpenGraph (`vi_VN` / `en_US`). */
export function ogLocale(locale: string): string {
  return locale === "en" ? "en_US" : "vi_VN";
}
