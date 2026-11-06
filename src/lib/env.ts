// Reads public env vars and fails loudly when one is missing.
// Only NEXT_PUBLIC_* values are safe for the browser; server secrets live in serverEnv().

export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  siteUrl: string;
};

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. See .env.example.`);
  }
  return value;
}

export function readPublicEnv(source: Record<string, string | undefined>): PublicEnv {
  return {
    supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL", source.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    siteUrl: source.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}

export function publicEnv(): PublicEnv {
  // Next.js inlines these at build time, so they must be referenced literally.
  return readPublicEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
