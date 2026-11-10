import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { securityHeaders } from "./src/lib/security/headers";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Middleware covers pages; this covers API routes and static files too.
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/:path*",
        headers: Object.entries(securityHeaders({ isDev })).map(([key, value]) => ({ key, value })),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
