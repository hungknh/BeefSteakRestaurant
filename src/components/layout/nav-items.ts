/**
 * `labelKey` trỏ vào namespace `Nav` trong `messages/*.json` — không hard-code chữ ở đây
 * nữa vì Header/MobileNav/Footer đều render chung danh sách này.
 *
 * ⚠️ Thêm mục mới thì kiểm route tương ứng có tồn tại không: mục "Liên Hệ" từng nằm ở đây
 * suốt 13 giai đoạn mà `/lien-he` chưa được tạo, production trả 404 (PROGRESS.md #55).
 */
export const NAV_ITEMS = [
  { labelKey: "home", href: "/" },
  { labelKey: "promotions", href: "/khuyen-mai" },
  { labelKey: "menu", href: "/thuc-don" },
  { labelKey: "reservation", href: "/dat-ban" },
  { labelKey: "contact", href: "/lien-he" },
] as const;
