"use client";

import { useEffect, useRef, useState } from "react";

export type LoadStatus = "loading" | "slow" | "done" | "failed";
export type LoadTask = () => Promise<unknown>;

export type LoadState = {
  completed: number;
  total: number;
  /** 0–100, from finished tasks only. Never invented. */
  progress: number;
  status: LoadStatus;
};

export function progressOf(completed: number, total: number): number {
  if (total <= 0) return 100;
  return Math.round((Math.min(completed, total) / total) * 100);
}

/**
 * Runs the given tasks once and reports real progress (finished / total).
 * After `slowAfterMs` without finishing, status becomes "slow" (prompt: 10 s).
 * Any rejected task makes the status "failed".
 */
export function useLoadProgress(tasks: LoadTask[], { slowAfterMs = 10_000 } = {}): LoadState {
  // Tasks are read once on mount; later changes are ignored on purpose.
  const tasksRef = useRef(tasks);
  const total = tasksRef.current.length;
  const [completed, setCompleted] = useState(0);
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    for (const task of tasksRef.current) {
      Promise.resolve()
        .then(task)
        .then(
          () => !cancelled && setCompleted((n) => n + 1),
          () => !cancelled && setFailed(true),
        );
    }
    const timer = window.setTimeout(() => !cancelled && setSlow(true), slowAfterMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [slowAfterMs]);

  const done = completed >= total;
  const status: LoadStatus = failed ? "failed" : done ? "done" : slow ? "slow" : "loading";
  return { completed, total, progress: progressOf(completed, total), status };
}
