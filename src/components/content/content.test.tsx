import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { facts, filterFacts } from "@/content/facts";
import { categoryList } from "@/lib/categories";
import { getMapViews } from "@/lib/map/views";
import { axeViolations, renderWithIntl } from "@/test/render";
import { FactCard } from "./FactCard";
import { FactFeed } from "./FactFeed";
import { FactMap } from "./FactMap";

const ankara = facts.find((f) => f.id === "ankara-baskent")!;
const venus = facts.find((f) => f.id === "venus-gun")!;
const views = getMapViews(facts);

describe("sample facts", () => {
  it("have unique ids, known categories and the sample flag", () => {
    expect(new Set(facts.map((f) => f.id)).size).toBe(facts.length);
    for (const f of facts) {
      expect(categoryList).toContain(f.category);
      expect(f.sample).toBe(true);
      expect(f.title.length).toBeGreaterThan(0);
      expect(f.body.length).toBeGreaterThan(20);
    }
  });

  it("cover every category", () => {
    expect(new Set(facts.map((f) => f.category))).toEqual(new Set(categoryList));
  });

  it("have valid coordinates", () => {
    for (const { place } of facts) {
      if (!place) continue;
      expect(Math.abs(place.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(place.lon)).toBeLessThanOrEqual(180);
    }
  });

  it("filter shows everything when nothing is selected", () => {
    expect(filterFacts(facts, new Set())).toBe(facts);
    expect(filterFacts(facts, new Set(["space"])).every((f) => f.category === "space")).toBe(true);
  });
});

describe("FactCard", () => {
  it("labels sample content and links to the map", async () => {
    const { container } = renderWithIntl(<FactCard fact={ankara} />);
    const card = screen.getByRole("article", { name: ankara.title });
    expect(within(card).getByText("Örnek")).toBeInTheDocument();
    expect(within(card).getByText("Tarih")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /Haritada gör/ })).toHaveAttribute(
      "href",
      "/harita?bilgi=ankara-baskent",
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it("has no place row for facts without a location", () => {
    renderWithIntl(<FactCard fact={venus} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByText(/Konum/)).toBeNull();
  });

  it("can hide the map link", () => {
    renderWithIntl(<FactCard fact={ankara} mapLink={false} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Ankara")).toBeInTheDocument();
  });
});

describe("FactFeed", () => {
  it("filters by one or more categories and can reset", async () => {
    const { container } = renderWithIntl(<FactFeed facts={facts} />);
    const count = () => screen.getAllByRole("article").length;
    expect(count()).toBe(facts.length);
    expect(screen.getByText(`${facts.length} bilgi`)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tarih" }));
    expect(screen.getByRole("button", { name: "Tarih" })).toHaveAttribute("aria-pressed", "true");
    expect(count()).toBe(3);

    fireEvent.click(screen.getByRole("button", { name: "Uzay" }));
    expect(count()).toBe(5);
    expect(screen.getByText("5 bilgi")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tümünü göster" }));
    expect(count()).toBe(facts.length);
    expect(screen.queryByRole("button", { name: "Tümünü göster" })).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("FactMap", () => {
  const view = (c: HTMLElement, id: string) => c.querySelector<HTMLElement>(`[data-view="${id}"]`)!;

  it("starts on the world view with Turkey grouped into one bubble", async () => {
    const { container } = renderWithIntl(<FactMap views={views} facts={facts} />);
    expect(view(container, "world")).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: "Dünya" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(
      within(view(container, "world")).getByRole("button", {
        name: "Türkiye: 6 bilgi. Yakınlaştır",
      }),
    );
    expect(view(container, "turkey")).toHaveAttribute("data-active", "true");
    expect(view(container, "world")).toHaveAttribute("data-active", "false");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("opens a fact from a pin, updates the URL and closes on Escape", () => {
    const { container } = renderWithIntl(<FactMap views={views} facts={facts} />);
    fireEvent.click(
      within(view(container, "world")).getByRole("button", {
        name: "Bilinen en uzun ağaç (Redwood Ulusal Parkı)",
      }),
    );
    expect(screen.getByRole("heading", { level: 2, name: "Bilinen en uzun ağaç" })).toBeVisible();
    expect(window.location.search).toBe("?bilgi=hyperion");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("heading", { level: 2, name: "Bilinen en uzun ağaç" })).toBeNull();
    expect(window.location.search).toBe("");
  });

  it("opens the fact from ?bilgi= on the right view", () => {
    const { container } = renderWithIntl(
      <FactMap views={views} facts={facts} initialFactId="van-golu" />,
    );
    expect(view(container, "turkey")).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("heading", { level: 2, name: "Dünyanın en büyük sodalı gölü" }),
    ).toBeInTheDocument();
  });

  it("ignores unknown ids and facts without a place", () => {
    renderWithIntl(<FactMap views={views} facts={facts} initialFactId="venus-gun" />);
    expect(screen.getByText(/Bir iğne seç/)).toBeInTheDocument();
  });

  it("lists every located fact as a button", () => {
    renderWithIntl(<FactMap views={views} facts={facts} />);
    const list = screen.getByRole("heading", { name: "Haritadaki bilgiler" }).nextElementSibling!;
    expect(within(list as HTMLElement).getAllByRole("button")).toHaveLength(
      facts.filter((f) => f.place).length,
    );
  });
});
