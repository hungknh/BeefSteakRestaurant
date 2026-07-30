import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth/register-form";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("signUpTitle") };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground">{t("signUpTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href="/dang-nhap" className="text-primary hover:underline">
            {t("signInButton")}
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
