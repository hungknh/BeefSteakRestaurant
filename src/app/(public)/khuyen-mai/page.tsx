import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { PromoCard } from "@/components/promotion/promo-card";
import { getPromotions } from "@/lib/data/promotions";

export const metadata: Metadata = {
  title: "Khuyến Mãi",
  description: "Toàn bộ ưu đãi đang áp dụng tại BeefSteakHouse.",
};

export default async function KhuyenMaiPage() {
  const promotions = await getPromotions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Ưu đãi có hạn"
        title="Khuyến Mãi"
        description="Cập nhật theo ngày trong tuần, áp dụng trực tiếp khi đặt bàn hoặc đặt món online."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </div>
  );
}
