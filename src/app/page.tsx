import { SectionHeading } from "@/components/shared/section-heading";
import { Price } from "@/components/shared/price";

// TODO(Giai đoạn 2): thay bằng Hero + các section trang chủ thật, xem PLAN.md mục 7.
export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Kiểm tra font tiếng Việt"
        title="Đặt bàn. Trải nghiệm khó quên. Sườn nướng."
        description="Chuỗi này dùng để kiểm tra dấu tiếng Việt trên Playfair Display và Inter không bị vỡ font khi đổ nội dung thật."
      />
      <p className="mt-10 text-center">
        Giá mẫu: <Price amount={890000} />
      </p>
    </div>
  );
}
