import { useTranslations } from "next-intl";
import { formatVND } from "@/lib/format";
import type { MonthlyRevenue } from "@/lib/data/analytics";

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  const t = useTranslations("Admin");
  const max = Math.max(1, ...data.map((d) => d.revenue));

  // Nhãn tháng nằm ở catalog vì tiếng Việt có tiền tố "T" (T7/2026) còn tiếng Anh
  // thì không (7/2026). Truyền year dạng chuỗi để next-intl không format thành "2.026".
  const monthLabel = (month: string) => {
    const [year, m] = month.split("-");
    return t("dashboard.monthLabel", { month: Number(m), year });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-5 font-serif text-lg text-foreground">{t("dashboard.monthlyRevenue")}</h2>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.noCompletedOrders")}</p>
      ) : (
        <div className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto pr-1">
          {data.map((d) => (
            <div key={d.month} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs tracking-wide text-muted-foreground uppercase">
                {monthLabel(d.month)}
              </span>
              <div className="h-2.5 flex-1 rounded-full bg-background-alt">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(d.revenue / max) * 100}%` }}
                />
              </div>
              <span className="w-28 shrink-0 text-right text-sm text-foreground tabular-nums">
                {formatVND(d.revenue)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
