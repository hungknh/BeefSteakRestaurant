import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="font-serif text-xl tracking-wide text-foreground">
            BeefSteak<span className="text-primary">House</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Nhà hàng bít tết cao cấp, phục vụ nguyên liệu tuyển chọn từ 2010.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground uppercase tracking-wider">
            Điều hướng
          </p>
          <nav className="mt-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground uppercase tracking-wider">Liên hệ</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>12 Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>028 3822 1010</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>lienhe@beefsteakhouse.vn</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground uppercase tracking-wider">
            Giờ mở cửa
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>Thứ 2 - Thứ 6: 11:00 - 22:00</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span>Thứ 7 - Chủ Nhật: 10:00 - 23:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 BeefSteakHouse. Đã đăng ký bản quyền.
        </p>
      </div>
    </footer>
  );
}
