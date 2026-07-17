import { ChefHat, Flame, Leaf, Wine } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const STANDARDS = [
  {
    icon: Leaf,
    title: "Nguyên Liệu Tuyển Chọn",
    description: "Thịt bò nhập khẩu, kiểm định nguồn gốc rõ ràng.",
  },
  {
    icon: Flame,
    title: "Nướng Trên Than Hoa",
    description: "Giữ trọn vị ngọt tự nhiên, thơm mùi khói than.",
  },
  {
    icon: ChefHat,
    title: "Đầu Bếp Giàu Kinh Nghiệm",
    description: "Hơn 10 năm chế biến bít tết tại các nhà hàng 5 sao.",
  },
  {
    icon: Wine,
    title: "Không Gian Sang Trọng",
    description: "Ánh nến ấm áp, phù hợp cho những dịp đặc biệt.",
  },
];

export function StandardCards() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Vì sao chọn chúng tôi" title="Chuẩn Mực Beefsteak" />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STANDARDS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-primary text-primary">
                <Icon className="size-7" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-serif text-lg text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
