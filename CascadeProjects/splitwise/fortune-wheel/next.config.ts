import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Force Next.js to treat this directory as the workspace root
  // to avoid wrong root inference in monorepos and ENOENT in .next
  outputFileTracingRoot: __dirname,
  // Optimisation pour les iframes
  async headers() {
    return [
      {
        source: '/live',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
