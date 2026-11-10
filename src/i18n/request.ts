import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";

// Locale-prefixed routes (/en/...) arrive in Phase 2. Until then every request is Turkish.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
