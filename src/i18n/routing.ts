import { defineRouting } from "next-intl/routing";

export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "vi",
  // as-needed: tiếng Việt là mặc định nên KHÔNG có prefix (`/thuc-don`), tiếng Anh có
  // (`/en/thuc-don`). Giữ nguyên mọi URL cũ đã đưa vào sitemap ở Giai đoạn 12.
  localePrefix: "as-needed",
});
