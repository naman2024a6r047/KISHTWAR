import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Hostinger Deployment ──────────────────
  // Creates a minimal standalone build suitable for
  // Hostinger Business Hosting (Node.js option).
  output: "standalone",

  // ── Image Configuration ───────────────────
  // Disable built-in image optimization (requires Sharp)
  // since Hostinger managed hosting may not support it.
  // Use Cloudinary URL transformations instead.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ── Security Headers ──────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  // ── TypeScript ────────────────────────────
  typescript: {
    // Type checking is done separately via `tsc --noEmit`
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
