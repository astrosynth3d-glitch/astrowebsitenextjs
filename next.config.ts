import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from your other device in development
  allowedDevOrigins: ["192.168.1.2"],

  // Allow Next.js to load images from Sanity's CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;