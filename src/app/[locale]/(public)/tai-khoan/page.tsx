import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return { title: t("accountTitle") };
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [session, t] = await Promise.all([auth(), getTranslations("Pages")]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground">{t("accountHeading")}</h1>
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <p className="text-foreground">{session?.user?.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{session?.user?.email}</p>
        {session?.user?.role === "ADMIN" ? (
          <p className="mt-4 text-sm">
            <Link href="/admin" className="text-primary hover:underline">
              {t("goToAdmin")}
            </Link>
          </p>
        ) : null}
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
