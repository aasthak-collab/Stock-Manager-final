import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true }, // skip type errors during build
};

export default nextConfig;