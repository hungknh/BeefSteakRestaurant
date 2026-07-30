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
import { RESERVATION_STATUS_LABELS } from "@/lib/format";
import { updateReservationStatus } from "@/lib/actions/reservation";
import type { SortDir } from "@/lib/admin/table-query";
import type { ReservationSortKey } from "@/lib/data/reservations";
import type { Reservation, ReservationStatus } from "@/types";

const BASE_PATH = "/admin/reservations";

const STATUS_OPTIONS = Object.entries(RESERVATION_STATUS_LABELS) as [
  ReservationStatus,
  string,
][];

export function ReservationsTable({
  reservations,
  search,
  sort,
  dir,
}: {
  reservations: Reservation[];
  search?: string;
  sort: ReservationSortKey;
  dir: SortDir;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Search và sort đều do server làm — xem ghi chú trong `orders-table.tsx`.

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
      <AdminSearchForm
        defaultValue={search}
        placeholder="Tìm theo tên khách..."
        sort={sort}
        dir={dir}
      />
      {error ? <p className="px-5 py-3 text-sm text-destructive">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <SortHeader
                label="Khách Hàng"
                sortKey="guestName"
                activeSort={sort}
                activeDir={dir}
                basePath={BASE_PATH}
                search={search}
              />
              <th className="px-5 py-3 font-medium">Liên Hệ</th>
              <SortHeader
                label="Ngày Giờ"
                sortKey="date"
                activeSort={sort}
                activeDir={dir}
                basePath={BASE_PATH}
                search={search}
              />
              <th className="px-5 py-3 font-medium">Số Khách</th>
              <th className="px-5 py-3 font-medium">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
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
