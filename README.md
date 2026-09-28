# Suphi Atılım ÇELİKÖZ — Kişisel Site

Projelerimi, deneyimimi ve blog yazılarımı sunan çok sayfalı, Türkçe ve İngilizce
statik site. Canlı adres: **https://suphicelikoz.com**

Sayfalar, `content/` klasöründeki verilerden (profil, projeler, blog yazıları) küçük
bir üretici betikle oluşturulur. **Bağımlılık yok:** yalnızca Node.js gerekir,
`npm install` yoktur. Çıktı düz HTML, CSS ve JavaScript'tir.

> **Neden bir üretici?** Site tek sayfadan çok sayfaya geçti: 8 proje detay sayfası,
> blog, iki dil. Menü, alt menü, meta etiketleri ve proje bilgileri her sayfada elle
> kopyalansaydı bir değişiklik 20+ dosyaya yayılırdı. Artık her bilgi tek yerde
> duruyor; tek komut bütün sayfaları, site haritasını ve RSS'i yeniden üretiyor.

---

## ⚡ Hızlı başlangıç

Gereken: **Node.js 18 veya üstü.** (Chrome ya da Edge yalnızca CV PDF'i ve paylaşım
kapağını yeniden üretirken gerekir.)

```bash
node tools/serve.js            # önizleme: http://localhost:4173  (yayınla aynı)
node tools/serve.js --drafts   # taslak blog yazıları DAHİL önizleme
node tools/build-site.js       # yayın çıktısını dist/ klasörüne üretir
node tools/check-site.js       # yayından önce denetim (bağlantılar, başlıklar, taslak sızıntısı…)
node --test tools/test/markdown.test.js   # blog dönüştürücüsünün testleri
```

Önizleme sunucusu açıkken bir dosyayı değiştirip tarayıcıda sayfayı yenilemen yeterli;
site bir sonraki istekte yeniden üretilir. Bir hata varsa tarayıcıda açıklaması görünür.

> `dist/index.html` dosyasını çift tıklayarak açma: bağlantılar kök adresli
> (`/projeler/`) olduğu için dosya olarak açıldığında çalışmaz. `node tools/serve.js`
> kullan.

---

## 📁 Dosya yapısı

```
content/                 ← İÇERİK: çoğu değişiklik burada yapılır
├─ profile.js            ← ad, iletişim, bağlantılar, hakkımda, deneyim, eğitim,
│                          yetkinlikler, sertifikalar, CV özeti
├─ projects.js           ← 8 projenin her biri için TEK kayıt
├─ site.js               ← menü, düğme ve sayfa metinleri (TR / EN), sayfa başlıkları
└─ blog/
   ├─ tr/*.md            ← Türkçe yazılar (dosya adı = adres)
   └─ en/*.md            ← İngilizce yazılar

src/                     ← ŞABLONLAR (tasarım değişmedikçe dokunmaya gerek yok)
├─ templates/layout.js   ← ortak iskelet: <head>, SEO, üst menü, alt menü
├─ templates/pages.js    ← ana sayfa, projeler, proje detayı, hakkımda, blog, yazı, 404
├─ templates/cv.js       ← CV şablonu (yalnızca PDF üretimi için, yayınlanmaz)
├─ templates/cv.css
├─ templates/icons.js
└─ lib/                  ← adresler, Markdown dönüştürücü, blog yükleyici, yardımcılar

assets/                  ← olduğu gibi yayınlanır
├─ css/style.css         ← tüm site stilleri (tema değişkenleri en üstte)
├─ js/main.js            ← tema, proje filtresi, e-posta/telefon birleştirme
├─ cv/                   ← hazır CV PDF'leri (İndir bağlantıları buraya)
└─ img/                  ← fotoğraf, proje ve uygulama ekran görüntüleri, kapaklar

tools/
├─ build-site.js         ← siteyi üretir (Vercel de bunu çalıştırır)
├─ serve.js              ← yerel önizleme sunucusu
├─ check-site.js         ← yayın öncesi denetim
├─ test/                 ← Markdown testleri
├─ build-cv-pdf.js       ← CV PDF'lerini üretir
├─ build-og-cover.js     ← sosyal paylaşım kapaklarını üretir
└─ og-cover.html         ← kapağın şablonu

vercel.json              ← Vercel yayın ayarı (derleme komutu, çıktı klasörü, yönlendirmeler)
dist/                    ← ÜRETİLİR, depoya girmez (Vercel her yayında yeniden üretir)
.preview/                ← taslak önizlemesi, ÜRETİLİR, depoya girmez
```

