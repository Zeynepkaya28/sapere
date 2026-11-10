// Security headers for every HTML response. Pure functions so they can be unit-tested.

export type CspOptions = {
  nonce: string;
  isDev: boolean;
  /** Supabase project URL; adds its REST and Realtime (wss) origins to connect-src. */
  supabaseUrl?: string;
};

function supabaseOrigins(url: string | undefined): string[] {
  if (!url) return [];
  try {
    const { protocol, host } = new URL(url);
    const ws = protocol === "https:" ? "wss:" : "ws:";
    return [`${protocol}//${host}`, `${ws}//${host}`];
  } catch {
    return [];
  }
}

export function buildCsp({ nonce, isDev, supabaseUrl }: CspOptions): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'strict-dynamic' lets Next.js chunks loaded by a nonced script run; nothing else can.
    // React Refresh needs eval in development only.
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Inline style attributes (progress width, bubble positions) need 'unsafe-inline'.
    // Styles cannot run code, so this does not weaken the script policy.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    // Fonts are self-hosted by next/font.
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...supabaseOrigins(supabaseUrl), ...(isDev ? ["ws:"] : [])],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "manifest-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
  };

  const parts = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (!isDev) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

export function securityHeaders({ isDev }: { isDev: boolean }): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    ...(isDev
      ? {}
      : { "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload" }),
  };
}

/** Random nonce, base64. Uses Web Crypto so it works in the Edge runtime. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
