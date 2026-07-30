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
import { ORDER_STATUS_LABELS } from "@/lib/format";
import { updateOrderStatus } from "@/lib/actions/order";
import type { SortDir } from "@/lib/admin/table-query";
import type { OrderSortKey } from "@/lib/data/orders";
import type { Order, OrderStatus } from "@/types";

const BASE_PATH = "/admin/orders";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [
  OrderStatus,
  string,
][];

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
        placeholder="Tìm theo mã đơn hoặc tên khách..."
        sort={sort}
        dir={dir}
      />
      {error ? <p className="px-5 py-3 text-sm text-destructive">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <SortHeader
                label="Mã Đơn"
                sortKey="code"
                activeSort={sort}
                activeDir={dir}
                basePath={BASE_PATH}
                search={search}
              />
              <th className="px-5 py-3 font-medium">Khách Hàng</th>
              <SortHeader
                label="Tổng Tiền"
                sortKey="total"
                activeSort={sort}
                activeDir={dir}
                basePath={BASE_PATH}
                search={search}
              />
              <th className="px-5 py-3 font-medium">Trạng Thái</th>
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
                    <SelectTrigger size="sm" aria-label="Đổi trạng thái">
                      <SelectValue>
                        {(value: OrderStatus) => ORDER_STATUS_LABELS[value]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
