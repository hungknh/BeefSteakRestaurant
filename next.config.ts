import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ponytail: ảnh placeholder tạm thời, xem PROGRESS.md mục "Sai khác" #3
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
