import type { Pastel } from "@/lib/categories";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  name: string;
  color: Pastel;
  size?: number;
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters =
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return letters.toLocaleUpperCase("tr");
}

export function Avatar({ name, color, size = 40 }: AvatarProps) {
  return (
    <span
      className={styles.avatar}
      role="img"
      aria-label={name}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: `var(--avatar-${color})`,
      }}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}
