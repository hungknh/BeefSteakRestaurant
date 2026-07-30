import { useLocale, useTranslations } from "next-intl";
import { orderStatusLabel } from "@/lib/format";
import type { OrderStatus } from "@/types";

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
];

// Không phải bảng màu categorical — mỗi hàng đã có nhãn chữ riêng nên không cần
// tách màu cho từng trạng thái. Chỉ 1 tông vàng nhạt->đậm theo mức độ hoàn tất,
// riêng "Đã Hủy" tách màu đỏ mận (badge-label) vì đây là tín hiệu cần chú ý.
const STATUS_BAR_COLOR: Record<OrderStatus | "SEATED" | "NO_SHOW", string> = {
  PENDING: "bg-muted-foreground",
  CONFIRMED: "bg-primary-muted",
  PREPARING: "bg-primary-muted",
  DELIVERING: "bg-primary-muted",
  SEATED: "bg-primary-muted",
  COMPLETED: "bg-primary",
  CANCELLED: "bg-badge-label",
  NO_SHOW: "bg-badge-label",
};

export function OrderStatusChart({
  statusCounts,
}: {
  statusCounts: Partial<Record<OrderStatus, number>>;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const counts = STATUS_ORDER.map((status) => ({
    status,
    label: orderStatusLabel(status, locale),
    count: statusCounts[status] ?? 0,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-5 font-serif text-lg text-foreground">{t("dashboard.orderStatus")}</h2>
      <div className="flex flex-col gap-3">
        {counts.map((c) => (
          <div key={c.status} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs tracking-wide text-muted-foreground uppercase">
              {c.label}
            </span>
            <div className="h-2.5 flex-1 rounded-full bg-background-alt">
              {c.count > 0 && (
                <div
                  className={`h-full rounded-full ${STATUS_BAR_COLOR[c.status]}`}
                  style={{ width: `${(c.count / max) * 100}%` }}
                />
              )}
            </div>
            <span className="w-6 shrink-0 text-right text-sm text-foreground tabular-nums">
              {c.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
