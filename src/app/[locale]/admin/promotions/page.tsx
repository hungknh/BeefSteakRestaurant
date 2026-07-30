import { getTranslations } from "next-intl/server";
import { getAllPromotions } from "@/lib/data/promotions";
import { getCategories } from "@/lib/data/categories";
import { getDishes } from "@/lib/data/dishes";
import { PromotionsTable } from "@/components/admin/promotions-table";

export async function generateMetadata() {
  const t = await getTranslations("Admin");
  return { title: t("promotions.metaTitle") };
}

export default async function AdminPromotionsPage() {
  const [promotions, categories, dishes, t] = await Promise.all([
    getAllPromotions(),
    getCategories(),
    getDishes(),
    getTranslations("Admin"),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">{t("promotions.heading")}</h1>
      <PromotionsTable initialPromotions={promotions} categories={categories} dishes={dishes} />
    </div>
  );
}
