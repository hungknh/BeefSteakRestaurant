import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Đăng Nhập" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground">Đăng Nhập</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
