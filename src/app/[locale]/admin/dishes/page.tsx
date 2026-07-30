import { getTranslations } from "next-intl/server";
import { getDishes } from "@/lib/data/dishes";
import { getCategories } from "@/lib/data/categories";
import { DishesTable } from "@/components/admin/dishes-table";

export async function generateMetadata() {
  const t = await getTranslations("Admin");
  return { title: t("dishes.metaTitle") };
}

export default async function AdminDishesPage() {
  const [dishes, categories, t] = await Promise.all([
    getDishes(),
    getCategories(),
    getTranslations("Admin"),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">{t("dishes.heading")}</h1>
      <DishesTable initialDishes={dishes} categories={categories} />
    </div>
  );
}
