import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function Hero() {
  // Tiêu đề tách 3 key thay vì 1 chuỗi có <br>: dòng giữa có style riêng (italic, màu gold),
  // và tách ra thì bản dịch tự ngắt dòng theo độ dài từng ngôn ngữ.
  const t = useTranslations("Home.hero");

  return (
    <section className="relative flex min-h-[85dvh] items-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt={t("imageAlt")}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl leading-snug text-foreground sm:text-5xl md:text-6xl">
          {t("line1")}
          <br />
          <span className="text-primary italic">{t("line2")}</span>
          <br />
          {t("line3")}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" nativeButton={false} render={<Link href="/dat-ban" />}>
            {t("bookTable")}
          </Button>
          <Button
            size="lg"
            variant="gold-outline"
            nativeButton={false}
            render={<Link href="/thuc-don" />}
          >
            {t("viewMenu")}
          </Button>
        </div>
      </div>
    </section>
  );
}
