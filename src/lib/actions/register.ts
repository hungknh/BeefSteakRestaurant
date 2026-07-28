"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerFormSchema, type RegisterFormValues } from "@/lib/validations/auth";

export async function registerUser(values: RegisterFormValues) {
  const parsed = registerFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email đã được sử dụng." };

  await prisma.user.create({
    data: {
      id: `user-${randomUUID()}`,
      name,
      email,
      role: "USER",
      password: await bcrypt.hash(password, 10),
    },
  });

  return { success: true as const };
}
