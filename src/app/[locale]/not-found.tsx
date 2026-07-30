import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/**
 * not-found trong phạm vi locale — URL lạ rơi vào đây qua catch-all `[...rest]/page.tsx`.
 * Nằm cùng cấp root layout nên KHÔNG có Header/Footer của `(public)` (xem "Sai khác" #12
 * trong PROGRESS.md), tự thêm link điều hướng thay cho nav.
 */
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <Compass className="size-10 text-muted-foreground" strokeWidth={1.5} />
      <p className="font-serif text-5xl text-primary">404</p>
      <h1 className="font-serif text-2xl text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          {t("goHome")}
        </Button>
        <Button variant="gold-outline" nativeButton={false} render={<Link href="/thuc-don" />}>
          {t("viewMenu")}
        </Button>
      </div>
    </div>
  );
}
