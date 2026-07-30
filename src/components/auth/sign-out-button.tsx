"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const t = useTranslations("Auth");
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
      {t("signOut")}
    </Button>
  );
}
