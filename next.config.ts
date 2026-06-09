import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly declare the workspace root so Next.js doesn't scan
    // parent directories with other lockfiles.
    root: __dirname,
  },
};

export default nextConfig;
