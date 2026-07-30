import type { Category, Dish, Promotion } from "@/types";

/**
 * Chọn nội dung theo ngôn ngữ cho dữ liệu đến từ DB.
 *
 * Vì sao là helper chứ không xử lý ở tầng `lib/data/`: tầng đó không biết locale (nó chỉ
 * truy vấn), còn Server Component thì biết. Giữ tầng data trả về nguyên bản ghi, chọn
 * ngôn ngữ lúc render.
 *
 * **Luôn rơi về tiếng Việt khi chưa có bản dịch** — món admin tự tạo có `nameEn = null`,
 * hiện tên tiếng Việt vẫn tốt hơn hiện ô trống.
 *
 * Nội dung khách viết (`Review.content`) cố tình KHÔNG có ở đây: giữ nguyên ngôn ngữ
 * người viết mới đúng thực tế, không dịch máy.
 */

const isEn = (locale: string) => locale === "en";

/** Rơi về `vi` nếu bản dịch null HOẶC là chuỗi rỗng (admin lưu ô trống). */
function pick(vi: string, en: string | null, locale: string): string {
  if (!isEn(locale)) return vi;
  return en && en.trim() ? en : vi;
}

export function categoryName(category: Category, locale: string): string {
  return pick(category.name, category.nameEn, locale);
}

/**
 * Nhận structural type thay vì nguyên `Dish`: dashboard truyền `TopDish` (chỉ select vài
 * cột từ DB), đòi đủ `Dish` là không truyền được mà cũng không cần — hàm chỉ đọc 2 field.
 */
export function dishName(dish: Pick<Dish, "name" | "nameEn">, locale: string): string {
  return pick(dish.name, dish.nameEn, locale);
}

export function dishDescription(dish: Dish, locale: string): string {
  return pick(dish.description, dish.descriptionEn, locale);
}

export function promoTitle(promo: Promotion, locale: string): string {
  return pick(promo.title, promo.titleEn, locale);
}

export function promoDescription(promo: Promotion, locale: string): string {
  return pick(promo.description, promo.descriptionEn, locale);
}

export function promoBadgeLabel(promo: Promotion, locale: string): string {
  return pick(promo.badgeLabel, promo.badgeLabelEn, locale);
}

export function promoBadgeOffer(promo: Promotion, locale: string): string {
  return pick(promo.badgeOffer, promo.badgeOfferEn, locale);
}

export function promoScheduleText(promo: Promotion, locale: string): string {
  return pick(promo.scheduleText, promo.scheduleTextEn, locale);
}
