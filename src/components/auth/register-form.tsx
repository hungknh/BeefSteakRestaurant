"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/actions/register";
import { registerFormSchema, type RegisterFormValues } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    const result = await registerUser(values);
    if (result.error) {
      setFormError(result.error);
      return;
    }
    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInResult?.error) {
      router.push("/dang-nhap");
      return;
    }
    router.push("/tai-khoan");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="name">Họ tên</Label>
        <Input id="name" className="mt-2" {...register("name")} />
        {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
      </div>
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
      <div>
        <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
        <Input id="confirmPassword" type="password" className="mt-2" {...register("confirmPassword")} />
        {errors.confirmPassword ? (
          <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        Đăng Ký
      </Button>
    </form>
  );
}
