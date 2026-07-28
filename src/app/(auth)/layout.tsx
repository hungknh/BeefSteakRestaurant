import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" className="flex items-center gap-2 font-serif text-xl text-foreground">
        <Image
          src="/images/logo.jpg"
          alt="Beef Haven"
          width={36}
          height={36}
          className="rounded-full"
          priority
          unoptimized
        />
        Beef <span className="text-primary">Haven</span>
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">{children}</div>
    </main>
  );
}
