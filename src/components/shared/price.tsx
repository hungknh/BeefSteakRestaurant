import { formatVND } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({ amount, className }: { amount: number; className?: string }) {
  // font-sans (Lora) thay vì font-serif (Cormorant Garamond) — Cormorant có nét
  // uốn lượn kiểu display, chủ dự án muốn giá tiền basic/cổ điển hơn, đỡ màu mè.
  return <span className={cn("font-sans text-primary", className)}>{formatVND(amount)}</span>;
}
