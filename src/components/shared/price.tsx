import { formatVND } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({ amount, className }: { amount: number; className?: string }) {
  return <span className={cn("font-serif text-primary", className)}>{formatVND(amount)}</span>;
}
