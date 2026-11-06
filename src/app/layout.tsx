import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sapere",
  description: "Her alandan ilginç bilgiler, anketler, canlı yarışmalar ve oyunlar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
