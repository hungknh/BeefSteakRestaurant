import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPromotions } from "@/lib/data/promotions";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const promos = await getPromotions();
  return (
    <>
      <Header promos={promos} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
