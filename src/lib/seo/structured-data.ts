import { SITE } from "@/lib/site";
import type { Dish } from "@/types";

/** JSON-LD `Restaurant` — dùng ở layout công khai nên hiện trên mọi trang khách. */
export function restaurantJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE.url}/#restaurant`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}${SITE.ogImage}`,
    telephone: SITE.phone,
    email: SITE.email,
    servesCuisine: ["Steakhouse", "Âu"],
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.district,
      addressRegion: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: SITE.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    acceptsReservations: `${SITE.url}/dat-ban`,
    hasMenu: `${SITE.url}/thuc-don`,
  };
}

/**
 * JSON-LD `Menu` — nhóm món theo danh mục thành các `MenuSection`.
 * Giá trong `offers` là giá gốc (`price`), không phải giá sau khuyến mãi: khuyến mãi
 * phụ thuộc ngày/giờ/giỏ hàng (xem `bestPromotion()`), không biểu diễn được tĩnh ở đây.
 */
export function menuJsonLd(dishes: Dish[]): Record<string, unknown> {
  const sections = new Map<string, Dish[]>();
  for (const dish of dishes) {
    const name = dish.category?.name ?? "Khác";
    const list = sections.get(name);
    if (list) list.push(dish);
    else sections.set(name, [dish]);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Thực đơn ${SITE.name}`,
    url: `${SITE.url}/thuc-don`,
    inLanguage: "vi-VN",
    hasMenuSection: [...sections].map(([sectionName, sectionDishes]) => ({
      "@type": "MenuSection",
      name: sectionName,
      hasMenuItem: sectionDishes.map((dish) => ({
        "@type": "MenuItem",
        name: dish.name,
        description: dish.description,
        url: `${SITE.url}/thuc-don/${dish.slug}`,
        offers: {
          "@type": "Offer",
          price: dish.price,
          priceCurrency: "VND",
        },
      })),
    })),
  };
}
