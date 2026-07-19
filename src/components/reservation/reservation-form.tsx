"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/lib/validations/reservation";
import { TIME_SLOTS, isSlotDisabled, toLocalDateStr } from "@/lib/reservation/time-slots";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/types";

export function ReservationForm({ promo }: { promo: Promotion | null }) {
  const [submitted, setSubmitted] = useState(false);
  const today = toLocalDateStr(new Date());
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      date: today,
      timeSlot: "",
      partySize: 2,
      note: "",
    },
  });
  const date = watch("date");
  const timeSlot = watch("timeSlot");

  const onSubmit = (values: ReservationFormValues) => {
    // ponytail: chưa có server action (Giai đoạn 9), console.log để demo luồng.
    console.log("reservation", { ...values, promotionId: promo?.id ?? null });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
        <h2 className="font-serif text-xl text-foreground">Đã Nhận Yêu Cầu Đặt Bàn</h2>
        <p className="text-muted-foreground">Chúng tôi sẽ gọi xác nhận trong ít phút.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
      {promo ? (
        <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-card p-4">
          <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">
              Đang áp dụng ưu đãi: {promo.title}
            </p>
            <p className="text-sm text-muted-foreground">{promo.scheduleText}</p>
          </div>
        </div>
      ) : null}

      <div>
        <Label htmlFor="guestName">Họ tên</Label>
        <Input id="guestName" className="mt-2" {...register("guestName")} />
        {errors.guestName ? (
          <p className="mt-1 text-xs text-destructive">{errors.guestName.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="guestPhone">Số điện thoại</Label>
          <Input id="guestPhone" className="mt-2" {...register("guestPhone")} />
          {errors.guestPhone ? (
            <p className="mt-1 text-xs text-destructive">{errors.guestPhone.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="guestEmail">Email (tùy chọn)</Label>
          <Input id="guestEmail" className="mt-2" {...register("guestEmail")} />
          {errors.guestEmail ? (
            <p className="mt-1 text-xs text-destructive">{errors.guestEmail.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Ngày</Label>
          <Input id="date" type="date" min={today} className="mt-2" {...register("date")} />
        </div>
        <div>
          <Label htmlFor="partySize">Số khách</Label>
          <Input
            id="partySize"
            type="number"
            min={1}
            max={20}
            className="mt-2"
            {...register("partySize")}
          />
          {errors.partySize ? (
            <p className="mt-1 text-xs text-destructive">{errors.partySize.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Label>Khung giờ</Label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {TIME_SLOTS.map((slot) => {
            const disabled = isSlotDisabled(slot, date, new Date());
            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                onClick={() => setValue("timeSlot", slot, { shouldValidate: true })}
                className={cn(
                  "rounded-md border border-border py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
                  timeSlot === slot &&
                    "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
        {errors.timeSlot ? (
          <p className="mt-1 text-xs text-destructive">{errors.timeSlot.message}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
        <Textarea id="note" className="mt-2" {...register("note")} />
      </div>

      <Button size="lg" type="submit" disabled={isSubmitting}>
        Xác Nhận Đặt Bàn
      </Button>
    </form>
  );
}
