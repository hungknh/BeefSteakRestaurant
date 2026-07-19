import { getAllPromotions } from "@/lib/data/promotions";
import { getCategories } from "@/lib/data/categories";
import { getDishes } from "@/lib/data/dishes";
import { PromotionsTable } from "@/components/admin/promotions-table";

export const metadata = { title: "Admin — Khuyến Mãi" };

export default async function AdminPromotionsPage() {
  const [promotions, categories, dishes] = await Promise.all([
    getAllPromotions(),
    getCategories(),
    getDishes(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Khuyến Mãi</h1>
      <PromotionsTable initialPromotions={promotions} categories={categories} dishes={dishes} />
    </div>
  );
}
