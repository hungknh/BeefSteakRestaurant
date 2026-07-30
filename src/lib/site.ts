/**
 * Thông tin nhà hàng dùng chung cho SEO/JSON-LD — khớp với những gì Footer hiển thị
 * (`src/components/layout/footer.tsx`). Sửa ở đây thì sửa cả Footer cho khớp.
 */
export const SITE = {
  name: "Beef Haven",
  description: "Nhà hàng bít tết cao cấp — thực đơn, khuyến mãi và đặt bàn trực tuyến.",
  // Ưu tiên biến Vercel tự set (`VERCEL_PROJECT_PRODUCTION_URL`) để bản preview/prod
  // không hard-code sai domain; fallback là domain demo hiện tại.
  url: process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://beefsteakhouse.vercel.app",
  ogImage: "/images/hero.jpg",
  phone: "028 3822 1010",
  email: "lienhe@beefhaven.vn",
  address: {
    street: "12 Lê Lợi",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    country: "VN",
  },
  /** Giờ mở cửa dạng schema.org OpeningHoursSpecification. */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "11:00",
      closes: "22:00",
    },
    { days: ["Saturday", "Sunday"], opens: "10:00", closes: "23:00" },
  ],
} as const;
