import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly declare the workspace root so Next.js doesn't scan
    // parent directories with other lockfiles.
    root: __dirname,
  },
  images: {
    // Images are pre-optimized (webp in Supabase Storage + branded SVGs), so we
    // skip Vercel's Image Optimization to avoid per-transformation billing.
    unoptimized: true,
  },
};

export default nextConfig;
