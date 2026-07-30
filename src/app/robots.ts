import type { MetadataRoute } from "next";
import { LOCALES, routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

// Trang cần đăng nhập / riêng tư — không có gì để index.
const PRIVATE_PATHS = ["/admin", "/tai-khoan", "/gio-hang", "/thanh-toan", "/dang-nhap", "/dang-ky"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Phải chặn cả bản có prefix locale (`/en/admin`) — chặn mỗi `/admin` thì bản tiếng
      // Anh của đúng những trang đó vẫn bị crawl.
      disallow: LOCALES.flatMap((locale) =>
        PRIVATE_PATHS.map((path) =>
          locale === routing.defaultLocale ? path : `/${locale}${path}`,
        ),
      ),
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
