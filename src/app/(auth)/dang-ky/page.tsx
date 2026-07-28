import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Đăng Ký" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground">Đăng Ký</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
