import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Đặt Hàng Thành Công" };

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="size-12 text-primary" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-foreground">Đặt Hàng Thành Công</h1>
      <p className="text-muted-foreground">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Về Trang Chủ
      </Button>
    </div>
  );
}
