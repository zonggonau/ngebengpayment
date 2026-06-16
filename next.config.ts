import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pino"],
  // Prevent sensitive data leakage in error responses
  productionBrowserSourceMaps: false,
};

export default nextConfig;
