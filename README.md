# Suphi Atılım ÇELİKÖZ — Kişisel Marka Sitesi

Tek sayfalık, çerçevesiz (framework yok), tamamen statik kişisel tanıtım sitesi.
Türkçe ve İngilizce sürümleri var. Hiçbir kurulum gerektirmez — `index.html` dosyasını
çift tıklayarak da açabilirsin.

---

## 📁 Dosya yapısı

```
Suphi CV/
├─ index.html              ← Türkçe ana sayfa
├─ en.html                 ← İngilizce sürüm
├─ robots.txt              ← Arama motoru yönergesi
├─ .nojekyll               ← GitHub Pages icin (Vercel kullanilsa da zararsiz)
├─ sitemap.xml             ← Site haritası
├─ tools/build-cv-pdf.js   ← CV PDF'lerini üreten betik (geliştirme aracı)
└─ assets/
   ├─ css/style.css        ← Tüm stiller (tema, yazdırma/CV dahil)
   ├─ js/main.js           ← Tüm etkileşimler (bağımlılık yok)
   ├─ cv/                  ← hazır CV PDF'leri (İndir butonları buraya bağlı)
   └─ img/
      ├─ favicon.svg       ← Sekme ikonu
      ├─ suphifoto.png     ← portre fotoğrafın
      ├─ og-cover.jpg      ← (opsiyonel) sosyal medya paylaşım görseli 1200×630
      ├─ apps/             ← uygulama simgeleri (+ opsiyonel ekran görüntüleri)
      └─ certs/            ← (opsiyonel) sertifika belgeleri
```

---

## ✅ Yayına almadan önce yapman gerekenler

### 1. Fotoğrafın  ✅ tamam

Fotoğraf `assets/img/suphifoto.png` yolunda ve sitede görünüyor.

Dosya **215×265 px** olduğu için gösterim boyutu buna göre ayarlandı — büyütme
oranı düşük tutuldu ki fotoğraf net görünsün:

| Ekran | Gösterim | Büyütme |
| --- | --- | --- |
| Masaüstü (≥900px) | 288×356 | 1,34× |
| Tablet / mobil | 248×307 | 1,16× |

**İleride yüksek çözünürlüklü orijinali bulursan** (en az 760×938 px), aynı isimle
üzerine yaz ve fotoğrafı büyütmek için `assets/css/style.css` içinde iki değeri
geri çıkar:

```css
.hero__photo { width: min(100%, 290px); }   /* → 380px */
/* @media (max-width: 900px) içinde: */
.hero__photo { width: min(100%, 250px); }   /* → 300px */
```

En/boy oranı **0,81** (yaklaşık 3:3,7) olmalı — mevcut fotoğrafın oranı zaten bu,
yani orijinali olduğu gibi büyük kaydetmen yeterli, kırpmaya gerek yok.
JPG de olur; o durumda `index.html` ve `en.html` içindeki `suphifoto.png` yazan
4 yeri yeni uzantıyla değiştir.

> Fotoğraf hiç olmazsa site kırılmaz — otomatik olarak “SÇ” baş harfli görsel gösterilir.

### 2. Sertifika görsellerini ekle  (opsiyonel ama tavsiye edilir)

Sertifika kartlarındaki **Görüntüle** butonu bir pencere açar. Belgeleri şu adlarla koyarsan
otomatik görünürler; koymazsan pencerede “henüz eklenmedi” notu çıkar:

```
assets/img/certs/istqb.jpg
assets/img/certs/sdet.jpg
assets/img/certs/udemy-fullstack.jpg
assets/img/certs/btk-testing.jpg
```

### 3. Uygulama ekran görüntüleri  (opsiyonel)

**Uygulama simgeleri ✅ eklendi.** Telefon maketlerinin içinde artık gerçek Play Store
simgelerin görünüyor. Kaynak projelerden alınıp 192×192 px'e küçültüldüler
(2,9 MB → 237 KB):

| Dosya                                    | Kaynak proje         |
| ---------------------------------------- | -------------------- |
| `assets/img/apps/icon-kuryevenakliyat.png` | `tasiapp`            |
| `assets/img/apps/icon-benimkasam.png`      | `benim_kasam`        |
| `assets/img/apps/icon-focuslife.png`       | `pomodoro-sayaci`    |
| `assets/img/apps/icon-hafizatutucum.png`   | `Hafiza-tutucum`     |
| `assets/img/apps/icon-marketlistem.png`    | `market-listem`      |

> Simgeyi güncellersen aynı isimle üzerine yaz; 192×192 px yeterli.

