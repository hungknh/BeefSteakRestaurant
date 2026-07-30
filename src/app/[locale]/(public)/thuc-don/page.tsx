import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { DishCard } from "@/components/menu/dish-card";
import { CategoryFilter } from "@/components/menu/category-filter";
import { JsonLd } from "@/components/shared/json-ld";
import { getDishes } from "@/lib/data/dishes";
import { getCategories } from "@/lib/data/categories";
import { menuJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Thực Đơn",
  description: "Toàn bộ món ăn tại Beef Haven.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ThucDonPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [dishes, categories] = await Promise.all([getDishes({ category }), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Chỉ phát Menu JSON-LD ở trang thực đơn đầy đủ — bản đã lọc danh mục là tập con,
          khai báo nó như toàn bộ thực đơn sẽ sai. */}
      {!category && <JsonLd data={menuJsonLd(dishes)} />}
      <SectionHeading eyebrow="Thực đơn" title="Món Ăn Của Chúng Tôi" />

      <div className="mt-10">
        <CategoryFilter categories={categories} active={category} />
      </div>

      {dishes.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <PackageOpen className="size-10 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-muted-foreground">Không tìm thấy món nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );
}
