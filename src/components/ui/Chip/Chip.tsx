import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { categoryColor, type Category } from "@/lib/categories";
import styles from "./Chip.module.css";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  category: Category;
  /** Toggle chip (filters). Leave undefined for a static label. */
  selected?: boolean;
};

export function Chip({
  category,
  selected,
  className,
  children,
  type = "button",
  ...rest
}: ChipProps) {
  const classes = [styles.chip, className].filter(Boolean).join(" ");
  const style = { "--chip": `var(--${categoryColor(category)})` } as CSSProperties;

  if (selected === undefined) {
    return (
      <span className={classes} style={style} data-category={category}>
        {children}
      </span>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      style={style}
      aria-pressed={selected}
      data-category={category}
      {...rest}
    >
      {children}
    </button>
  );
}
