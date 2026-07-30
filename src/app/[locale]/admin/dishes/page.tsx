import { getDishes } from "@/lib/data/dishes";
import { getCategories } from "@/lib/data/categories";
import { DishesTable } from "@/components/admin/dishes-table";

export const metadata = { title: "Admin — Món Ăn" };

export default async function AdminDishesPage() {
  const [dishes, categories] = await Promise.all([getDishes(), getCategories()]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-foreground">Quản Lý Món Ăn</h1>
      <DishesTable initialDishes={dishes} categories={categories} />
    </div>
  );
}
