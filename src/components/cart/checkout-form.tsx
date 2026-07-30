"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CartSummary } from "@/components/cart/cart-summary";
import { orderFormSchema, type OrderFormValues } from "@/lib/validations/order";
import { createOrder } from "@/lib/actions/order";
import { useCartStore } from "@/store/cart";
import type { Promotion } from "@/types";

const SHIPPING_FEE = 30000;

export function CheckoutForm({ promos }: { promos: Promotion[] }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      deliveryMethod: "DELIVERY",
      address: "",
      note: "",
    },
  });
  const deliveryMethod = watch("deliveryMethod");

  if (items.length === 0) {
    return (
      <p className="mt-10 text-center text-muted-foreground">
        Giỏ hàng trống, không có gì để thanh toán.
      </p>
    );
  }

  const onSubmit = async (values: OrderFormValues) => {
    setFormError(null);
    const result = await createOrder(
      values,
      items.map((i) => ({
        dishId: i.dish.id,
        quantity: i.quantity,
        doneness: i.doneness,
        note: i.note,
      })),
    );
    if (result.error) {
      setFormError(result.error);
      return;
    }
    clear();
    router.push("/thanh-toan/thanh-cong");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div>
          <Label htmlFor="receiverName">Họ tên người nhận</Label>
          <Input id="receiverName" className="mt-2" {...register("receiverName")} />
          {errors.receiverName ? (
            <p className="mt-1 text-xs text-destructive">{errors.receiverName.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="receiverPhone">Số điện thoại</Label>
          <Input id="receiverPhone" className="mt-2" {...register("receiverPhone")} />
          {errors.receiverPhone ? (
            <p className="mt-1 text-xs text-destructive">{errors.receiverPhone.message}</p>
          ) : null}
        </div>
        <div>
          <Label>Hình thức nhận hàng</Label>
          <Controller
            name="deliveryMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="DELIVERY" /> Giao hàng tận nơi
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="PICKUP" /> Lấy tại quầy
                </label>
              </RadioGroup>
            )}
          />
        </div>
        {deliveryMethod === "DELIVERY" ? (
          <div>
            <Label htmlFor="address">Địa chỉ giao hàng</Label>
            <Textarea id="address" className="mt-2" {...register("address")} />
            {errors.address ? (
              <p className="mt-1 text-xs text-destructive">{errors.address.message}</p>
            ) : null}
          </div>
        ) : null}
        <div>
          <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
          <Textarea id="note" className="mt-2" {...register("note")} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <CartSummary
          items={items}
          promos={promos}
          shippingFee={deliveryMethod === "DELIVERY" ? SHIPPING_FEE : 0}
        />
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        <Button size="lg" type="submit" disabled={isSubmitting}>
          Đặt Hàng
        </Button>
      </div>
    </form>
  );
}
