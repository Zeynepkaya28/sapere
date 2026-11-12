"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { FactCard } from "@/components/content/FactCard";
import type { Fact } from "@/content/facts";
import { categoryColor } from "@/lib/categories";
import type { MapView, MapViewId } from "@/lib/map/views";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./FactMap.module.css";

export type FactMapProps = {
  /** Built on the server by getMapViews(); the browser only gets path strings. */
  views: MapView[];
  facts: Fact[];
  /** From ?bilgi=, so "Haritada gör" links open the right card. */
  initialFactId?: string;
};

const pinColor = (fact: Fact) =>
  ({ "--pin": `var(--${categoryColor(fact.category)})` }) as CSSProperties;

export function FactMap({ views, facts, initialFactId }: FactMapProps) {
  const t = useTranslations("map");
  const byId = useMemo(() => new Map(facts.map((f) => [f.id, f])), [facts]);
  const turkeyIds = useMemo(
    () => new Set(views.find((v) => v.id === "turkey")?.pins.map((p) => p.factId)),
    [views],
  );
  const viewFor = (id: string): MapViewId => (turkeyIds.has(id) ? "turkey" : "world");

  const initial = initialFactId && byId.get(initialFactId)?.place ? initialFactId : null;
  const [selectedId, setSelectedId] = useState<string | null>(initial);
  const [viewId, setViewId] = useState<MapViewId>(initial ? viewFor(initial) : "world");
  const selected = selectedId ? byId.get(selectedId) : undefined;
  const located = facts.filter((f) => f.place);

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollToCard = useRef(false);

  function select(id: string | null) {
    const previous = selectedId;
    setSelectedId(id);
    if (id) {
      setViewId(viewFor(id));
      scrollToCard.current = true;
    }
    window.history.replaceState(null, "", id ? `?bilgi=${encodeURIComponent(id)}` : "/harita");
    // Closing removes the focused button, so hand focus back to the fact's pin.
    if (!id && previous) {
      requestAnimationFrame(() => {
        rootRef.current
          ?.querySelector<HTMLButtonElement>(`[data-active="true"] [data-pin="${previous}"]`)
          ?.focus();
      });
    }
  }

  // On phones the card sits under the map; bring it into view after a pick.
  useEffect(() => {
    if (!selectedId || !scrollToCard.current) return;
    scrollToCard.current = false;
    const card = cardRef.current;
    if (!card) return;
    const { top, bottom } = card.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight) {
      card.scrollIntoView({
        block: "nearest",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className={styles.layout} ref={rootRef}>
      <div className={styles.mapCol}>
        <div className={styles.toolbar} role="group" aria-label={t("viewLabel")}>
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              className={styles.segment}
              aria-pressed={v.id === viewId}
              onClick={() => setViewId(v.id)}
            >
              {t(v.id)}
            </button>
          ))}
        </div>

        <div className={styles.stage}>
          {views.map((view) => {
            const active = view.id === viewId;
            return (
              <div
                key={view.id}
                className={styles.view}
                data-view={view.id}
                data-active={active}
                inert={!active}
              >
                <svg
                  className={styles.svg}
                  viewBox={`0 0 ${view.width} ${view.height}`}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path className={styles.land} d={view.land} />
                  <path className={styles.home} d={view.home} />
                  <path className={styles.borders} d={view.borders} />
                </svg>

                <ul className={styles.pins}>
                  {view.pins.map((pin, i) => {
                    const fact = byId.get(pin.factId);
                    if (!fact?.place) return null;
                    return (
                      <li
                        key={pin.factId}
                        className={styles.pinItem}
                        style={
                          {
                            left: `${pin.x}%`,
                            top: `${pin.y}%`,
                            "--i": i,
                            ...pinColor(fact),
                          } as CSSProperties
                        }
                      >
                        <button
                          type="button"
                          className={styles.pin}
                          data-pin={fact.id}
                          aria-pressed={fact.id === selectedId}
                          aria-label={t("pin", { title: fact.title, place: fact.place.name })}
                          onClick={() => select(fact.id === selectedId ? null : fact.id)}
                        >
                          <span className={styles.dot} />
                          <span className={styles.label} aria-hidden="true">
                            {fact.place.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {view.cluster && (
                    <li
                      className={`${styles.pinItem} ${styles.clusterItem}`}
                      style={
                        {
                          left: `${view.cluster.x}%`,
                          top: `${view.cluster.y}%`,
                          "--i": view.pins.length,
                        } as CSSProperties
                      }
                    >
                      <button
                        type="button"
                        className={styles.cluster}
                        aria-label={t("cluster", { count: view.cluster.count })}
                        onClick={() => setViewId("turkey")}
                      >
                        {t("clusterShort", { count: view.cluster.count })}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <aside className={styles.panel} aria-labelledby="map-list-title">
        <p className="visually-hidden" aria-live="polite">
          {selected ? t("opened", { title: selected.title }) : ""}
        </p>

        {selected ? (
          <div key={selected.id} ref={cardRef} className={styles.selected}>
            <FactCard fact={selected} level={2} mapLink={false} />
            <button type="button" className={styles.close} onClick={() => select(null)}>
              {t("close")}
            </button>
          </div>
        ) : (
          <p className={styles.hint}>{t("hint")}</p>
        )}

        <h2 id="map-list-title" className={styles.listTitle}>
          {t("listTitle")}
        </h2>
        <ul className={styles.list}>
          {located.map((fact) => (
            <li key={fact.id}>
              <button
                type="button"
                className={styles.listItem}
                style={pinColor(fact)}
                aria-pressed={fact.id === selectedId}
                onClick={() => select(fact.id)}
              >
                <span className={styles.listDot} aria-hidden="true" />
                <span className={styles.listText}>
                  <span className={styles.listName}>{fact.title}</span>
                  <span className={styles.listPlace}>{fact.place!.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.elsewhere}>
          {t("elsewhere")} <Link href="/#bilgiler">{t("toFeed")}</Link>
        </p>
      </aside>
    </div>
  );
}
