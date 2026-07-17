import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ReservationCta() {
  return (
    <section className="relative flex min-h-[45dvh] items-center overflow-hidden">
      <Image
        src="https://picsum.photos/seed/beefsteak-reservation-cta/1920/900"
        alt="Không gian bàn ăn tại BeefSteakHouse vào buổi tối"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-black/60 to-background/80" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Giữ Chỗ Cho Buổi Tối Đáng Nhớ
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Đặt bàn trước để đảm bảo vị trí ưng ý, đặc biệt vào cuối tuần.
        </p>
        <Button size="lg" className="mt-8" nativeButton={false} render={<Link href="/dat-ban" />}>
          Đặt Bàn Ngay
        </Button>
      </div>
    </section>
  );
}
