import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DishNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center sm:px-6 lg:px-8">
      <PackageOpen className="size-10 text-muted-foreground" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-foreground">Không Tìm Thấy Món Ăn</h1>
      <p className="text-muted-foreground">Món bạn tìm không tồn tại hoặc đã ngừng phục vụ.</p>
      <Button nativeButton={false} render={<Link href="/thuc-don" />}>
        Xem Toàn Bộ Thực Đơn
      </Button>
    </div>
  );
}
