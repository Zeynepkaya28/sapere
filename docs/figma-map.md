# Figma eşlemesi

- **Dosya:** Sapere — Arayüz Örnekleri
- **Bağlantı:** https://www.figma.com/design/hCroAkFDZll0lRKT8l9rS2
- **Durum (2026-11-06):** Figma MCP, Starter plan çağrı sınırı nedeniyle dosyayı okuyamadı. Düğüm kimlikleri PNG dışa aktarımları gelince ya da sınır açılınca doldurulacak.

## Ekranlar

| Ekran                       | Node ID    | Kod karşılığı                       | Durum |
| --------------------------- | ---------- | ----------------------------------- | ----- |
| Akış — masaüstü, açık       | _bekliyor_ | `src/app/[locale]/page.tsx`         | Faz 2 |
| Yükleniyor — mobil, açık    | _bekliyor_ | `SplashScreen`                      | Faz 1 |
| Canlı yarışma — mobil, koyu | _bekliyor_ | `src/app/[locale]/canli/[oturumId]` | Faz 4 |
| Profil — mobil, koyu        | _bekliyor_ | `src/app/[locale]/profil`           | Faz 2 |

## Bileşenler

| Bileşen        | Varyantlar                            | Node ID    | Kod karşılığı  |
| -------------- | ------------------------------------- | ---------- | -------------- |
| Ayıcık         | Yürüme 1, Yürüme 2, El sallama, Mutlu | _bekliyor_ | `Teddy`        |
| Yükleme çubuğu | Tema × İlerleme 18/62/100             | _bekliyor_ | `TeddyLoader`  |
| Gezinme çubuğu | Tema × Normal/Üzerinde/Tıklandı       | _bekliyor_ | `NavBar`       |
| Cevap butonu   | Tema × Renk × Durum                   | _bekliyor_ | `AnswerButton` |
| Kategori çipi  | —                                     | _bekliyor_ | `Chip`         |

## Renk değişkenleri

Koleksiyonlar: "Sapere Açık", "Sapere Koyu". Değişkenler: bg, surface, ink, ink2, line, peach, rose, lavender, butter, sky, mint, accent, on.

Not: Figma'da `ink2` ve `on` adları var; kodda `--ink-2` ve `--accent-ink` kullanılacak. Prompttaki `--surface-2`, `--press`, `--live` Figma listesinde yok; Faz 1'de karşılaştırılacak.
