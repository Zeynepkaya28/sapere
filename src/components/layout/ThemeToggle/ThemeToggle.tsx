"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { applyTheme, currentTheme, storeTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const t = useTranslations("theme");
  // Unknown on the server; read after mount to avoid a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(currentTheme()), []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    applyTheme(next);
    storeTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={next === "dark" ? t("toDark") : t("toLight")}
      data-theme-current={theme ?? undefined}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        {theme === "dark" ? (
          // Sun
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
          </g>
        ) : (
          // Moon
          <path
            d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
