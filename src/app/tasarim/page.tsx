import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Showcase } from "./Showcase";

// Internal component gallery (stand-in until Storybook). Not linked from production nav, not indexed.
export const metadata: Metadata = {
  title: "Bileşenler",
  robots: { index: false, follow: false },
};

export default function ShowcasePage() {
  return (
    <>
      <SiteHeader liveActive isEditor />
      <Showcase />
    </>
  );
}
