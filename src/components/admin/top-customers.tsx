import { useTranslations } from "next-intl";
import { Price } from "@/components/shared/price";
import type { TopCustomer } from "@/lib/data/analytics";

export function TopCustomers({ customers }: { customers: TopCustomer[] }) {
  const t = useTranslations("Admin");
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-5 font-serif text-lg text-foreground">{t("dashboard.topCustomers")}</h2>
      {customers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
      ) : (
        <ol className="flex flex-col divide-y divide-border">
          {customers.map((customer, i) => (
            <li key={customer.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="w-5 shrink-0 font-serif text-sm text-primary-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{customer.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {customer.email} · {t("dashboard.orderCount", { count: customer.orderCount })}
                </p>
              </div>
              <Price amount={customer.totalSpent} className="shrink-0 text-sm" />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
