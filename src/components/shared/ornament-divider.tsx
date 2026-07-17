import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-primary", className)} aria-hidden="true">
      <span className="h-px w-10 bg-primary/50" />
      <Sparkle className="size-4" strokeWidth={1.5} />
      <span className="h-px w-10 bg-primary/50" />
    </div>
  );
}
