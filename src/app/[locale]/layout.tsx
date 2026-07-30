import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Lora } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { routing } from "@/i18n/routing";
import { localeAlternates, ogLocale } from "@/lib/seo/alternates";
import { SITE } from "@/lib/site";
import "../globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

const sans = Lora({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Site" });
  const description = t("description");

  return {
    // metadataBase để mọi ảnh OG/canonical khai bằng đường dẫn tương đối tự thành URL tuyệt đối.
    metadataBase: new URL(SITE.url),
    title: {
      default: SITE.name,
      template: `%s · ${SITE.name}`,
    },
    description,
    alternates: localeAlternates("/", locale),
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      siteName: SITE.name,
      title: SITE.name,
      description,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.name,
      description,
      images: [SITE.ogImage],
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // URL kiểu /xx/thuc-don không khớp locale nào — trả 404 thay vì render bằng tiếng mặc định.
  if (!hasLocale(routing.locales, locale)) notFound();

  // Cho phép render tĩnh: thiếu dòng này thì mọi trang dùng next-intl bị đẩy sang dynamic.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
