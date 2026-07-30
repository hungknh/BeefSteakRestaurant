import { Hero } from "@/components/home/hero";
import { FeaturedPromotions } from "@/components/home/featured-promotions";
import { StandardCards } from "@/components/home/standard-cards";
import { MenuPreview } from "@/components/home/menu-preview";
import { ReviewsPreview } from "@/components/home/reviews-preview";
import { ReservationCta } from "@/components/home/reservation-cta";

// Trang chủ đọc dishes/promotions/reviews qua các Server Component con — bắt buộc
// force-dynamic để dữ liệu mới trong DB hiện ngay, không đợi build/deploy lại.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedPromotions />
      <StandardCards />
      <MenuPreview />
      <ReviewsPreview />
      <ReservationCta />
    </>
  );
}
