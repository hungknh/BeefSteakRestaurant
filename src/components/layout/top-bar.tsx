import { useTranslations } from "next-intl";

export function TopBar() {
  const t = useTranslations("Site");

  return (
    <div className="hidden border-b border-border bg-background-alt py-2 sm:block">
      <p className="text-center text-xs font-medium text-primary-muted uppercase tracking-[0.35em]">
        {t("tagline")}
      </p>
    </div>
  );
}
