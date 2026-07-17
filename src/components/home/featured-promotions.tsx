import { SectionHeading } from "@/components/shared/section-heading";
import { PromoCard } from "@/components/promotion/promo-card";
import { getPromotions } from "@/lib/data/promotions";

export async function FeaturedPromotions() {
  const promotions = await getPromotions();
  const firstRow = promotions.slice(0, 3);
  const secondRow = promotions.slice(3, 5);

  return (
    <section className="bg-background-alt py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ưu đãi có hạn"
          title="Khuyến Mãi Nổi Bật"
          description="Những ưu đãi đang áp dụng tại BeefSteakHouse, cập nhật theo ngày trong tuần."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {firstRow.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>

        {secondRow.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            {secondRow.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
