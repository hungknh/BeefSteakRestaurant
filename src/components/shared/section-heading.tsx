import { OrnamentDivider } from "@/components/shared/ornament-divider";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto flex max-w-2xl flex-col items-center text-center", className)}>
      <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary-muted">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-4xl leading-tight font-serif text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <OrnamentDivider className="mt-5" />
      {description ? <p className="mt-5 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
