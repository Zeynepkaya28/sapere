import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Teddy } from "@/components/brand/Teddy";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Chip } from "@/components/ui/Chip";
import { categoryList } from "@/lib/categories";
import { BootSplash } from "./_components/BootSplash";
import styles from "./page.module.css";

// Phase 1 home: welcome card only. The feed, polls and leaderboard arrive in Phase 2.
export default async function Home() {
  const t = await getTranslations();

  return (
    <>
      <BootSplash />
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <div className={styles.welcomeText}>
            <h1 id="welcome-title" className={styles.title}>
              {t("home.title")}
            </h1>
            <ul className={styles.chips} aria-label={t("nav.feed")}>
              {categoryList.map((c) => (
                <li key={c}>
                  <Chip category={c}>{t(`categories.${c}`)}</Chip>
                </li>
              ))}
            </ul>
            <p className={styles.soon}>{t("home.soon")}</p>
            <Link href="/tasarim" className={styles.link}>
              {t("home.showcase")} →
            </Link>
          </div>
          <div className={styles.teddyWrap}>
            <Teddy pose="wave" size={168} />
          </div>
        </section>
      </main>
    </>
  );
}
