import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description: `Địa chỉ, số điện thoại và giờ mở cửa của ${SITE.name}.`,
  alternates: { canonical: "/lien-he" },
};

// ponytail: trang tĩnh, đọc hết từ SITE — không có form gửi liên hệ vì chưa nối dịch vụ
// email nào, form không gửi được đi đâu thì tệ hơn là không có form. Muốn thêm thì cắm
// Resend vào một Server Action mới, đừng dùng mailto (mở app mail của khách, hay hỏng).
const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Địa chỉ",
    lines: [`${SITE.address.street}, ${SITE.address.district}, ${SITE.address.city}`],
  },
  { icon: Phone, label: "Điện thoại", lines: [SITE.phone] },
  { icon: Mail, label: "Email", lines: [SITE.email] },
  {
    icon: Clock,
    label: "Giờ mở cửa",
    lines: ["Thứ 2 - Thứ 6: 11:00 - 22:00", "Thứ 7 - Chủ Nhật: 10:00 - 23:00"],
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl text-foreground sm:text-4xl">Liên Hệ</h1>
      <p className="mt-4 text-center text-muted-foreground">
        Gọi trực tiếp để được phục vụ nhanh nhất, hoặc đặt bàn trực tuyến chỉ trong một phút.
      </p>

      <dl className="mt-12 grid gap-6 sm:grid-cols-2">
        {CONTACT_ITEMS.map(({ icon: Icon, label, lines }) => (
          <div key={label} className="flex gap-3 rounded-lg border border-border bg-card p-5">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider text-foreground">
                {label}
              </dt>
              <dd className="mt-2 space-y-1 text-sm text-muted-foreground">
                {lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/dat-ban" />}>
          Đặt Bàn Trực Tuyến
        </Button>
        <Button variant="gold-outline" nativeButton={false} render={<Link href="/thuc-don" />}>
          Xem Thực Đơn
        </Button>
      </div>
    </div>
  );
}
