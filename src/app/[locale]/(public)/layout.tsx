import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/shared/json-ld";
import { getPromotions } from "@/lib/data/promotions";
import { restaurantJsonLd } from "@/lib/seo/structured-data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const promos = await getPromotions();
  return (
    <>
      <JsonLd data={restaurantJsonLd()} />
      <Header promos={promos} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
