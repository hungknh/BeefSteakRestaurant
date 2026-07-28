import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

const sans = Lora({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: {
    default: "Beef Haven",
    template: "%s · Beef Haven",
  },
  description: "Nhà hàng bít tết cao cấp — thực đơn, khuyến mãi và đặt bàn trực tuyến.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
