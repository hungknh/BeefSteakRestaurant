import Image from "next/image";
import { Price } from "@/components/shared/price";
import type { TopDish } from "@/lib/data/analytics";

export function TopDishes({ dishes }: { dishes: TopDish[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-5 font-serif text-lg text-foreground">Món Bán Chạy Nhất</h2>
      {dishes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-border">
          {dishes.map((dish, i) => (
            <li key={dish.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="w-5 shrink-0 font-serif text-sm text-primary-muted">{i + 1}</span>
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                <Image src={dish.imageUrl} alt={dish.name} fill sizes="40px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{dish.name}</p>
                <p className="text-xs text-muted-foreground">{dish.quantitySold} phần đã bán</p>
              </div>
              <Price amount={dish.revenue} className="shrink-0 text-sm" />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
