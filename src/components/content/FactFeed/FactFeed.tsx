"use client";

import { useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
import { FactCard } from "@/components/content/FactCard";
import { Chip } from "@/components/ui/Chip";
import { filterFacts, type Fact } from "@/content/facts";
import { categoryList, type Category } from "@/lib/categories";
import styles from "./FactFeed.module.css";

export type FactFeedProps = { facts: Fact[] };

/** Card feed with multi-select category filters. No filter selected shows everything. */
export function FactFeed({ facts }: FactFeedProps) {
  const t = useTranslations();
  const [selected, setSelected] = useState<ReadonlySet<Category>>(new Set());
  const visible = filterFacts(facts, selected);

  function toggle(category: Category) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <div className={styles.feed}>
      <div className={styles.filters} role="group" aria-label={t("feed.filterLabel")}>
        {categoryList.map((c) => (
          <Chip key={c} category={c} selected={selected.has(c)} onClick={() => toggle(c)}>
            {t(`categories.${c}`)}
          </Chip>
        ))}
        {selected.size > 0 && (
          <button type="button" className={styles.clear} onClick={() => setSelected(new Set())}>
            {t("feed.clear")}
          </button>
        )}
      </div>

      <p className={styles.count} aria-live="polite">
        {t("feed.count", { count: visible.length })}
      </p>

      {/* New key on every filter change replays the entrance animation. */}
      <ul className={styles.grid} key={[...selected].sort().join(",")}>
        {visible.map((fact, i) => (
          <li key={fact.id} className={styles.item} style={{ "--i": i } as CSSProperties}>
            <FactCard fact={fact} />
          </li>
        ))}
      </ul>
    </div>
  );
}
