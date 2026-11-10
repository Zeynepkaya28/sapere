import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { progressOf, useLoadProgress } from "./useLoadProgress";

function deferred() {
  let resolve!: () => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("progressOf", () => {
  it("rounds finished / total to a percentage", () => {
    expect(progressOf(0, 5)).toBe(0);
    expect(progressOf(2, 5)).toBe(40);
    expect(progressOf(5, 5)).toBe(100);
    expect(progressOf(9, 5)).toBe(100);
    expect(progressOf(0, 0)).toBe(100);
  });
});

describe("useLoadProgress", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("moves only when a task finishes and ends as done", async () => {
    const a = deferred();
    const b = deferred();
    const { result } = renderHook(() => useLoadProgress([() => a.promise, () => b.promise]));
    expect(result.current).toMatchObject({ progress: 0, status: "loading" });

    await act(async () => a.resolve());
    expect(result.current).toMatchObject({ progress: 50, status: "loading" });

    await act(async () => b.resolve());
    expect(result.current).toMatchObject({ progress: 100, status: "done" });
  });

  it("reports slow after the timeout, then done when data arrives", async () => {
    const a = deferred();
    const { result } = renderHook(() =>
      useLoadProgress([() => a.promise], { slowAfterMs: 10_000 }),
    );

    await act(async () => vi.advanceTimersByTime(10_000));
    expect(result.current.status).toBe("slow");

    await act(async () => a.resolve());
    expect(result.current.status).toBe("done");
  });

  it("reports failed when a task rejects", async () => {
    const a = deferred();
    const { result } = renderHook(() => useLoadProgress([() => a.promise]));
    await act(async () => a.reject(new Error("offline")));
    expect(result.current.status).toBe("failed");
  });
});
