import Link from "next/link";
import { Teddy } from "@/components/brand/Teddy";
import { NavBar, type NavBarProps } from "../NavBar";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./SiteHeader.module.css";

export function SiteHeader(props: NavBarProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoTeddy}>
          <Teddy pose="wave" size={36} />
        </span>
        sapere
      </Link>
      <div className={styles.nav}>
        <NavBar {...props} />
      </div>
      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </header>
  );
}