---

## 🧭 Sayfalar ve adresler

| Sayfa | Türkçe | İngilizce |
| --- | --- | --- |
| Ana sayfa (tanıtım, öne çıkan 3 proje, sektör deneyimi, son yazılar, iletişim) | `/` | `/en/` |
| Projelerim (filtreli liste) | `/projeler/` | `/en/projects/` |
| Proje detayı | `/projeler/<slug>/` | `/en/projects/<slug>/` |
| Hakkımda (deneyim, eğitim, yetkinlikler, sertifikalar) | `/hakkimda/` | `/en/about/` |
| Blog | `/blog/` | `/en/blog/` |
| Blog yazısı | `/blog/<dosya-adı>/` | `/en/blog/<dosya-adı>/` |
| RSS | `/blog/rss.xml` | `/en/blog/rss.xml` |

İletişim ayrı bir sayfa değil; ana sayfanın son bölümü (`/#iletisim`, `/en/#contact`).

### Eski adresler

Eski site tek sayfaydı (`/` ve `/en.html`, bölümler `#` ile). Paylaşılmış bağlantılar
kırılmasın diye:

| Eski | Yeni | Nasıl |
| --- | --- | --- |
| `/en.html` | `/en/` | `vercel.json` → kalıcı (308) yönlendirme |
| `/#hakkimda`, `/#uzmanlik` | `/hakkimda/` | ana sayfadaki küçük betik |
| `/#yolculuk` | `/hakkimda/#deneyim` | 〃 |
| `/#egitim`, `/#yetkinlikler`, `/#sertifikalar` | `/hakkimda/#…` | 〃 |
| `/#projeler` | `/projeler/` | 〃 |
| `/#uygulamalar` | `/projeler/?platform=mobile` | 〃 |
| `/#iletisim` | aynı yerde | — |
| `/en.html#about`, `#journey`, `#apps` … | `/en/about/`, `/en/about/#experience`, `/en/projects/?platform=mobile` … | yönlendirme + betik |

`#` kısmı sunucuya gitmediği için bölüm eşlemesi `vercel.json`'da değil, ana sayfada
bir satırlık betikle yapılır (liste: `src/lib/routes.js` → `LEGACY_HASHES`).
Bir adresi ileride değiştirirsen eski adres için `vercel.json`'a yönlendirme ekle.

---

## ➕ Yeni proje eklemek

1. Ekran görüntülerini `assets/img/` altına koy (aşağıdaki ölçülere bak).
2. `content/projects.js` içinde bir kaydı kopyalayıp yapıştır ve alanları doldur:

   | Alan | Ne yazılır |
   | --- | --- |
   | `slug` | Adres parçası: küçük harf, rakam, tire; Türkçe karakter yok (`yeni-urun`) |
   | `name` | Ürün adı |
   | `featured` | `true` ise ana sayfada gösterilir (en fazla 3 proje) |
   | `platforms` | Filtre: `["web"]`, `["mobile"]` ya da `["web", "mobile"]` |
   | `platformLabel` | Kartta görünen platform adı, ör. `Web ve Android` |
   | `tags` | Alan etiketleri (sektör/konu), **en fazla 3**. Platform buraya yazılmaz |
   | `summary` | Kart metni: kimin hangi sorununu çözdüğü, tek cümle |
   | `links` | `{ type: "web", url, label }` ve/veya `{ type: "play", url }` |
   | `icon` | (isteğe bağlı) uygulama simgesi, 192×192 PNG |
   | `cover` | Kart görseli; `kind: "wide"` (16:9) ya da `"phone"` (dikey ekran) |
   | `gallery` | Detay sayfasındaki gerçek ekran görüntüleri (alt metin + kısa açıklama) |
   | `purpose`, `problem`, `role`, `features` | Detay sayfası bölümleri |
   | `techSummary`, `tech` | Teknik tercihler. Gerekçesi bilinen teknolojiye `note` yaz; bilinmeyene yazma (etiket olarak görünür) |
   | `related` | İlgili projelerin `slug`'ları |

   Her metin `{ tr: "...", en: "..." }` biçimindedir. Olmayan bölüm (ör. `problem`)
   silinirse o bölüm sayfada hiç görünmez.
