# Sapere

Her alandan ilginç bilgiler, anketler, canlı bilgi yarışmaları, mini oyunlar ve interaktif Türkiye haritası.

## Gereksinimler

- Node.js 20.9+ (CI'da 22)
- pnpm 12 (`corepack enable` ya da `npm i -g pnpm`)
- Docker Desktop (yalnızca yerel Supabase için)

## Kurulum

```bash
pnpm install
cp .env.example .env.local
pnpm db:start          # yerel Supabase'i açar, URL ve anon anahtarını yazdırır
pnpm dev               # http://localhost:3000
```

`pnpm db:start` çıktısındaki `API URL` ve `anon key` değerlerini `.env.local` dosyasına yaz.

## Ortam değişkenleri

| Değişken                        | Nerede            | Açıklama                                 |
| ------------------------------- | ----------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | tarayıcı + sunucu | Supabase API adresi                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tarayıcı + sunucu | Supabase anon anahtarı (RLS ile korunur) |
| `SUPABASE_SERVICE_ROLE_KEY`     | yalnızca sunucu   | Edge Functions ve yönetim betikleri      |
| `NEXT_PUBLIC_SITE_URL`          | tarayıcı + sunucu | Magic link ve paylaşım bağlantıları      |
| `SENTRY_DSN`                    | sunucu            | Hata izleme (Faz 7)                      |

## Betikler

| Komut                                    | Ne yapar                       |
| ---------------------------------------- | ------------------------------ |
| `pnpm dev`                               | Geliştirme sunucusu            |
| `pnpm build` / `pnpm start`              | Üretim derlemesi ve sunucusu   |
| `pnpm lint`                              | ESLint                         |
| `pnpm typecheck`                         | TypeScript (strict)            |
| `pnpm format` / `pnpm format:check`      | Prettier                       |
| `pnpm test`                              | Vitest birim testleri          |
| `pnpm test:e2e`                          | Playwright (önce `pnpm build`) |
| `pnpm db:start` / `db:stop` / `db:reset` | Yerel Supabase                 |

Her commit'ten önce Husky, değişen dosyalarda ESLint ve Prettier çalıştırır.

## Kod yapısı

```
src/
  app/                 # rotalar; /tasarim = geçici bileşen vitrini (indekslenmez)
  components/
    brand/             # Teddy, TeddyLoader, SplashScreen
    layout/            # SiteHeader, NavBar (baloncuklu), ThemeToggle
    ui/                # Button, Chip, Card, Avatar, Input, Toast, Modal
  hooks/               # useLoadProgress (gerçek yükleme ilerlemesi)
  i18n/                # next-intl yapılandırması
  lib/
    security/          # CSP ve güvenlik başlıkları
    bubbles.ts         # baloncuk efekti (saf hesap + Web Animations API)
    categories.ts      # kategori → pastel renk, tek kaynak
    color.ts           # WCAG kontrast hesabı
    motion.ts, theme.ts
  middleware.ts        # istek başına CSP nonce'u
  styles/tokens.css    # renk, boşluk, köşe, gölge, hareket belirteçleri
messages/              # tr.json, en.json
```

Her bileşen kendi klasöründe `Bileşen.tsx` + `Bileşen.module.css` + `index.ts` olarak durur.

## Belgeler

- [Karar günlüğü](docs/karar-gunlugu.md)
- [Figma eşlemesi](docs/figma-map.md)
- [Mimari şema](docs/mimari.md)
- [Güvenlik raporu](docs/guvenlik-raporu.md)