Simgenin altındaki ekran içeriği stilize bir ön izleme — ama artık **gerçek ekranlarına göre**
yazıldı (Market Listem’de “Listelerim / Paylaşılan liste / Kıyasla”, Kurye ve Nakliyat’ta
“Yeni Nakliye · Kurye · Yük / Teklifleri karşılaştır” gibi).

> **Not:** `store-assets` klasörlerindeki mağaza görsellerini kullanmadım. Onlar telefon
> çerçevesi ve başlık metni içeren **pazarlama tasarımları**; telefon maketinin içine
> konulunca telefon-içinde-telefon görünüyorlar.

Gerçek ekran görüntüsü koymak istersen, telefondan **ham ekran görüntüsü** al (çerçevesiz,
yazısız) ve şu adlarla kaydet — telefonun tamamını kaplayarak stilize ön izlemenin yerine geçer:

```
assets/img/apps/kuryevenakliyat.png
assets/img/apps/benimkasam.png
assets/img/apps/focuslife.png
assets/img/apps/hafizatutucum.png
assets/img/apps/marketlistem.png
```

> Boyut: yaklaşık 1080×2220 px (telefon ekran görüntüsü oranı).

### 4. Sosyal bağlantılar  ✅ eklendi

Gerçek adresler yerine kondu (her iki dilde, hem hero hem iletişim bölümünde):

| Platform     | Adres                                                              |
| ------------ | ------------------------------------------------------------------ |
| LinkedIn     | `https://www.linkedin.com/in/suphi-atilim-celikoz/`                  |
| GitHub       | `https://github.com/suphiati`                                        |
| Google Play  | `https://play.google.com/store/apps/developer?id=RiskManage+Studio`  |
| Upwork       | `https://www.upwork.com/freelancers/~0182462aa45cf30710`             |

Aynı dört adres `schema.org` verisine `sameAs` olarak da eklendi — Google’ın bu profilleri
seninle aynı kişi olarak eşleştirmesini sağlar.

### 5. Şirket adı  ⚠️ karar senin

Google Play geliştirici hesabın **RiskManage Studio** adına kayıtlı. Sitede şirketin şu an
“Kendi Yazılım Şirketim” diye geçiyor. Eğer RiskManage Studio kurduğun şirketin adıysa,
adıyla anmak çok daha güçlü durur. Değiştirilecek yerler:

- `index.html` → kariyer zaman çizelgesinde `<span class="tl-org">Kendi Yazılım Şirketim</span>`
- `en.html` → `<span class="tl-org">My own software company</span>`

### 6. Alan adı  ✅ suphicelikoz.com

Alan adı alındı ve site zaten bu adrese göre yapılandırılmış durumda —
değiştirilecek bir şey yok. Geçtiği yerler:

- `index.html` ve `en.html` → `canonical`, `hreflang`, `og:url`, JSON-LD `url`/`image`
- `sitemap.xml` (2 URL)
- `robots.txt` (sitemap satırı)

İleride alan adı değişirse tek komutla güncellenir:

```bash
grep -rl "suphicelikoz.com" index.html en.html sitemap.xml robots.txt | xargs sed -i "s/suphicelikoz\.com/YENI-ALAN-ADI/g"
```

### 7. Teknoloji etiketleri  ✅ projelerden doğrulandı

Yetkinlikler bölümü, yedi proje klasörünün `package.json` dosyaları okunarak yeniden yazıldı.
Artık listedeki her kalem gerçekten kullandığın bir teknoloji.

**Kaldırılanlar** (hiçbir projede yok): Vue, Flutter, Dart, Express, MongoDB,
Selenium, Appium, TestNG, JUnit, Cucumber, TensorFlow Lite, MediaPipe, NLP, Computer Vision.

**Eklenenler** (projelerde fiilen var): TypeScript, Next.js, Tailwind CSS, Vite, Zustand,
TanStack Query, Zod, React Hook Form, Supabase (Postgres/Auth/Realtime/Storage/Edge Functions),
Firebase, React Native, Expo, Expo Router, Capacitor, EAS Build, Playwright, Vitest, Jest,
Sentry, Resend, next-intl, Vercel, Anthropic Claude API, Google Gemini, OpenAI API,
llama.rn (cihaz-üstü GGUF modeli), ML Kit OCR, konuşma tanıma.

> Yeni bir teknolojiye geçtiğinde etiketi eklemek/çıkarmak tek satır:
> `<li><span class="tag">Yeni Teknoloji</span></li>`

---

## 📄 CV çıktısı

Sağ üstteki **CV İndir** ve sayfa sonundaki **CV'mi İndir** butonları hazır bir PDF
dosyasını doğrudan indirir — yazdırma penceresi açılmaz:

| Sayfa | İnen dosya |
| --- | --- |
| `index.html` | `assets/cv/Suphi-Atilim-Celikoz-CV.pdf` |
| `en.html` | `assets/cv/Suphi-Atilim-Celikoz-CV-EN.pdf` |

