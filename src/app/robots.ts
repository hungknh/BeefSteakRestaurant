import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Trang cần đăng nhập / riêng tư — không có gì để index, chặn cho sạch.
      disallow: ["/admin", "/tai-khoan", "/gio-hang", "/thanh-toan", "/dang-nhap", "/dang-ky"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
