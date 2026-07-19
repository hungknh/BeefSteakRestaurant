import { getPromotions } from "@/lib/data/promotions";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata = { title: "Thanh Toán" };

export default async function CheckoutPage() {
  const promos = await getPromotions();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Thanh Toán</h1>
      <CheckoutForm promos={promos} />
    </div>
  );
}
