import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-serif text-2xl text-foreground">{value}</p>
        <p className="text-xs tracking-wider text-muted-foreground uppercase">{label}</p>
      </div>
    </div>
  );
}
