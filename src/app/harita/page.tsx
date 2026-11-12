import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FactMap } from "@/components/content/FactMap";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { facts } from "@/content/facts";
import { getMapViews } from "@/lib/map/views";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("map");
  return { title: t("metaTitle") };
}

type Props = { searchParams: Promise<{ bilgi?: string | string[] }> };

// TODO(figma): the map screen was built from the prompt; compare once the design PNGs arrive.
export default async function MapPage({ searchParams }: Props) {
  const t = await getTranslations("map");
  const { bilgi } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <header className={styles.head}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.intro}>{t("intro")}</p>
        </header>
        <FactMap
          views={getMapViews(facts)}
          facts={facts}
          initialFactId={typeof bilgi === "string" ? bilgi : undefined}
        />
      </main>
    </>
  );
}
