import type { MetadataRoute } from "next";
import { getDishes } from "@/lib/data/dishes";
import { getPromotions } from "@/lib/data/promotions";
import { SITE } from "@/lib/site";

// force-dynamic: sitemap đọc DB. Nếu để Next sinh lúc build thì (1) build cần
// DATABASE_URL (CI không có), (2) món/khuyến mãi thêm sau deploy sẽ không có trong
// sitemap cho tới lần deploy kế tiếp. Sinh tại request time giải quyết cả hai.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dishes, promos] = await Promise.all([getDishes(), getPromotions()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/thuc-don`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/khuyen-mai`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/dat-ban`, changeFrequency: "monthly", priority: 0.8 },
  ];

  return [
    ...staticPages,
    ...dishes.map((dish) => ({
      url: `${SITE.url}/thuc-don/${dish.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...promos.map((promo) => ({
      url: `${SITE.url}/khuyen-mai/${promo.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
