import type { CSSProperties, HTMLAttributes } from "react";
import { categoryColor, type Category } from "@/lib/categories";
import styles from "./Card.module.css";

export type CardProps = HTMLAttributes<HTMLElement> & {
  /** Tints the card with the category pastel (62% light / 30% dark, mixed into --surface). */
  category?: Category;
  as?: "article" | "section" | "div";
};

export function Card({ category, as: Tag = "article", className, style, ...rest }: CardProps) {
  const tint = category
    ? ({ "--tint": `var(--${categoryColor(category)})` } as CSSProperties)
    : undefined;

  return (
    <Tag
      className={[styles.card, category && styles.tinted, className].filter(Boolean).join(" ")}
      style={{ ...tint, ...style }}
      {...rest}
    />
  );
}
