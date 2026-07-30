import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return { title: t("orderSuccessTitle") };
}

export default async function OrderSuccessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages");
  const tNotFound = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="size-12 text-primary" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-foreground">{t("orderSuccessHeading")}</h1>
      <p className="text-muted-foreground">{t("orderSuccessText")}</p>
      <Button nativeButton={false} render={<Link href="/" />}>
        {tNotFound("goHome")}
      </Button>
    </div>
  );
}
