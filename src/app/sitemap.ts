import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/routing";
import { getDishes } from "@/lib/data/dishes";
import { getPromotions } from "@/lib/data/promotions";
import { localeUrl } from "@/lib/seo/alternates";

// force-dynamic: sitemap đọc DB. Nếu để Next sinh lúc build thì (1) build cần
// DATABASE_URL (CI không có), (2) món/khuyến mãi thêm sau deploy sẽ không có trong
// sitemap cho tới lần deploy kế tiếp. Sinh tại request time giải quyết cả hai.
export const dynamic = "force-dynamic";

/** Mọi đường dẫn (chưa có prefix locale) cần vào sitemap, kèm độ ưu tiên. */
type Entry = { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dishes, promos] = await Promise.all([getDishes(), getPromotions()]);

  const entries: Entry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/thuc-don", changeFrequency: "weekly", priority: 0.9 },
    { path: "/khuyen-mai", changeFrequency: "weekly", priority: 0.9 },
    { path: "/dat-ban", changeFrequency: "monthly", priority: 0.8 },
    { path: "/lien-he", changeFrequency: "yearly", priority: 0.5 },
    ...dishes.map((d) => ({
      path: `/thuc-don/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...promos.map((p) => ({
      path: `/khuyen-mai/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  // Mỗi đường dẫn ra 1 <url> cho mỗi ngôn ngữ, và mỗi <url> khai `alternates.languages`
  // để Google biết 2 bản là cùng một trang khác tiếng (hreflang) chứ không phải trùng lặp.
  return entries.flatMap((entry) =>
    LOCALES.map((locale) => ({
      url: localeUrl(locale, entry.path),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, entry.path)])),
      },
    })),
  );
}
