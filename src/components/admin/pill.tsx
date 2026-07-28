import { cn } from "@/lib/utils";

const PILL_TONE = {
  gold: "bg-primary text-primary-foreground",
  "gold-muted": "bg-primary-muted text-background",
  neutral: "bg-border text-muted-foreground",
  maroon: "bg-badge-label text-foreground",
} as const;

export function Pill({
  tone,
  children,
}: {
  tone: keyof typeof PILL_TONE;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
        PILL_TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
