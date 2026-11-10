import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, createNonce, securityHeaders } from "@/lib/security/headers";

// Adds a per-request CSP nonce and security headers to every page response.
// Next.js reads the nonce from the request's CSP header and stamps it on its own scripts.
export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const nonce = createNonce();
  const csp = buildCsp({ nonce, isDev, supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  for (const [name, value] of Object.entries(securityHeaders({ isDev }))) {
    response.headers.set(name, value);
  }
  return response;
}

export const config = {
  matcher: [
    {
      // Skip static files and prefetches; they carry no inline scripts.
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
