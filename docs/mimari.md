# Mimari şema

```mermaid
flowchart LR
  subgraph Tarayici["Tarayıcı"]
    UI["Next.js istemci bileşenleri<br/>TanStack Query · next-intl"]
  end

  subgraph Netlify
    RSC["Next.js 15 App Router<br/>Server Components · Route Handlers"]
    TIME["/api/time<br/>(saat farkı ölçümü)"]
  end

  subgraph Supabase
    AUTH["Auth<br/>magic link · anonim · TOTP"]
    DB[("Postgres 17<br/>RLS her tabloda")]
    RPC["SECURITY DEFINER RPC<br/>get_current_question · submit_answer<br/>collect_live_points"]
    RT["Realtime<br/>Postgres changes · Presence · Broadcast"]
    EF["Edge Functions<br/>puanlama · oyun doğrulama"]
    ST["Storage<br/>kapak çıkartmaları"]
  end

  UI -->|HTTP| RSC
  UI -->|offset| TIME
  UI -->|supabase-js| AUTH
  UI -->|supabase-js + RLS| DB
  UI -->|rpc| RPC
  UI <-->|websocket| RT
  UI -->|invoke| EF
  RSC -->|@supabase/ssr, çerezler| DB
  RPC --> DB
  EF --> DB
  DB --> RT
  UI --> ST
```

## İlkeler

- **Güven sınırı sunucudadır.** Doğru cevap, puan ve rol kontrolü yalnızca Postgres fonksiyonlarında ve Edge Functions'ta yapılır.
- **Okuma yolu:** Sayfalar Server Components ile ilk veriyi alır; istemci TanStack Query ile tazeler.
- **Canlı yarışma:** Oturum durumu `live_sessions` satırındaki değişikliklerden, katılımcılar Presence'tan, cevap sayısı ve açıklama Broadcast'ten gelir.
- **Ortamlar:** yerel (`supabase start`), önizleme (her PR'da Netlify Deploy Preview), üretim.

## Klasör yapısı

```
src/
  app/            # rotalar (Faz 2'de [locale] altına taşınacak)
  components/     # Faz 1: Button, Chip, Card, Teddy, TeddyLoader, NavBar…
  lib/
    env.ts        # ortam değişkenlerini okur, eksikse hata verir
    supabase/     # tarayıcı ve sunucu istemcileri
  styles/         # Faz 1: tokens.css
messages/         # Faz 2: tr.json, en.json
supabase/         # yerel yapılandırma, migrations, functions
e2e/              # Playwright
docs/
```
