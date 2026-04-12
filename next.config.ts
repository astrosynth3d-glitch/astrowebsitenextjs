import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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