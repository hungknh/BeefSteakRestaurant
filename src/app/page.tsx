import { Hero } from "@/components/home/hero";
import { FeaturedPromotions } from "@/components/home/featured-promotions";
import { StandardCards } from "@/components/home/standard-cards";
import { MenuPreview } from "@/components/home/menu-preview";
import { ReviewsPreview } from "@/components/home/reviews-preview";
import { ReservationCta } from "@/components/home/reservation-cta";

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
