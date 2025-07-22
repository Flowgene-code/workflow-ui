import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, //  Enable App Router support
  },
};

export default nextConfig;
