"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminSearchForm } from "@/components/admin/search-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESERVATION_STATUS_LABELS } from "@/lib/format";
import { updateReservationStatus } from "@/lib/actions/reservation";
import { sortBy } from "@/lib/admin/table-utils";
import type { Reservation, ReservationStatus } from "@/types";

const STATUS_OPTIONS = Object.entries(RESERVATION_STATUS_LABELS) as [
  ReservationStatus,
  string,
][];

export function ReservationsTable({
  initialReservations,
  search,
}: {
  initialReservations: Reservation[];
  search?: string;
}) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<keyof Reservation>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // ponytail: xem ghi chú cùng loại trong `orders-table.tsx` — sort vẫn là trong-trang.
  const rows = useMemo(
    () => sortBy(initialReservations, sortKey, sortDir),
    [initialReservations, sortKey, sortDir],
  );

  const toggleSort = (key: keyof Reservation) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const changeStatus = (id: string, status: ReservationStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateReservationStatus(id, status);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <AdminSearchForm defaultValue={search} placeholder="Tìm theo tên khách..." />
      {error ? <p className="px-5 py-3 text-sm text-destructive">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("guestName")}
                >
                  Khách Hàng
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Liên Hệ</th>
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("date")}
                >
                  Ngày Giờ
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Số Khách</th>
              <th className="px-5 py-3 font-medium">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-background-alt"
              >
                <td className="px-5 py-3 text-foreground">
                  {reservation.guestName}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {reservation.guestPhone}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {reservation.date} · {reservation.timeSlot}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {reservation.partySize}
                </td>
                <td className="px-5 py-3">
                  <Select
                    value={reservation.status}
                    onValueChange={(v) =>
                      v && changeStatus(reservation.id, v as ReservationStatus)
                    }
                  >
                    <SelectTrigger size="sm" aria-label="Đổi trạng thái">
                      <SelectValue>
                        {(value: ReservationStatus) =>
                          RESERVATION_STATUS_LABELS[value]
                        }
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
