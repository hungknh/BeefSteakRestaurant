import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ponytail: ảnh placeholder tạm thời, xem PROGRESS.md mục "Sai khác" #3
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
