import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Teddy } from "./brand/Teddy";
import { TeddyLoader } from "./brand/TeddyLoader";
import { NavBar } from "./layout/NavBar";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Input,
  Modal,
  ToastProvider,
  initialsOf,
  useToast,
} from "./ui";
import { axeViolations, renderWithIntl } from "@/test/render";

vi.mock("next/navigation", () => ({ usePathname: () => "/oyunlar" }));

describe("Teddy", () => {
  it.each(["walk", "wave", "happy", "sad"] as const)(
    "%s pose is decorative and passes axe",
    async (pose) => {
      const { container } = renderWithIntl(<Teddy pose={pose} />);
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("data-pose", pose);
      expect(await axeViolations(container)).toEqual([]);
    },
  );
});

describe("TeddyLoader", () => {
  it("exposes real progress and a text status", async () => {
    const { container } = renderWithIntl(<TeddyLoader progress={62} />);
    const bar = screen.getByRole("progressbar", { name: "Yükleniyor" });
    expect(bar).toHaveAttribute("aria-valuenow", "62");
    expect(screen.getByText("Ayıcık bilgileri topluyor…")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("data-pose", "walk");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the happy teddy and Hazır! at 100%", () => {
    const { container } = renderWithIntl(<TeddyLoader progress={100} status="done" />);
    expect(screen.getByText("Hazır!")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("data-pose", "happy");
  });

  it("shows the sad teddy when data is late", () => {
    const { container } = renderWithIntl(<TeddyLoader progress={40} status="slow" />);
    expect(screen.getByText(/Veri gecikiyor/)).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("data-pose", "sad");
  });

  it("clamps out-of-range values", () => {
    renderWithIntl(<TeddyLoader progress={140} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});

describe("NavBar", () => {
  it("marks the current page and hides the editor item from non-editors", async () => {
    const { container } = renderWithIntl(<NavBar />);
    expect(screen.getByRole("navigation", { name: "Ana gezinme" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oyunlar" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Akış" })).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("link", { name: "Editör" })).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the editor item and a text label for the live dot", () => {
    renderWithIntl(<NavBar isEditor liveActive />);
    expect(screen.getByRole("link", { name: "Editör" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Canlı, Canlı yarışma var/ })).toBeInTheDocument();
  });

  it("removes links when navigation is locked", () => {
    renderWithIntl(<NavBar disabled />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});

describe("UI components", () => {
  it("Button, Chip, Card and Avatar pass axe", async () => {
    const { container } = renderWithIntl(
      <div>
        <Button>Lobiye katıl</Button>
        <Chip category="science">Bilim</Chip>
        <Chip category="space" selected={false}>
          Uzay
        </Chip>
        <Card category="history">
          <h3>Başlık</h3>
        </Card>
        <Avatar name="Deniz Ak" color="mint" />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
    expect(screen.getByRole("button", { name: "Uzay" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("img", { name: "Deniz Ak" })).toHaveTextContent("DA");
  });

  it("builds initials with Turkish casing", () => {
    expect(initialsOf("ipek su")).toBe("İS");
    expect(initialsOf("ömer")).toBe("ÖM");
    expect(initialsOf("   ")).toBe("?");
  });

  it("Input links its hint and error to the field", async () => {
    const { container } = renderWithIntl(
      <Input label="Takma ad" hint="2–20 karakter" error="Çok kısa" />,
    );
    const input = screen.getByLabelText("Takma ad");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("2–20 karakter Çok kısa");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("Modal is labelled by its title and closes from its button", async () => {
    const onClose = vi.fn();
    const { container } = renderWithIntl(
      <Modal open onClose={onClose} title="Yarışmadan çık">
        <p>Çıkarsan geri dönemezsin.</p>
      </Modal>,
    );
    const dialog = container.querySelector("dialog")!;
    // jsdom does not open <dialog>, so check the label wiring directly.
    const labelId = dialog.getAttribute("aria-labelledby")!;
    expect(document.getElementById(labelId)).toHaveTextContent("Yarışmadan çık");
    fireEvent.click(screen.getByRole("button", { name: "Kapat", hidden: true }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });

  function ToastDemo() {
    function Trigger() {
      const toast = useToast();
      return <Button onClick={() => toast.show({ message: "Yeni rozet!" })}>Göster</Button>;
    }
    return (
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
  }

  it("Toast announces politely and passes axe", async () => {
    const { container } = renderWithIntl(<ToastDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Göster" }));
    expect(screen.getByRole("status")).toHaveTextContent("Yeni rozet!");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("Toast disappears after 4 s", () => {
    vi.useFakeTimers();
    try {
      renderWithIntl(<ToastDemo />);
      fireEvent.click(screen.getByRole("button", { name: "Göster" }));
      act(() => vi.advanceTimersByTime(3999));
      expect(screen.getByRole("status")).toHaveTextContent("Yeni rozet!");
      act(() => vi.advanceTimersByTime(1));
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
    } finally {
      vi.useRealTimers();
    }
  });
});