PDF'ler sitenin kendi `@media print` stilinden üretiliyor: yani inen dosya, sayfayı
**Ctrl+P** ile yazdırdığında çıkacak olanın birebir aynısı — **3 sayfalık** derli toplu
bir CV. (Ekranda görünen site hiç değişmez; Ctrl+P de çalışmaya devam eder.)

> **Dosyanın adını değiştirmek istersen** `assets/cv/` içindeki dosyayı yeniden
> adlandır ve HTML'deki `href`'i güncelle. `<a download="başka-ad.pdf">` yazmak
> yetmez: Vercel her statik dosyada `Content-Disposition: inline; filename="..."`
> gönderiyor ve tarayıcı bunu öznitelikteki isme tercih ediyor. Yani yerelde
> çalışır, yayında sessizce yok sayılır — indirilen adı yalnızca diskteki ad belirler.

### Çıktıya giren / girmeyen

| Girer | Girmez |
| --- | --- |
| Ad, unvanlar, özet, iletişim | Menü, butonlar, animasyonlar |
| İstatistikler (10+ yıl, 5 uygulama…) | Bölüm giriş paragrafları (`.section-desc`) |
| Hakkımda — ilk iki paragraf | Kalan anlatım + alıntı bloğu |
| Kariyer zaman çizelgesi (tam) | “Uzmanlık Alanlarım” (zaman çizelgesiyle aynı bilgi) |
| Projeler: ad, adres, tek satır tanım, teknolojiler | Projelerin Problem/Çözüm/Ölçek detayları |
| Yetkinlikler (3 sütun), sertifikalar, eğitim | Telefon maketleri, kariyer akış görseli |

> Bağlantıların yanına tam URL basılmıyor; proje adresleri zaten kartın üstünde
> metin olarak yazılı, tekrarı sayfalarca yer kaplıyordu.

**Daha kısa/uzun istersen** `assets/css/style.css` sonundaki `@media print` bloğunda:
gizlenecekleri `display: none !important` listesine ekle/çıkar, genel boyut için
`body { font-size: 8.6pt }` değerini oynat.

### PDF'i yeniden üretmek

**Sayfa içeriğini ya da `@media print` bloğunu her değiştirdiğinde** PDF'ler eskir.
Kurulum yok; Node ve Chrome (veya Edge) yeterli:

```bash
node tools/build-cv-pdf.js --check   # eskimiş mi? (çıkış kodu 1 = eskimiş)
node tools/build-cv-pdf.js           # yeniden üret
```

Betik Chrome'u arka planda açar, iki sayfayı da yazdırma stiliyle basar ve
`assets/cv/` altındaki dosyaların üzerine yazar. Çıktıyı **yazmadan önce**
doğruluyor — geçerli PDF mi, 2–4 sayfa mı, portre yüklendi mi, istatistik
rakamları HTML'deki değerlerle aynı mı, e-posta yerleşti mi, filtreyle gizli
kalan proje var mı, yazdırma paleti (`--brand: #14497f`) gerçekten uygulandı mı.
Biri tutmazsa dosya yazılmaz ve betik hata verir. İçerik değişmemişse dosyaya
hiç dokunmaz, böylece `git status` boş yere kirlenmez.

> ⚠️ İnternet bağlantısı gerekir: Google Fonts inmezse PDF sistem yazı tipiyle
> üretilir ve bütün sayfa sonları kayar. Betik bu durumda uyarı basar.

> `assets/cv/.build-stamp` kaynakların özetini tutar; `--check` bunu karşılaştırır.
> Dosya tarihine bakmıyor: `git clone` dosyaları alfabetik sırayla yazdığı için
> PDF'ler her taze klonda `index.html`'den eski görünür ve tarih karşılaştırması
> koşulsuz “eskimiş” derdi. Bu dosya da depoya girer.

> `tools/` klasörü Vercel tarafından da yayınlanır (siteye bağlantısı yoktur ama
> `suphicelikoz.com/tools/build-cv-pdf.js` adresinden erişilebilir). İçinde gizli
> bilgi yok; gerçekten gizlemek istersen `.vercelignore` eklemek gerekir.

---

## 🚀 Yayın  ✅ canlı

Site yayında ve her `git push` ile otomatik güncelleniyor.

| | Adres |
| --- | --- |
| **Canlı site** | **https://suphicelikoz.com** |
| İngilizce | https://suphicelikoz.com/en.html |
| Kaynak kod | https://github.com/suphiati/suphicelikoz |
| Vercel projesi | https://vercel.com/suphis-projects-f81baff7/suphicelikoz |

### Nasıl güncellerim?

Dosyalarda değişiklik yap, sonra:

