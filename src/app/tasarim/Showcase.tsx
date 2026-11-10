"use client";

// Developer gallery: labels here are internal and not translated.
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Teddy, type TeddyPose } from "@/components/brand/Teddy";
import { TeddyLoader } from "@/components/brand/TeddyLoader";
import { Avatar, Button, Card, Chip, Input, Modal, useToast } from "@/components/ui";
import { categoryList, pastels, type Category } from "@/lib/categories";
import styles from "./Showcase.module.css";

const poses: TeddyPose[] = ["walk", "wave", "happy", "sad"];

export function Showcase() {
  const t = useTranslations("categories");
  const toast = useToast();
  const [selected, setSelected] = useState<Category | null>("science");
  const [modalOpen, setModalOpen] = useState(false);
  const [demo, setDemo] = useState(18);

  // Animated demo loader: cycles 18 → 62 → 100 to show the 500 ms transitions.
  useEffect(() => {
    const steps = [18, 62, 100];
    let i = 0;
    const timer = window.setInterval(() => {
      i = (i + 1) % steps.length;
      setDemo(steps[i]);
    }, 1600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Bileşenler</h1>
      <p className={styles.note}>
        Geçici vitrin (Storybook gelene kadar). Değerler prompttan; Figma ile karşılaştırma
        bekliyor.
      </p>

      <Section title="Ayıcık">
        <div className={styles.row}>
          {poses.map((pose) => (
            <figure key={pose} className={styles.figure}>
              <Teddy pose={pose} size={96} />
              <figcaption className="eyebrow">{pose}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Yükleme çubuğu">
        <div className={styles.stack}>
          <TeddyLoader progress={demo} status={demo === 100 ? "done" : "loading"} />
          <TeddyLoader progress={62} status="slow" />
          <TeddyLoader progress={40} size="sm" />
        </div>
      </Section>

      <Section title="Butonlar">
        <div className={styles.row}>
          <Button>Lobiye katıl</Button>
          <Button variant="secondary">İkincil</Button>
          <Button variant="ghost">Hayalet</Button>
          <Button size="sm">Küçük</Button>
          <Button disabled>Kapalı</Button>
        </div>
      </Section>

      <Section title="Kategori çipleri">
        <div className={styles.row}>
          {categoryList.map((c) => (
            <Chip
              key={c}
              category={c}
              selected={selected === c}
              onClick={() => setSelected(selected === c ? null : c)}
            >
              {t(c)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Kartlar">
        <div className={styles.grid}>
          {categoryList.map((c) => (
            <Card key={c} category={c}>
              <Chip category={c}>{t(c)}</Chip>
              <h3 className={styles.cardTitle}>Örnek kart başlığı</h3>
              <p className={styles.cardBody}>
                Örnek içerik. Kart zemini kategorinin pastel rengidir.
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Avatarlar">
        <div className={styles.row}>
          {pastels.map((p, i) => (
            <Avatar
              key={p}
              name={["Deniz Ak", "Ayşe", "İpek Su", "Can", "Ömer Ün", "Zeynep"][i]}
              color={p}
              size={48}
            />
          ))}
        </div>
      </Section>

      <Section title="Giriş alanı">
        <div className={styles.stack}>
          <Input label="Takma ad" hint="2–20 karakter" placeholder="merakli_ayicik" />
          <Input label="Takma ad" defaultValue="a" error="En az 2 karakter olmalı." />
        </div>
      </Section>

      <Section title="Bildirim ve pencere">
        <div className={styles.row}>
          <Button onClick={() => toast.show({ message: "Yeni rozet: İlk doğru!" })}>
            Rozet bildirimi
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Çıkış onayı
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Yarışmadan çıkmak istiyor musun?"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Kal
              </Button>
              <Button onClick={() => setModalOpen(false)}>Evet, çık</Button>
            </>
          }
        >
          <p>Çıkarsan bu yarışmaya geri dönemezsin.</p>
        </Modal>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{title}</h2>
      {children}
    </section>
  );
}
