"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Teddy, type TeddyPose } from "../Teddy";
import type { LoadStatus } from "@/hooks/useLoadProgress";
import styles from "./TeddyLoader.module.css";

export type TeddyLoaderProps = {
  /** 0–100, from real progress (see useLoadProgress). */
  progress: number;
  status?: LoadStatus;
  size?: "md" | "sm";
  /** Overrides the default status text. */
  message?: string;
};

const POSE: Record<LoadStatus, TeddyPose> = {
  loading: "walk",
  slow: "sad",
  failed: "sad",
  done: "happy",
};

export function TeddyLoader({
  progress,
  status = "loading",
  size = "md",
  message,
}: TeddyLoaderProps) {
  const t = useTranslations("loader");
  const format = useFormatter();
  const value = Math.max(0, Math.min(100, Math.round(progress)));

  const text =
    message ??
    { loading: t("collecting"), slow: t("slow"), failed: t("failed"), done: t("ready") }[status];

  return (
    <div
      className={`${styles.loader} ${styles[size]}`}
      style={{ "--p": `${value}%` } as CSSProperties}
    >
      <div
        className={styles.rail}
        role="progressbar"
        aria-label={t("label")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className={styles.fill} />
        <div className={styles.walker}>
          <Teddy pose={POSE[status]} size={size === "sm" ? 44 : 68} />
        </div>
      </div>
      <div className={styles.caption}>
        <span aria-live="polite">{text}</span>
        <span className={styles.percent}>{format.number(value / 100, { style: "percent" })}</span>
      </div>
    </div>
  );
}
