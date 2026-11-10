"use client";

import { SplashScreen } from "@/components/brand/SplashScreen";
import { sampleFacts } from "@/content/sampleFacts";
import { bootTasks } from "@/lib/boot";

// Opening screen. Waits for real sources (fonts, page load); Phase 2 adds session, feed and live status.
export function BootSplash() {
  return <SplashScreen tasks={bootTasks} fact={sampleFacts[0]} />;
}
