import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[85dvh] items-center overflow-hidden">
      <Image
        src="https://picsum.photos/seed/beefsteak-hero/1920/1080"
        alt="Bít tết nướng trên bếp than tại BeefSteakHouse"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl leading-snug text-foreground sm:text-5xl md:text-6xl">
          Tinh Hoa Bít Tết
          <br />
          <span className="text-primary italic">Chuẩn Vị Cao Cấp</span>
          <br />
          Giữa Lòng Sài Gòn
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          Nguyên liệu tuyển chọn, nướng trên than hoa, phục vụ trong không gian ấm áp ánh nến.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" nativeButton={false} render={<Link href="/dat-ban" />}>
            Đặt Bàn
          </Button>
          <Button
            size="lg"
            variant="gold-outline"
            nativeButton={false}
            render={<Link href="/thuc-don" />}
          >
            Xem Thực Đơn
          </Button>
        </div>
      </div>
    </section>
  );
}
