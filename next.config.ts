import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },
      {
        source: "/pdf.worker.min.mjs",
        headers: [{ key: "Content-Type", value: "application/javascript" }],
      },
      {
        source: "/og-image.png",
        headers: [{ key: "Content-Type", value: "image/png" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us-assets.i.posthog.com",
              "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com",
              "img-src 'self' blob: data: https://lh3.googleusercontent.com https://*.public.blob.vercel-storage.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "frame-src https://www.youtube.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/ph/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ph/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
