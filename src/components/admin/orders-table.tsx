"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Price } from "@/components/shared/price";
import { ORDER_STATUS_LABELS } from "@/lib/format";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [
  OrderStatus,
  string,
][];

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Order>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const filtered = filterBySearch(
      orders,
      search,
      (o) => `${o.code} ${o.receiverName}`,
    );
    return sortBy(filtered, sortKey, sortDir);
  }, [orders, search, sortKey, sortDir]);

  const toggleSort = (key: keyof Order) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const changeStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-5">
        <Input
          placeholder="Tìm theo mã đơn hoặc tên khách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("code")}
                >
                  Mã Đơn
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Khách Hàng</th>
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("total")}
                >
                  Tổng Tiền
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0"
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
