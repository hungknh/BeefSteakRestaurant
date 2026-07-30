"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminSearchForm } from "@/components/admin/search-form";
import { SortHeader } from "@/components/admin/sort-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Price } from "@/components/shared/price";
import { useLocale, useTranslations } from "next-intl";
import { ORDER_STATUS_LABELS_BY_LOCALE, orderStatusLabel } from "@/lib/format";
import { updateOrderStatus } from "@/lib/actions/order";
import type { SortDir } from "@/lib/admin/table-query";
import type { OrderSortKey } from "@/lib/data/orders";
import type { Order, OrderStatus } from "@/types";

const BASE_PATH = "/admin/orders";

const STATUS_VALUES = Object.keys(ORDER_STATUS_LABELS_BY_LOCALE.vi) as OrderStatus[];

export function OrdersTable({
  orders,
  search,
  sort,
  dir,
}: {
  orders: Order[];
  search?: string;
  sort: OrderSortKey;
  dir: SortDir;
}) {
  const router = useRouter();
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Search và sort đều do server làm (query DB) — component này chỉ render đúng thứ tự
  // server trả về, không còn state sort nào ở client.

  const changeStatus = (id: string, status: OrderStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(id, status);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <AdminSearchForm
        defaultValue={search}
        placeholder={t("orders.searchPlaceholder")}
        sort={sort}
        dir={dir}
      />
      {error ? <p className="px-5 py-3 text-sm text-destructive">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <SortHeader
                label={t("orders.code")}
                sortKey="code"
                activeSort={sort}
                activeDir={dir}
                basePath={BASE_PATH}
                search={search}
              />
              <th className="px-5 py-3 font-medium">{t("common.customer")}</th>
              <SortHeader
                label={t("orders.total")}
                sortKey="total"
                activeSort={sort}
                activeDir={dir}
                basePath={BASE_PATH}
                search={search}
              />
              <th className="px-5 py-3 font-medium">{t("common.status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-background-alt"
              >
                <td className="px-5 py-3 text-foreground">{order.code}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {order.receiverName}
                </td>
                <td className="px-5 py-3">
                  <Price amount={order.total} className="text-sm" />
                </td>
                <td className="px-5 py-3">
                  <Select
                    value={order.status}
                    onValueChange={(v) =>
                      v && changeStatus(order.id, v as OrderStatus)
                    }
                  >
                    <SelectTrigger size="sm" aria-label={t("common.changeStatus")}>
                      <SelectValue>
                        {(value: OrderStatus) => orderStatusLabel(value, locale)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {orderStatusLabel(value, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
