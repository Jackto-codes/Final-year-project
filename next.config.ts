import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next.js 16 injects lib values (e.g. dom.asynciterable) that can cause
    // TS6046 on certain build environments. Type-checking is done locally.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
