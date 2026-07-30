import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/site";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tSite = useTranslations("Site");

  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="flex items-center gap-2 font-serif text-xl tracking-wide text-foreground">
            <Image
              src="/images/logo.jpg"
              alt="Beef Haven"
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
            Beef <span className="text-primary">Haven</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{tSite("about")}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground uppercase tracking-wider">
            {t("navigation")}
          </p>
          <nav className="mt-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {tNav(item.labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground uppercase tracking-wider">
            {t("contact")}
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>
                {SITE.address.street}, {SITE.address.district}, {SITE.address.city}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>{SITE.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>{SITE.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground uppercase tracking-wider">
            {t("hours")}
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>{t("weekdayHours")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>{t("weekendHours")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground">{t("rights")}</p>
      </div>
    </footer>
  );
}
