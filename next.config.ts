import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https", // or 'http' if needed
        hostname: "**", // Wildcard to allow all hostnames
        port: "", // Leave empty unless specific ports are required
        pathname: "/**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;
