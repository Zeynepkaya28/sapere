import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Teddy } from "@/components/brand/Teddy";
import { FactFeed } from "@/components/content/FactFeed";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { facts } from "@/content/facts";
import { BootSplash } from "./_components/BootSplash";
import styles from "./page.module.css";

// Home: welcome card and the fact feed. Polls and leaderboard come later.
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
            <p className={styles.intro}>{t("home.intro")}</p>
            <div className={styles.actions}>
              <a href="#bilgiler" className={`${styles.action} ${styles.primary}`}>
                {t("home.browse")}
              </a>
              <Link href="/harita" className={`${styles.action} ${styles.secondary}`}>
                {t("home.explore")}
              </Link>
            </div>
          </div>
          <div className={styles.teddyWrap}>
            <Teddy pose="wave" size={168} />
          </div>
        </section>

        <section id="bilgiler" className={styles.feed} aria-labelledby="feed-title">
          <div className={styles.feedHead}>
            <h2 id="feed-title" className={styles.feedTitle}>
              {t("feed.title")}
            </h2>
            <p className={styles.note}>{t("feed.sampleNote")}</p>
          </div>
          <FactFeed facts={facts} />
        </section>
      </main>
    </>
  );
}
