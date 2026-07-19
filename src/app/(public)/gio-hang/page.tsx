import { getPromotions } from "@/lib/data/promotions";
import { CartPageView } from "@/components/cart/cart-page-view";

export const metadata = { title: "Giỏ Hàng" };

export default async function CartPage() {
  const promos = await getPromotions();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Giỏ Hàng Của Bạn</h1>
      <CartPageView promos={promos} />
    </div>
  );
}
