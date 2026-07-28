import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata = { title: "Tài Khoản" };

export default async function AccountPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground">Tài Khoản Của Tôi</h1>
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <p className="text-foreground">{session?.user?.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{session?.user?.email}</p>
        {session?.user?.role === "ADMIN" ? (
          <p className="mt-4 text-sm">
            <Link href="/admin" className="text-primary hover:underline">
              Vào Trang Quản Trị
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
