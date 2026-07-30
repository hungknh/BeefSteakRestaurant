import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function DishNotFound() {
  const t = useTranslations("Pages");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center sm:px-6 lg:px-8">
      <PackageOpen className="size-10 text-muted-foreground" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-foreground">{t("dishNotFoundTitle")}</h1>
      <p className="text-muted-foreground">{t("dishNotFoundText")}</p>
      <Button nativeButton={false} render={<Link href="/thuc-don" />}>
        {t("viewAllMenu")}
      </Button>
    </div>
  );
}
