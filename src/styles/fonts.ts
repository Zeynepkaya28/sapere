import { DM_Mono, Fredoka, Nunito } from "next/font/google";

// Self-hosted at build time by next/font: no runtime requests to Google, so CSP font-src stays 'self'.
export const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const dmMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${fredoka.variable} ${nunito.variable} ${dmMono.variable}`;
