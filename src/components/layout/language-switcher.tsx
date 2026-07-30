"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES } from "@/i18n/routing";

// Tên ngôn ngữ luôn viết bằng chính ngôn ngữ đó (endonym) — không dịch. Người đang xem
// bản tiếng Việt mà tìm mục tiếng Anh vẫn thấy chữ "English", không phải "Tiếng Anh".
const LOCALE_LABELS: Record<(typeof LOCALES)[number], string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export function LanguageSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  // usePathname của next-intl trả đường dẫn ĐÃ bỏ prefix locale, nên push lại cùng đường
  // dẫn với locale khác là giữ nguyên trang đang xem thay vì nhảy về trang chủ.
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label={t("switchLanguage")} />}
      >
        <Languages className="size-5" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            disabled={l === locale}
            onClick={() => router.replace(pathname, { locale: l })}
          >
            {LOCALE_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