3. `node tools/serve.js` ile kontrol et, `node tools/check-site.js` çalıştır.
4. CV'yi güncelle: `node tools/build-cv-pdf.js` (proje listesi CV'ye de girer).

Üretici eksik alanı, 3'ten fazla etiketi, bulunamayan görseli ya da kayıttaki ölçüyle
dosyanın gerçek ölçüsünün tutmamasını hata olarak bildirir.

> **İçerik kuralı:** kullanıcı sayısı, indirme, gelir, performans kazanımı ya da müşteri
> yorumu yazılmaz; doğrulanmamış ürünler "yayında / aktif" diye etiketlenmez.
> Geliştirme ayrıntıları (ör. veritabanı göçü sayısı) başarı göstergesi gibi sunulmaz.

### Görsel ölçüleri

| Tür | Ölçü | Nerede |
| --- | --- | --- |
| Geniş ekran görüntüsü (web) | 800×450 WebP (16:9) | `assets/img/projects/` |
| Telefon ekranı | 540×1110 WebP | `assets/img/apps/` |
| Uygulama simgesi | 192×192 PNG | `assets/img/apps/icon-*.png` |

Upwork/mağaza görsellerinden yalnızca ürün ekranını almak için kullanılan komutlar:

```bash
# Geniş görselin orta bandını al
ffmpeg -i kaynak.png -vf "crop=1440:810:80:170,scale=800:450" \
       -c:v libwebp -quality 82 assets/img/projects/ad.webp

# Çerçeveli mağaza görselinden bezel içindeki ekranı kırp (koordinatlar görsele göre değişir)
ffmpeg -i kaynak.png -vf "crop=606:1380:232:385" ekran.png
ffmpeg -i ekran.png -vf "scale=540:-2" -c:v libwebp -quality 84 assets/img/apps/ad.webp
```

Kaynak ekran telefon oranından darsa kenarları ekranın kendi zemin rengiyle tamamla
(kırpma alt menüyü keser). Sahte ürün ekranı üretme; yalnızca gerçek ekran görüntüsü.

---

## ✍️ Blog

### Yeni yazı

`content/blog/tr/` altına bir `.md` dosyası oluştur. **Dosya adı adrestir:**
`neden-supabase.md` → `/blog/neden-supabase/`. Küçük harf, rakam ve tire kullan.

````markdown
---
title: Yazının başlığı
description: Listede ve arama sonuçlarında görünen bir iki cümlelik özet.
status: draft
date:
category: Ürün geliştirme
related: [tmgd-asistani]
---

Giriş paragrafı.

## Ara başlık

