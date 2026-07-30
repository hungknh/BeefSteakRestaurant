import { getPromotionBySlug } from "@/lib/data/promotions";
import { ReservationForm } from "@/components/reservation/reservation-form";

export const metadata = { title: "Đặt Bàn" };

type Props = { searchParams: Promise<{ promo?: string }> };

export default async function ReservationPage({ searchParams }: Props) {
  const { promo: promoSlug } = await searchParams;
  const promo = promoSlug ? await getPromotionBySlug(promoSlug) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl text-foreground sm:text-4xl">Đặt Bàn</h1>
      <ReservationForm promo={promo} />
    </div>
  );
}