```bash
git add -A && git commit -m "aciklama" && git push
```

Vercel `main` dalını izliyor; push'tan ~30 saniye sonra site güncellenir.
Başka bir dala push edersen otomatik olarak bir **önizleme (preview)** adresi oluşur —
canlı siteye dokunmaz, önce orada denersin.

### Kurulum böyle yapıldı (bir daha gerekirse)

**Vercel**
- Proje `suphiati/suphicelikoz` deposundan **Import** edildi (Clone değil — Clone yeni bir depo oluşturur).
- Application Preset: **Other** (statik site, build komutu yok).
- Root Directory: `./`
- Environment Variables: yok.

**Alan adları** (Vercel → Settings → Domains)

| Alan adı | Davranış |
| --- | --- |
| `suphicelikoz.com` | Production — sitenin kendisi |
| `www.suphicelikoz.com` | **308** kalıcı yönlendirme → `suphicelikoz.com` |
| `suphicelikoz.vercel.app` | Vercel'in verdiği yedek adres |

> Apex'i (www'suz) ana adres seçtim çünkü sayfalardaki `canonical` etiketleri
> `https://suphicelikoz.com/` diyor. Vercel'in "Redirect apex domains to www"
> önerisini bilerek **kapattım**; açık kalsaydı canonical ile yönlendirme
> birbiriyle çelişirdi.

**DNS** (Cloudflare — `suphicelikoz.com` zone'u)

| Tip | Ad | Hedef | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` | `c6640786ac790380.vercel-dns-017.com` | **DNS only** |
| CNAME | `www` | `c6640786ac790380.vercel-dns-017.com` | **DNS only** |

> ⚠️ **Proxy'yi (turuncu bulut) açma.** Vercel kendi CDN'ini ve SSL sertifikasını
> kullanıyor; Cloudflare proxy'si açık olursa sertifika üretimi ve yönlendirmeler
> bozulabilir. Cloudflare panelinde "Proxying is required for most security
> features" uyarısı çıkar — bu kurulumda görmezden gelinir.

### Doğrulama

```bash
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" https://suphicelikoz.com/
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.suphicelikoz.com/
```

Beklenen: apex `200`, www `308 https://suphicelikoz.com/`.

---

## 🎨 Renkleri değiştirmek

Tüm renk paleti `assets/css/style.css` dosyasının en üstündeki `:root` bloğunda:

```css
--brand: #2e7dff;   /* elektrik mavisi — ana vurgu */
--cyan:  #22d3ee;   /* ikincil vurgu */
--bg:    #060a15;   /* koyu lacivert zemin */
```

Açık tema renkleri hemen altındaki `html[data-theme="light"]` bloğunda.

---

## 🔧 Teknik notlar

- **Bağımlılık yok.** Sadece Google Fonts dışarıdan yükleniyor; internet olmasa da site çalışır
  (sistem yazı tipine düşer).
- **CV butonu düz bağlantı.** JavaScript çalıştırmaz; `assets/cv/` altındaki dosyaya
  bağlı normal bir `<a download>` etiketidir — JavaScript kapalıyken, orta tıklamayla
  ve “bağlantıyı farklı kaydet” ile de çalışır.
- **Tema:** koyu/açık geçiş sağ üstteki butonla, tercih `localStorage`’a kaydedilir.
  İlk açılışta işletim sistemi tercihine uyar.
- **Erişilebilirlik:** klavyeyle tam gezinilebilir, `skip link`, `aria` etiketleri,
  `prefers-reduced-motion` desteği var.
- **SEO:** Open Graph, `hreflang`, `sitemap.xml` ve schema.org `Person` yapılandırılmış verisi eklendi.
- **Spam koruması:** e-posta ve telefon HTML içinde düz metin olarak yazılmaz,
  JavaScript ile birleştirilir. Basit botlar toplayamaz.
- **Tarayıcı desteği:** Chrome, Edge, Firefox, Safari güncel sürümler.
  `color-mix()` kullanıldığı için çok eski tarayıcılarda renkler sadeleşir, düzen bozulmaz.

---

> `.claude/` klasoru yalnizca yerel onizleme icindir (bagimliliksiz kucuk bir
> statik sunucu). Siteyi yayina alirken gerekmez; `.gitignore` icinde haric tutuldu.
>
> `tools/` klasoru ise depoya **girer**. Icindeki betik, depoda duran iki CV PDF'ini
> ureten tek dosyalik bir gelistirme aracidir; `.claude/` gibi haric tutulsaydi
> PDF'leri baska bir bilgisayarda guncellemek mumkun olmazdi. Ayni sebeple
> `.claude/serve.js`'i cagirmak yerine kendi mini sunucusunu iceriyor.
