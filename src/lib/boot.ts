import type { LoadTask } from "@/hooks/useLoadProgress";

// Data sources the splash screen waits for. Phase 2 adds session, feed, polls, leaderboard and live status.

export const waitForFonts: LoadTask = () =>
  typeof document !== "undefined" && "fonts" in document ? document.fonts.ready : Promise.resolve();

export const waitForPageLoad: LoadTask = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") return resolve();
    window.addEventListener("load", () => resolve(), { once: true });
  });

export const bootTasks: LoadTask[] = [waitForFonts, waitForPageLoad];
