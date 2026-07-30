import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function ReservationCta() {
  const t = useTranslations("Home.reservationCta");

  return (
    <section className="relative flex min-h-[45dvh] items-center overflow-hidden">
      <Image
        src="/images/reservation-cta.jpg"
        alt={t("imageAlt")}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-black/60 to-background/80" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{t("title")}</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t("subtitle")}</p>
        <Button size="lg" className="mt-8" nativeButton={false} render={<Link href="/dat-ban" />}>
          {t("cta")}
        </Button>
      </div>
    </section>
  );
}