Metin, **kalın**, *italik*, `kod` ve [bağlantı](https://ornek.com).
Proje sayfasına bağlantı: [TMGD Asistanı](proje:tmgd-asistani)

![Görselin açıklaması](/assets/img/blog/ornek.webp "Görsel altı yazısı")

```js
const ornek = true;
```

<!-- ONAY: Yayından önce benim doğrulamam gereken bir bilgi. -->
````

| Alan | Zorunlu | Açıklama |
| --- | --- | --- |
| `title`, `description`, `category` | evet | |
| `status` | evet | `draft` (taslak) ya da `published` (yayımlanmış) |
| `date` | yayımlarken | Yayın tarihi, `YYYY-AA-GG` |
| `updated` | hayır | Güncelleme tarihi; yazıda ve site haritasında görünür |
| `related` | hayır | İlgili projelerin slug'ları; yazının sonunda proje kartı çıkar |
| `translation` | hayır | Diğer dildeki karşılığın dosya adı (iki yönlü yazılmalı) |

- Başlıklar `##` ve `###` ile yazılır (`#` kullanılmaz; sayfa başlığı `title`'dan gelir).
- 3 veya daha fazla `##` başlığı olan yazıda **içindekiler** kendiliğinden eklenir.
- Okuma süresi kendiliğinden hesaplanır.
- Yazı görsellerini `assets/img/blog/` altına koy; ölçüsü otomatik okunur.

### Taslak → yayın

Taslaklar (`status: draft`) canlı sitede **hiçbir yerde** görünmez: sayfaları
üretilmez, blog listesinde, ana sayfada, site haritasında ve RSS'te yer almaz.

1. Taslağı incele: `node tools/serve.js --drafts` → `http://localhost:4173/blog/`
   sayfasının altında **Taslaklar** bölümü. Taslak sayfalarında sarı bir şerit ve
   `<!-- ONAY: ... -->` notları görünür.
2. Onay notlarındaki soruları yanıtla, metni düzelt, **notları sil.**
3. `status: published` yap ve `date:` satırını doldur (ör. `date: 2026-10-01`).
4. `node tools/check-site.js` → `git add -A && git commit -m "Yeni yazı" && git push`

> Yayımlanmış bir yazıda `ONAY` notu kalırsa site **derlenmez** ve hangi dosyada kaç
> not kaldığını söyler. Böylece onaylanmamış bir bilgi yanlışlıkla yayına çıkmaz.

> ⚠️ Taslak `.md` dosyaları depoya girer. Depo herkese açıksa taslaklar GitHub'da
> okunabilir (sitede görünmezler). Tamamen gizli tutmak istediğin notları `.gitignore`
> kapsamındaki `taslak/` klasöründe tut.

### İngilizce yazı / çeviri

Yazıyı `content/blog/en/` altına koy. Bir Türkçe yazının çevirisiyse iki dosyaya da
karşılıklı `translation:` yaz. Çevirisi olmayan yazılarda dil düğmesi diğer dilin blog
listesine gider ve bunu açıklar; bozuk ya da yanıltıcı bir dil bağlantısı üretilmez.
Blogda hiç yayımlanmış yazı yoksa sade bir boş durum mesajı görünür; ana sayfada
"Son yazılar" bölümü ancak yayımlanmış yazı olunca çıkar.

---

## 📄 CV çıktısı

Üst menüdeki **CV İndir** ve sayfalardaki **CV'mi indir** bağlantıları hazır PDF'i indirir:

| Dil | Dosya |
| --- | --- |
| Türkçe | `assets/cv/Suphi-Atilim-Celikoz-CV.pdf` |
| İngilizce | `assets/cv/Suphi-Atilim-Celikoz-CV-EN.pdf` |

CV artık ana sayfanın yazdırma stilinden değil, **kendi A4 şablonundan**
(`src/templates/cv.js` + `cv.css`) üretiliyor. Veriyi siteyle aynı dosyalardan alır:
ana sayfa kısalsa da CV'de özet, deneyim, 8 projenin tamamı, eğitim, sertifikalar ve
yetkinlikler yer alır (2 sayfa).

```bash
node tools/build-cv-pdf.js --check   # eskimiş mi? (çıkış kodu 1 = eskimiş)
node tools/build-cv-pdf.js           # yeniden üret
```

`content/profile.js` ya da `content/projects.js` değişince PDF'ler eskir. Betik Chrome'u
arka planda açar ve dosyayı **yazmadan önce** doğrular: geçerli PDF mi, 1–3 sayfa mı,
portre yüklendi mi, bütün proje/deneyim/eğitim/sertifika başlıkları CV'de var mı,
e-posta yazıldı mı. Biri tutmazsa dosya yazılmaz. İçerik değişmemişse dosyaya dokunmaz.

> ⚠️ İnternet gerekir: Google Fonts inmezse PDF sistem yazı tipiyle üretilir ve betik
> uyarı basar. Kurumsal ağda `HTTPS_PROXY` tanımlıysa Chrome'a iletilir.

> **Dosya adını değiştirme.** Vercel her statik dosyada `Content-Disposition: inline;
> filename="..."` gönderiyor ve tarayıcı bunu `download="..."` özniteliğine tercih
> ediyor: indirilen dosyanın adını yalnızca diskteki ad belirler. Adı değiştirirsen
> `content/profile.js` → `cv` alanını da güncelle.

---

## 🖼️ Sosyal paylaşım görseli

LinkedIn, WhatsApp, Slack vb. paylaşımlarda görünen 1200×630 kapak:
Türkçe sayfalarda `assets/img/og-cover.jpg`, İngilizce sayfalarda `og-cover-en.jpg`.
Tasarım `tools/og-cover.html` içinde (`?lang=en` ile İngilizce metne geçer).

```bash
node tools/build-og-cover.js --check
node tools/build-og-cover.js
```

Kapak metni ana sayfadaki tanıtımla, üzerindeki üç ürün adı ana sayfada öne çıkan
projelerle uyumlu olmalı; birini değiştirirsen ötekini de güncelle.

---

## 🙂 Fotoğraf

`assets/img/suphifoto.png` **215×265 px**. Bu yüzden büyütülmeden gösteriliyor:
masaüstünde 220 px genişlik (ana sayfa), Hakkımda'da 215 px; mobilde ad yanında küçük
yuvarlak avatar. Mobilde tanıtım ve "Projelerimi incele / İletişime geç" ilk ekranda kalır.

Yüksek çözünürlüklü orijinali bulursan (en az 430×530, oran 0,81) aynı adla üzerine
yaz ve `content/profile.js` → `photo.width / height` değerlerini güncelle; ardından
`assets/css/style.css` içinde `.intro__photo img` (220px) ve `.about-head__photo img`
(215px) genişliklerini büyütebilirsin. CV ve kapağı da yeniden üret.

---

## 🏅 Sertifikalar

Sertifika belgelerinin görselleri sitede yok; bu yüzden "Görüntüle" düğmesi
gösterilmiyor ve Hakkımda sayfasında "Belge kopyaları talep üzerine paylaşılır"
yazıyor. Sertifika listesi `content/profile.js` → `certificates` alanında.

---

## 🚀 Yayın (Vercel)

| | Adres |
| --- | --- |
| **Canlı site** | **https://suphicelikoz.com** |
| Kaynak kod | https://github.com/suphiati/suphicelikoz |
| Vercel projesi | https://vercel.com/suphis-projects-f81baff7/suphicelikoz |

Vercel `main` dalını izler. Her push'ta `vercel.json` gereği:

```json
{
  "buildCommand": "node tools/build-site.js",
  "outputDirectory": "dist",
  "trailingSlash": true,
  "redirects": [{ "source": "/en.html", "destination": "/en/", "permanent": true }]
}
```

- **Derleme:** Vercel `node tools/build-site.js` çalıştırır ve yalnızca `dist/`
  klasörünü yayınlar. Paket kurulumu yoktur (`package.json` yok).
- **`trailingSlash`:** `/projeler` → `/projeler/` (canonical adreslerle aynı). Uzantılı
  dosyalar (`/assets/...`, `/sitemap.xml`) etkilenmez.
- `tools/`, `content/`, `src/` artık yayınlanmıyor (eski düzende `tools/` herkese açıktı).
- Başka bir dala push edersen Vercel canlı siteye dokunmayan bir **önizleme (preview)**
  adresi oluşturur; yeni yapıyı yayına almadan önce orada denemek için en güvenli yol.

### Bu değişiklikle Vercel panelinde kontrol edilecekler

`vercel.json` panel ayarlarını ezdiği için normalde hiçbir şey değiştirmek gerekmez.
Yine de ilk yayından önce **Settings → Build and Deployment** bölümüne bak:

1. **Framework Preset:** `Other` kalabilir.
2. **Build Command / Output Directory:** panelde elle bir değer girilmişse ve
   "Override" açıksa `vercel.json` ile aynı olsun ya da override'ı kapat.
3. **Node.js Version:** 18 veya üstü (varsayılan zaten öyle).

### Kurulum böyle yapıldı (bir daha gerekirse)

**Vercel**
- Proje `suphiati/suphicelikoz` deposundan **Import** edildi (Clone değil — Clone yeni bir depo oluşturur).
- Application Preset: **Other**. Root Directory: `./`. Environment Variables: yok.

**Alan adları** (Vercel → Settings → Domains)

| Alan adı | Davranış |
| --- | --- |
| `suphicelikoz.com` | Production — sitenin kendisi |
| `www.suphicelikoz.com` | **308** kalıcı yönlendirme → `suphicelikoz.com` |
| `suphicelikoz.vercel.app` | Vercel'in verdiği yedek adres |

> Apex'i (www'suz) ana adres seçtim çünkü sayfalardaki `canonical` etiketleri
> `https://suphicelikoz.com/` diyor. Vercel'in "Redirect apex domains to www"
> önerisini bilerek **kapattım**; açık kalsaydı canonical ile yönlendirme çelişirdi.

**DNS** (Cloudflare — `suphicelikoz.com` zone'u)

| Tip | Ad | Hedef | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` | `c6640786ac790380.vercel-dns-017.com` | **DNS only** |
| CNAME | `www` | `c6640786ac790380.vercel-dns-017.com` | **DNS only** |

> ⚠️ **Proxy'yi (turuncu bulut) açma.** Vercel kendi CDN'ini ve SSL sertifikasını
> kullanıyor; Cloudflare proxy'si açık olursa sertifika üretimi ve yönlendirmeler bozulabilir.

**Alan adı değişirse:** `src/lib/routes.js` → `SITE_URL` tek yer (canonical, hreflang,
site haritası, RSS, robots.txt, yapılandırılmış veri buradan üretilir). Kapak
şablonundaki `suphicelikoz.com` yazısını ve `tools/og-cover.html`'i de güncelle.

### Doğrulama

```bash
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" https://suphicelikoz.com/
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.suphicelikoz.com/
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" https://suphicelikoz.com/en.html
```

Beklenen: apex `200`, www `308 https://suphicelikoz.com/`, en.html `308 …/en/`.

---

## ✅ Yayından önce kontrol

```bash
node tools/check-site.js
node --test tools/test/markdown.test.js
node tools/build-cv-pdf.js --check
node tools/build-og-cover.js --check
```

`check-site.js` siteyi geçici klasörlere üretir ve şunlara bakar: her sayfada tek `h1` ve
atlanmayan başlık sırası, başlık/açıklama/canonical, görsellerde alt metin ve ölçü, kırık
iç bağlantı ve bölüm hedefi, karşılıklı `hreflang`, geçerli JSON-LD, site haritasının
dizine eklenebilir sayfalarla birebir tutması, eski adreslerin hedefleri, **taslak
sızıntısı** (taslağın adresi, başlığı ya da onay notu yayın çıktısında olmamalı) ve
geçici bir deneme yazısıyla yayımlama akışı (liste, ana sayfa, RSS, site haritası,
çeviri bağlantısı, içindekiler, kod bloğu).

---

## 🎨 Tasarım

- Renkler `assets/css/style.css` başındaki `:root` (koyu) ve `html[data-theme="light"]`
  (açık) bloklarında. Kimlik: elektrik mavisi `#2e7dff` → turkuaz `#22d3ee`.
  Düğme zemini beyaz yazıyla yeterli kontrast için daha koyu mavi (`#1d5fe0`).
- Dekoratif arka plan parlaması, ızgara, kayan rozet ve sayaç animasyonu yok.
  Yumuşak kaydırma da yok; geçişler yalnızca renk değişimi ve azaltılmış hareket
  tercihinde tamamen kapanıyor.
- Yazı tipleri: başlıklarda Space Grotesk, metinde Inter (Google Fonts); kod
  bloklarında sistem yazı tipi.

## 🔧 Teknik notlar

- **Tema:** açık/koyu düğmesi; seçim `localStorage`'a (`sac-theme`) kaydedilir, ilk
  açılışta işletim sistemi tercihine uyar. JavaScript kapalıyken de sistem tercihi uygulanır.
- **Erişilebilirlik:** klavyeyle tam gezinme, "İçeriğe geç" bağlantısı, görünür odak
  halkası, `aria-current` ile etkin menü, filtrelerde `aria-pressed` ve durum bildirimi,
  yeni sekmede açılan bağlantılar için ekran okuyucu notu, `prefers-reduced-motion`.
- **JavaScript kapalıyken** bütün içerik okunur; yalnızca filtre düğmeleri gizlenir ve
  e-posta/telefon açık yazılmaz.
- **Spam koruması:** e-posta ve telefon HTML'de düz metin değil, JavaScript ile
  birleştirilir. Aynı sebeple yapılandırılmış veride (JSON-LD) de yer almazlar.
- **SEO:** her sayfada başlık, açıklama, canonical, dil alternatifleri (yalnızca gerçek
  karşılığı olan sayfalarda), Open Graph; `sitemap.xml`, `robots.txt`, RSS. Yapılandırılmış
  veri yalnızca sayfada görünen bilgiyi taşır: ana sayfada `Person`/`WebSite`, Hakkımda'da
  `ProfilePage`, proje ve yazılarda `BreadcrumbList`, yazılarda `BlogPosting`.
- **Taslak önizlemesi** (`.preview/`) `robots.txt` ile dizinlemeyi tamamen kapatır ve
  taslak sayfaları `noindex` taşır; yanlışlıkla yayınlansa bile arama motoruna girmez.
- **Tarayıcı desteği:** Chrome, Edge, Firefox, Safari güncel sürümler.
