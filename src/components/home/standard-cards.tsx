import { ChefHat, Flame, Leaf, Wine } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/shared/section-heading";

// Chỉ giữ icon + tên key ở đây, chữ lấy từ messages. Thêm mục mới thì thêm cặp
// `<key>Title`/`<key>Text` vào cả 2 file messages, không hard-code chữ lại vào đây.
const STANDARDS = [
  { icon: Leaf, key: "ingredients" },
  { icon: Flame, key: "charcoal" },
  { icon: ChefHat, key: "chef" },
  { icon: Wine, key: "space" },
] as const;

export function StandardCards() {
  const t = useTranslations("Home.standardCards");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STANDARDS.map(({ icon: Icon, key }) => (
            <div key={key} className="flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-primary text-primary">
                <Icon className="size-7" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-serif text-lg text-foreground">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`${key}Text`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
