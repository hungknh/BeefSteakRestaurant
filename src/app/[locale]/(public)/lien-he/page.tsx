import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo/alternates";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/lien-he", locale),
  };
}

// ponytail: trang tĩnh, đọc hết từ SITE — không có form gửi liên hệ vì chưa nối dịch vụ
// email nào, form không gửi được đi đâu thì tệ hơn là không có form. Muốn thêm thì cắm
// Resend vào một Server Action mới, đừng dùng mailto (mở app mail của khách, hay hỏng).
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const tFooter = await getTranslations("Footer");

  const items = [
    {
      icon: MapPin,
      label: t("address"),
      lines: [`${SITE.address.street}, ${SITE.address.district}, ${SITE.address.city}`],
    },
    { icon: Phone, label: t("phone"), lines: [SITE.phone] },
    { icon: Mail, label: t("email"), lines: [SITE.email] },
    {
      icon: Clock,
      label: t("hours"),
      lines: [tFooter("weekdayHours"), tFooter("weekendHours")],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl text-foreground sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-center text-muted-foreground">{t("subtitle")}</p>

      <dl className="mt-12 grid gap-6 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, lines }) => (
          <div key={label} className="flex gap-3 rounded-lg border border-border bg-card p-5">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider text-foreground">
                {label}
              </dt>
              <dd className="mt-2 space-y-1 text-sm text-muted-foreground">
                {lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/dat-ban" />}>
          {t("bookOnline")}
        </Button>
        <Button variant="gold-outline" nativeButton={false} render={<Link href="/thuc-don" />}>
          {t("viewMenu")}
        </Button>
      </div>
    </div>
  );
}
