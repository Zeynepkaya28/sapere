import type { Category } from "@/lib/categories";

// Sample facts until editors publish verified ones (Phase 3). Every item is marked sample
// and shown with the "Örnek" label. Facts are well-documented; keep them that way when editing.

export type Place = {
  name: string;
  lat: number;
  lon: number;
};

export type Fact = {
  id: string;
  category: Category;
  title: string;
  body: string;
  place?: Place;
  sample: true;
};

export const facts: Fact[] = [
  {
    id: "ankara-baskent",
    category: "history",
    title: "Ankara nasıl başkent oldu?",
    body: "Ankara, 13 Ekim 1923'te TBMM'nin kabul ettiği bir yasayla Türkiye'nin başkenti oldu. Cumhuriyet 16 gün sonra, 29 Ekim'de ilan edildi.",
    place: { name: "Ankara", lat: 39.925, lon: 32.837 },
    sample: true,
  },
  {
    id: "gobeklitepe",
    category: "history",
    title: "Stonehenge'den binlerce yıl önce",
    body: "Göbeklitepe yaklaşık 11.500 yıl önce inşa edildi. Bu, onu Stonehenge'den 6.000 yıldan daha eski yapar.",
    place: { name: "Şanlıurfa", lat: 37.223, lon: 38.922 },
    sample: true,
  },
  {
    id: "kleopatra",
    category: "history",
    title: "Kleopatra Ay'a inişe daha yakın",
    body: "Büyük Giza Piramidi MÖ 2560 civarında tamamlandı. Kleopatra MÖ 30'da öldü. Yani Kleopatra, piramidin yapımından çok 1969'daki Ay inişine yakın bir zamanda yaşadı.",
    place: { name: "Giza", lat: 29.979, lon: 31.134 },
    sample: true,
  },
  {
    id: "turkce-ekler",
    category: "language",
    title: "Tek kelimelik bir cümle",
    body: "Türkçe sondan eklemeli bir dildir. Kökün sonuna ekler getirilerek 'Çekoslovakyalılaştıramadıklarımızdanmışsınız' gibi tek kelimede bütün bir cümle kurulabilir.",
    sample: true,
  },
  {
    id: "papua-diller",
    category: "language",
    title: "En çok dilin konuşulduğu ülke",
    body: "Papua Yeni Gine'de 800'den fazla dil konuşulur. Bu sayı dünyadaki diğer tüm ülkelerden fazladır.",
    place: { name: "Port Moresby", lat: -9.443, lon: 147.18 },
    sample: true,
  },
  {
    id: "venus-gun",
    category: "space",
    title: "Günü yılından uzun bir gezegen",
    body: "Venüs kendi ekseni etrafında bir turu yaklaşık 243 Dünya gününde tamamlar, Güneş'in etrafını ise 225 günde dolaşır. Yani orada bir gün, bir yıldan uzundur.",
    sample: true,
  },
  {
    id: "turksat-6a",
    category: "space",
    title: "İlk yerli haberleşme uydusu",
    body: "Türkiye'nin yerli olarak geliştirdiği ilk haberleşme uydusu Türksat 6A, 2024'te ABD'deki Cape Canaveral'dan fırlatıldı.",
    place: { name: "Cape Canaveral", lat: 28.392, lon: -80.608 },
    sample: true,
  },
  {
    id: "van-golu",
    category: "nature",
    title: "Dünyanın en büyük sodalı gölü",
    body: "Van Gölü dünyanın en büyük sodalı gölüdür. Suyu o kadar alkalidir ki gölde yaşayabilen bilinen tek balık türü inci kefalidir.",
    place: { name: "Van Gölü", lat: 38.65, lon: 42.9 },
    sample: true,
  },
  {
    id: "ahtapot",
    category: "nature",
    title: "Üç kalp, mavi kan",
    body: "Ahtapotların üç kalbi vardır: ikisi solungaçlara, biri vücudun geri kalanına kan pompalar. Kanları, bakır içeren hemosiyanin yüzünden mavidir.",
    sample: true,
  },
  {
    id: "hyperion",
    category: "nature",
    title: "Bilinen en uzun ağaç",
    body: "Kaliforniya'daki Redwood Ulusal Parkı'nda yaşayan Hyperion adlı sekoya, yaklaşık 116 metreyle bilinen en uzun canlı ağaçtır.",
    place: { name: "Redwood Ulusal Parkı", lat: 41.213, lon: -124.005 },
    sample: true,
  },
  {
    id: "su-yogunluk",
    category: "science",
    title: "Göller neden yüzeyden donar?",
    body: "Su en yoğun hâline yaklaşık 4 °C'de ulaşır. Daha soğuk su yukarıda kalır ve önce yüzey donar; alttaki su sıvı kaldığı için canlılar kışı atlatabilir.",
    sample: true,
  },
  {
    id: "aziz-sancar",
    category: "science",
    title: "Savur'dan Nobel'e",
    body: "Mardin'in Savur ilçesinde doğan Aziz Sancar, DNA onarımı üzerine çalışmalarıyla 2015 Nobel Kimya Ödülü'nü Tomas Lindahl ve Paul Modrich ile paylaştı.",
    place: { name: "Savur, Mardin", lat: 37.538, lon: 40.889 },
    sample: true,
  },
  {
    id: "istanbul-kitalar",
    category: "geography",
    title: "İki kıtada bir şehir",
    body: "İstanbul'un toprakları hem Avrupa'da hem Asya'dadır. İki yakayı yaklaşık 30 kilometre uzunluğundaki İstanbul Boğazı ayırır.",
    place: { name: "İstanbul", lat: 41.02, lon: 28.96 },
    sample: true,
  },
  {
    id: "agri-dagi",
    category: "geography",
    title: "Türkiye'nin çatısı",
    body: "Ağrı Dağı 5.137 metreyle Türkiye'nin en yüksek noktasıdır. Volkanik bir dağdır ve zirvesi yıl boyu buzulla kaplıdır.",
    place: { name: "Ağrı Dağı", lat: 39.702, lon: 44.298 },
    sample: true,
  },
  {
    id: "baykal",
    category: "geography",
    title: "Dünyanın en derin gölü",
    body: "Sibirya'daki Baykal Gölü 1.642 metreye varan derinliğiyle dünyanın en derin gölüdür. Yeryüzündeki donmamış tatlı suyun yaklaşık beşte biri buradadır.",
    place: { name: "Baykal Gölü", lat: 53.5, lon: 108.0 },
    sample: true,
  },
];

export function factById(id: string | undefined | null): Fact | undefined {
  return id ? facts.find((f) => f.id === id) : undefined;
}

export function filterFacts(list: Fact[], selected: ReadonlySet<Category>): Fact[] {
  return selected.size === 0 ? list : list.filter((f) => selected.has(f.category));
}
