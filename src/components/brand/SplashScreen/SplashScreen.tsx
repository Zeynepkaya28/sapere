"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { TeddyLoader } from "../TeddyLoader";
import { useLoadProgress, type LoadTask } from "@/hooks/useLoadProgress";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./SplashScreen.module.css";

export type SplashFact = {
  text: string;
  /** Sample content must say so (prompt section 8). */
  sample?: boolean;
};

export type SplashScreenProps = {
  /** Real data sources to wait for. Progress = finished / total. */
  tasks: LoadTask[];
  fact?: SplashFact;
  onDone?: () => void;
};

const HOLD_MS = 650;
const FADE_MS = 300;

type Phase = "loading" | "holding" | "leaving" | "gone";

export function SplashScreen({ tasks, fact, onDone }: SplashScreenProps) {
  const t = useTranslations("splash");
  const { progress, status } = useLoadProgress(tasks);
  const [phase, setPhase] = useState<Phase>("loading");

  // 100% → happy teddy + "Hazır!" for 650 ms → fade out → unmount. One effect per step,
  // so a phase change never cancels the timer of the step it started.
  useEffect(() => {
    if (status === "done" && phase === "loading") setPhase("holding");
  }, [status, phase]);

  useEffect(() => {
    if (phase !== "holding") return;
    const reduced = prefersReducedMotion();
    const hold = window.setTimeout(() => setPhase(reduced ? "gone" : "leaving"), HOLD_MS);
    return () => window.clearTimeout(hold);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const fade = window.setTimeout(() => setPhase("gone"), FADE_MS);
    return () => window.clearTimeout(fade);
  }, [phase]);

  useEffect(() => {
    if (phase === "gone") onDone?.();
  }, [phase, onDone]);

  if (phase === "gone") return null;

  return (
    <div className={styles.splash} data-phase={phase} data-testid="splash">
      <div className={styles.inner}>
        <p className={styles.logo}>sapere</p>
        <TeddyLoader progress={progress} status={status} />
        {fact && (
          <aside className={styles.fact}>
            <p className={`eyebrow ${styles.factLabel}`}>
              {t("didYouKnow")}
              {fact.sample && <span className={styles.sample}>{t("sample")}</span>}
            </p>
            <p className={styles.factText}>{fact.text}</p>
          </aside>
        )}
      </div>
    </div>
  );
}
