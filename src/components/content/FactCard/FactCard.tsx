import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import type { Fact } from "@/content/facts";
import styles from "./FactCard.module.css";

export type FactCardProps = {
  fact: Fact;
  /** Heading level inside the page outline. */
  level?: 2 | 3;
  /** Shows "Haritada gör" when the fact has a place. Off on the map itself. */
  mapLink?: boolean;
  className?: string;
};

export function FactCard({ fact, level = 3, mapLink = true, className }: FactCardProps) {
  const t = useTranslations();
  const Heading = level === 2 ? "h2" : "h3";
  const titleId = `fact-${fact.id}`;

  return (
    <Card
      category={fact.category}
      className={[styles.card, className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
      data-fact={fact.id}
    >
      <div className={styles.meta}>
        <Chip category={fact.category}>{t(`categories.${fact.category}`)}</Chip>
        {fact.sample && <span className={styles.sample}>{t("fact.sample")}</span>}
      </div>
      <Heading id={titleId} className={styles.title}>
        {fact.title}
      </Heading>
      <p className={styles.body}>{fact.body}</p>
      {fact.place && (
        <div className={styles.footer}>
          <span className={styles.place}>
            <PinIcon />
            <span className="visually-hidden">{t("fact.place")}: </span>
            {fact.place.name}
          </span>
          {mapLink && (
            <Link href={`/harita?bilgi=${fact.id}`} className={styles.mapLink}>
              {t("fact.onMap")}
              <span aria-hidden="true"> →</span>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
