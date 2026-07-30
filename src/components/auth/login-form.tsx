"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { stripLocale } from "@/i18n/strip-locale";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema, type LoginFormValues } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    const result = await signIn("credentials", { ...values, redirect: false });
    if (result?.error) {
      setFormError("Email hoặc mật khẩu không đúng.");
      return;
    }
    // callbackUrl do next-auth sinh nên ĐÃ có thể chứa prefix locale (`/en/tai-khoan`).
    // router của next-intl tự thêm prefix, nên phải bỏ prefix cũ trước, không thì ra
    // `/en/en/tai-khoan`.
    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl ? stripLocale(callbackUrl) : "/tai-khoan");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="mt-2" {...register("email")} />
        {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input id="password" type="password" className="mt-2" {...register("password")} />
        {errors.password ? (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        Đăng Nhập
      </Button>
    </form>
  );
}
