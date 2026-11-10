"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { PointerEvent, MouseEvent } from "react";
import { burstParticles, centerOf, hoverParticles, spawnParticles } from "@/lib/bubbles";
import { NavIcon } from "./NavIcon";
import { isActive, visibleItems } from "./navItems";
import styles from "./NavBar.module.css";

export type NavBarProps = {
  /** Shows the Editor item. Display only: routes check the role on the server. */
  isEditor?: boolean;
  /** A quiz lobby is open or starts within 15 minutes. */
  liveActive?: boolean;
  /** Locks navigation (e.g. while inside a live quiz). */
  disabled?: boolean;
};

function onHover(event: PointerEvent<HTMLElement>) {
  // Touch has no hover; only a real mouse gets the hover bubbles.
  if (event.pointerType !== "mouse") return;
  const { x, y } = centerOf(event.currentTarget);
  spawnParticles(hoverParticles(), x, y);
}

function onBurst(event: MouseEvent<HTMLElement>) {
  const { x, y } = centerOf(event.currentTarget);
  spawnParticles(burstParticles(), x, y);
}

export function NavBar({ isEditor = false, liveActive = false, disabled = false }: NavBarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className={styles.nav}>
      <ul className={styles.list}>
        {visibleItems(isEditor).map((item) => {
          const active = isActive(item.href, pathname);
          const label = t(item.key);
          const content = (
            <>
              <span className={styles.icon}>
                <NavIcon name={item.key} />
              </span>
              <span className={styles.label}>{label}</span>
              {item.key === "live" && liveActive && (
                <>
                  <span className={styles.liveDot} aria-hidden="true" />
                  <span className="visually-hidden">, {t("liveActive")}</span>
                </>
              )}
            </>
          );

          return (
            <li key={item.key}>
              {disabled ? (
                <span
                  className={styles.link}
                  aria-disabled="true"
                  data-active={active || undefined}
                >
                  {content}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={active ? "page" : undefined}
                  onPointerEnter={onHover}
                  onClick={onBurst}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
