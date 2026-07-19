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
import { RESERVATION_STATUS_LABELS } from "@/lib/format";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
import type { Reservation, ReservationStatus } from "@/types";

const STATUS_OPTIONS = Object.entries(RESERVATION_STATUS_LABELS) as [ReservationStatus, string][];

export function ReservationsTable({ initialReservations }: { initialReservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Reservation>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const filtered = filterBySearch(reservations, search, (r) => r.guestName);
    return sortBy(filtered, sortKey, sortDir);
  }, [reservations, search, sortKey, sortDir]);

  const toggleSort = (key: keyof Reservation) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const changeStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-5">
        <Input
          placeholder="Tìm theo tên khách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
            <th
              className="cursor-pointer px-5 py-3 font-medium"
              onClick={() => toggleSort("guestName")}
            >
              Khách Hàng
            </th>
            <th className="px-5 py-3 font-medium">Liên Hệ</th>
            <th className="cursor-pointer px-5 py-3 font-medium" onClick={() => toggleSort("date")}>
              Ngày Giờ
            </th>
            <th className="px-5 py-3 font-medium">Số Khách</th>
            <th className="px-5 py-3 font-medium">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((reservation) => (
            <tr key={reservation.id} className="border-b border-border last:border-0">
              <td className="px-5 py-3 text-foreground">{reservation.guestName}</td>
              <td className="px-5 py-3 text-muted-foreground">{reservation.guestPhone}</td>
              <td className="px-5 py-3 text-muted-foreground">
                {reservation.date} · {reservation.timeSlot}
              </td>
              <td className="px-5 py-3 text-muted-foreground">{reservation.partySize}</td>
              <td className="px-5 py-3">
                <Select
                  value={reservation.status}
                  onValueChange={(v) => v && changeStatus(reservation.id, v as ReservationStatus)}
                >
                  <SelectTrigger size="sm" aria-label="Đổi trạng thái">
                    <SelectValue>
                      {(value: ReservationStatus) => RESERVATION_STATUS_LABELS[value]}
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
  );
}
