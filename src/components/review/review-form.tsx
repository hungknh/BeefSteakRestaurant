"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { translateFieldError } from "@/lib/validations/translate-error";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingInput } from "@/components/shared/rating-input";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations/review";

export function ReviewForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  defaultValues: ReviewFormValues;
  submitLabel: string;
  onSubmit: (values: ReviewFormValues) => void;
  onCancel?: () => void;
  pending: boolean;
  error: string | null;
}) {
  const t = useTranslations("Review");
  const tv = useTranslations("Validation");
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues,
  });
  const rating = watch("rating");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <div>
        <Label>{t("rating")}</Label>
        <div className="mt-2">
          <RatingInput
            value={rating}
            onChange={(v) => setValue("rating", v, { shouldValidate: true })}
            disabled={pending}
          />
        </div>
        {errors.rating ? (
          <p className="mt-1 text-xs text-destructive">{translateFieldError(tv, errors.rating.message)}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="review-content">{t("content")}</Label>
        <Textarea id="review-content" className="mt-2" disabled={pending} {...register("content")} />
        {errors.content ? (
          <p className="mt-1 text-xs text-destructive">{translateFieldError(tv, errors.content.message)}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
            {t("cancel")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
