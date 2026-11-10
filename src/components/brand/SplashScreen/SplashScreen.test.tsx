import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/render";
import { SplashScreen } from "./SplashScreen";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("holds Hazır! for 650 ms, fades for 300 ms, then unmounts and calls onDone", async () => {
  const onDone = vi.fn();
  renderWithIntl(
    <SplashScreen
      tasks={[() => Promise.resolve()]}
      fact={{ text: "Bilgi", sample: true }}
      onDone={onDone}
    />,
  );

  await act(async () => {}); // let the task settle
  const splash = screen.getByTestId("splash");
  expect(splash).toHaveAttribute("data-phase", "holding");
  expect(screen.getByText("Hazır!")).toBeInTheDocument();
  expect(screen.getByText("Örnek")).toBeInTheDocument();

  await act(async () => vi.advanceTimersByTime(649));
  expect(splash).toHaveAttribute("data-phase", "holding");

  await act(async () => vi.advanceTimersByTime(1));
  expect(splash).toHaveAttribute("data-phase", "leaving");

  await act(async () => vi.advanceTimersByTime(300));
  expect(screen.queryByTestId("splash")).toBeNull();
  expect(onDone).toHaveBeenCalledOnce();
});

it("stays up while a source is still loading", async () => {
  renderWithIntl(<SplashScreen tasks={[() => new Promise(() => {})]} />);
  await act(async () => vi.advanceTimersByTime(5000));
  expect(screen.getByTestId("splash")).toHaveAttribute("data-phase", "loading");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
});
