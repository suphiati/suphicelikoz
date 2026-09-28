/* =============================================================================
   Projeler: her ürünün TEK kaydı. Proje kartları, proje detay sayfaları,
   ana sayfadaki öne çıkanlar, site haritası ve CV bu listeden üretilir.

   Yeni proje eklemek için bir kaydı kopyala, alanları doldur ve
   "node tools/build-site.js" çalıştır (ayrıntı: README → Yeni proje).

   Alanlar
   -------
   slug          Adres: /projeler/<slug>/ ve /en/projects/<slug>/
   featured      true ise ana sayfada gösterilir (en fazla 3)
   platforms     Filtre: "web" (Web ve SaaS) ve/veya "mobile" (Mobil Uygulamalar)
   platformLabel Kartta ve detayda görünen platform adı
   tags          Alan etiketleri (sektör/konu). Kartta en fazla 3 gösterilir.
   summary       Kart metni: kimin hangi sorununu çözdüğü, tek cümle
   links         Dış bağlantılar. type: "web" | "play"
   cover         Kart görseli. kind: "wide" (16:9) | "phone" (dikey ekran)
   gallery       Detay sayfasındaki gerçek ekran görüntüleri
   purpose, problem, role, features, tech, techSummary
                 Detay sayfası bölümleri; olmayan bölüm gösterilmez.
   related       İlgili projelerin slug'ları

   Kurallar: yalnızca doğrulanabilir bilgi. Kullanıcı sayısı, indirme, gelir,
   başarı ölçüsü yazılmaz; "yayında / aktif" gibi durum etiketi konmaz.
   ========================================================================== */
"use strict";

const PLAY = "https://play.google.com/store/apps/details?id=";

module.exports = [
  /* ---------------------------------------------------------------------- */
  {
    slug: "tmgd-asistani",
    name: "TMGD Asistanı",
    featured: true,
    platforms: ["web"],
    platformLabel: { tr: "Web platformu · SaaS", en: "Web platform · SaaS" },
    tags: { tr: ["Tehlikeli madde", "Danışmanlık", "SaaS"], en: ["Dangerous goods", "Advisory", "SaaS"] },
    summary: {
      tr: "TMGD'lerin ve TMGD kuruluşlarının Excel ve kâğıtla yürüttüğü firma, ziyaret ve belge takibini hatırlatmalarla birlikte tek panelde toplar.",
      en: "Brings the company, visit and document tracking that dangerous goods advisers and advisory firms run on spreadsheets and paper into one panel, with reminders."
    },
    links: [{ type: "web", url: "https://tmgdasistani.app", label: "tmgdasistani.app" }],
    cover: {
      src: "/assets/img/projects/tmgdasistani.webp", width: 800, height: 450, kind: "wide",
      alt: {
        tr: "TMGD Asistanı yönetim paneli: firma listesi, ziyaret takvimi ve dosya sayaçları",
        en: "TMGD Asistanı dashboard: company list, visit calendar and document counters"
      }
    },
    gallery: [
      {
        src: "/assets/img/projects/tmgdasistani.webp", width: 800, height: 450,
        alt: {
          tr: "TMGD Asistanı yönetim paneli: firma listesi, ziyaret takvimi ve dosya sayaçları",
          en: "TMGD Asistanı dashboard: company list, visit calendar and document counters"
        },
        caption: { tr: "Yönetim paneli", en: "Dashboard" }
      }
    ],
    purpose: {
      tr: "Tehlikeli madde güvenlik danışmanları (TMGD) ve danışmanlık hizmeti veren TMGD kuruluşları için bir yönetim platformu. Danışmanın takip etmesi gereken firmaları, ziyaretleri, belgeleri ve mevzuat hatırlatmalarını tek yerde toplar.",
      en: "A management platform for dangerous goods safety advisers and the advisory firms that employ them. It brings the companies, visits, documents and regulatory reminders an adviser has to track into one place."
    },
    problem: {
      tr: "Danışmanlık süreçleri çoğunlukla Excel tabloları ve kâğıt üzerinde yürüyor. Firma atamaları, ziyaret takvimi ve belge takibi farklı yerlerde duruyor; mevzuat hatırlatmaları elle yapılıyor.",
      en: "Advisory work mostly runs on spreadsheets and paper. Company assignments, visit schedules and document tracking live in different places, and regulatory reminders are sent by hand."
    },
    role: {
      tr: "Fikir, tasarım, geliştirme, test ve yayın aşamalarını tek başıma yürüttüm. Ürünün çıkış noktası, danışmanlık işinde karşılaştığım sorunlar oldu.",
      en: "I handled the idea, design, development, testing and release on my own. The starting point was the problems I ran into in advisory work."
    },
    features: {
      tr: [
        "TMGD ve TMGD kuruluşu için ayrı yetkilerle çalışan rol bazlı hesaplar",
        "Onaylı firma–danışman atama akışı",
        "Ziyaret, denetim ve eğitim takvimi",
        "Belge yönetimi ve arşivi",
        "Zamanlanmış görevlerle otomatik hatırlatma e-postaları",
        "PDF rapor üretimi",
        "Abonelik yönetimi"
      ],
      en: [
        "Role-based accounts with separate permissions for advisers and advisory firms",
        "Approval-based company–adviser assignment flow",
        "Visit, audit and training calendar",
        "Document management and archive",
        "Automated reminder emails via scheduled jobs",
        "PDF report generation",
        "Subscription management"
      ]
    },
    tech: [
      { name: "Next.js 14" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Supabase", note: {
        tr: "Veritabanı, kimlik doğrulama ve belge arşivi (Storage). Veri erişimi satır seviyesinde güvenlik (RLS) kurallarıyla sınırlandırılıyor.",
        en: "Database, authentication and document archive (Storage). Data access is restricted with row-level security (RLS) policies."
      } },
      { name: "Resend", note: { tr: "E-posta gönderimi", en: "Email delivery" } },
      { name: "Capacitor", note: { tr: "Android ve iOS için uygulama paketi", en: "App packaging for Android and iOS" } },
      { name: "Leaflet" },
      { name: "Playwright", note: { tr: "Uçtan uca testler", en: "End-to-end tests" } }
    ],
    related: ["safecargo", "kurye-ve-nakliyat"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "safecargo",
    name: "SafeCargo",
    featured: true,
    platforms: ["web"],
    platformLabel: { tr: "Web platformu", en: "Web platform" },
    tags: { tr: ["Tehlikeli madde", "Mevzuat", "Lojistik"], en: ["Dangerous goods", "Regulation", "Logistics"] },
    summary: {
      tr: "Karayolu, demiryolu, denizyolu ve havayolu tehlikeli madde mevzuatını (ADR, RID, IMDG, IATA DGR) Türkçe ve tek yerde arama imkânı sunar.",
      en: "Lets you search dangerous goods regulations for road, rail, sea and air (ADR, RID, IMDG, IATA DGR) in Turkish, in one place."
    },
    links: [{ type: "web", url: "https://safecargo.io", label: "safecargo.io" }],
    cover: {
      src: "/assets/img/projects/safecargo.webp", width: 800, height: 450, kind: "wide",
      alt: { tr: "SafeCargo ana sayfası", en: "SafeCargo home page" }
    },
    gallery: [
      {
        src: "/assets/img/projects/safecargo.webp", width: 800, height: 450,
        alt: { tr: "SafeCargo ana sayfası", en: "SafeCargo home page" },
        caption: { tr: "Ana sayfa", en: "Home page" }
      }
    ],
    purpose: {
      tr: "Tehlikeli madde mevzuatına Türkçe ve hızlı erişmek isteyen danışmanlar ve taşımacılık ekipleri için bir mevzuat platformu. Dört taşıma modunun kurallarını tek çatı altında toplar.",
      en: "A regulatory platform for advisers and transport teams who need quick access to dangerous goods rules in Turkish. It brings the rules of four transport modes under one roof."
    },
    problem: {
      tr: "Karayolu (ADR), demiryolu (RID), denizyolu (IMDG) ve havayolu (IATA DGR) için dört ayrı mevzuat ve dört ayrı kaynak var; bunların neredeyse tamamı İngilizce. Tek bir UN numarasını dört taşıma modunda kontrol etmek uzun sürüyor.",
      en: "Road (ADR), rail (RID), sea (IMDG) and air (IATA DGR) each have their own regulation and source, nearly all of them in English. Checking a single UN number across all four modes takes a long time."
    },
    role: {
      tr: "Fikir, tasarım, geliştirme, test ve yayın aşamalarını tek başıma yürüttüm.",
      en: "I handled the idea, design, development, testing and release on my own."
    },
    features: {
      tr: [
        "Dört mevzuatta aynı anda arama",
        "ADR Tablo A ve IATA DG List sorgulama",
        "Ayrıştırma (segregasyon) matrisi",
        "Lityum pil karar ağacı",
        "1000 puan hesaplayıcı",
        "Tünel kategorileri",
        "Kontrol listeleri"
      ],
      en: [
        "Simultaneous search across all four regulations",
        "ADR Table A and IATA DG List lookup",
        "Segregation matrix",
        "Lithium battery decision tree",
        "1000-point calculator",
        "Tunnel categories",
        "Checklists"
      ]
    },
    tech: [
      { name: "Next.js 14" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Fuse.js", note: { tr: "Yaklaşık eşleşmeli arama", en: "Fuzzy search" } },
      { name: "Playwright ve Vitest", nameEn: "Playwright and Vitest", note: { tr: "Uçtan uca ve birim testler", en: "End-to-end and unit tests" } },
      { name: "SEO / JSON-LD", note: { tr: "Arama motorları için yapılandırılmış veri", en: "Structured data for search engines" } },
      { name: "CSP / HSTS", note: { tr: "Güvenlik başlıkları", en: "Security headers" } }
    ],
    related: ["tmgd-asistani", "kurye-ve-nakliyat"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "kurye-ve-nakliyat",
    name: "Kurye ve Nakliyat",
    featured: false,
    platforms: ["web", "mobile"],
    platformLabel: { tr: "Web ve Android", en: "Web and Android" },
    tags: { tr: ["Lojistik", "Taşımacılık", "Pazar yeri"], en: ["Logistics", "Transport", "Marketplace"] },
    summary: {
      tr: "Nakliye, kurye ve yük talebi olanlarla taşıyıcıları buluşturan pazar yeri; talep oluşturma, teklif toplama ve karşılaştırma web sitesinde ve Android uygulamasında.",
      en: "A marketplace that connects people with freight, courier and load requests to carriers; request creation, offer collection and comparison on the web and on Android."
    },
    links: [
      { type: "web", url: "https://kuryevenakliyat.com", label: "kuryevenakliyat.com" },
      { type: "play", url: PLAY + "com.safecargo.kuryevenakliyat" }
    ],
    icon: "/assets/img/apps/icon-kuryevenakliyat.png",
    cover: {
      src: "/assets/img/projects/kuryevenakliyat.webp", width: 800, height: 450, kind: "wide",
      alt: {
        tr: "Kurye ve Nakliyat web sitesi: nakliye ve kurye talebi oluşturma ekranı",
        en: "Kurye ve Nakliyat website: creating a freight or courier request"
      }
    },
    gallery: [
      {
        src: "/assets/img/projects/kuryevenakliyat.webp", width: 800, height: 450,
        alt: {
          tr: "Kurye ve Nakliyat web sitesi: nakliye ve kurye talebi oluşturma ekranı",
          en: "Kurye ve Nakliyat website: creating a freight or courier request"
        },
        caption: { tr: "Web sitesi", en: "Website" }
      },
      {
        src: "/assets/img/apps/kuryevenakliyat.webp", width: 540, height: 1110, kind: "phone",
        alt: {
          tr: "Kurye ve Nakliyat Android uygulamasının ana ekranı: yeni nakliye, kurye ve yük talebi",
          en: "Kurye ve Nakliyat Android home screen: new freight, courier and load request"
        },
        caption: { tr: "Android uygulaması", en: "Android app" }
      }
    ],
    purpose: {
      tr: "Taşıma talebi olan kişi ve işletmelerle taşıyıcıları bir araya getiren bir pazar yeri. Talep sahibi ihtiyacını yazar, taşıyıcılardan teklif toplar ve karşılaştırır.",
      en: "A marketplace that brings people and businesses with transport needs together with carriers. The requester describes the job, collects offers from carriers and compares them."
    },
    problem: {
      tr: "Küçük ölçekli taşıma ve kurye talepleri çoğunlukla telefon ve mesajlaşma üzerinden, kayıt tutulmadan ve fiyat karşılaştırması yapılamadan yürüyor.",
      en: "Small-scale courier and freight requests still mostly run over phone calls and messaging, with no record and no way to compare prices."
    },
    role: {
      tr: "Fikir, tasarım, geliştirme, test ve yayın aşamalarını tek başıma yürüttüm. Web sitesini ve Android uygulamasını aynı altyapı üzerinde birlikte geliştirdim.",
      en: "I handled the idea, design, development, testing and release on my own, building the website and the Android app together on the same backend."
    },
    features: {
      tr: [
        "Nakliye, kurye ve yük talebi oluşturma",
        "Taşıyıcılardan teklif toplama ve karşılaştırma",
        "Harita üzerinden takip",
        "Şehir ve hizmet bazlı açılış sayfaları",
        "Çok dilli arayüz"
      ],
      en: [
        "Creating freight, courier and load requests",
        "Collecting and comparing offers from carriers",
        "Map-based tracking",
        "City and service landing pages",
        "Multilingual interface"
      ]
    },
    tech: [
      { name: "Next.js 16", note: { tr: "Web sitesi", en: "Website" } },
      { name: "Expo (React Native)", note: { tr: "Android uygulaması", en: "Android app" } },
      { name: "Supabase", note: { tr: "Web ve mobil uygulamanın paylaştığı ortak veritabanı şeması", en: "One database schema shared by the website and the mobile app" } },
      { name: "Sentry", note: { tr: "Hata izleme", en: "Error tracking" } },
      { name: "next-intl", note: { tr: "Çok dilli arayüz", en: "Multilingual interface" } },
      { name: "Playwright", note: { tr: "Uçtan uca testler", en: "End-to-end tests" } }
    ],
    related: ["safecargo", "tmgd-asistani"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "hafiza-tutucum",
    name: "Hafıza Tutucum",
    featured: true,
    platforms: ["mobile"],
    platformLabel: { tr: "Android uygulaması", en: "Android app" },
    tags: { tr: ["Üretkenlik", "Cihaz üzerinde yapay zekâ", "Gizlilik"], en: ["Productivity", "On-device AI", "Privacy"] },
    summary: {
      tr: "Notlarını ve hatırlatmalarını buluta göndermek istemeyenler için; yapay zekâ özellikleri internet olmadan, tamamen telefonda çalışır.",
      en: "For people who don't want their notes and reminders in the cloud: the AI features run entirely on the phone, without an internet connection."
    },
    links: [{ type: "play", url: PLAY + "com.hafizatutucum.app" }],
    icon: "/assets/img/apps/icon-hafizatutucum.png",
    cover: {
      src: "/assets/img/projects/hafizatutucum.webp", width: 800, height: 450, kind: "wide",
      alt: {
        tr: "Hafıza Tutucum'dan üç ekran: notlar, cihaz üzerinde yanıtlanan sorular ve gizlilik ayarları",
        en: "Three screens from Hafıza Tutucum: notes, questions answered on-device and privacy settings"
      }
    },
    gallery: [
      {
        src: "/assets/img/projects/hafizatutucum.webp", width: 800, height: 450,
        alt: {
          tr: "Hafıza Tutucum'dan üç ekran: notlar, cihaz üzerinde yanıtlanan sorular ve gizlilik ayarları",
          en: "Three screens from Hafıza Tutucum: notes, questions answered on-device and privacy settings"
        },
        caption: { tr: "Mağaza görselleri: notlar, cihaz üzerinde yanıt ve gizlilik", en: "Store images: notes, on-device answers and privacy" }
      },
      {
        src: "/assets/img/apps/hafizatutucum.webp", width: 540, height: 1110, kind: "phone",
        alt: { tr: "Hafıza Tutucum notlar ekranı", en: "Hafıza Tutucum notes screen" },
        caption: { tr: "Notlar ekranı", en: "Notes screen" }
      }
    ],
    purpose: {
      tr: "Not almak, notlarına soru sormak ve hatırlatma kurmak isteyen, ama verisinin telefondan çıkmasını istemeyen kullanıcılar için bir not ve hatırlatma asistanı. Sunucu, hesap ve bulut yok.",
      en: "A note and reminder assistant for people who want to take notes, ask questions about them and set reminders without their data leaving the phone. No server, no account, no cloud."
    },
    problem: {
      tr: "Akıllı not uygulamalarının çoğu veriyi buluta taşıyor ve yapay zekâ özellikleri için ücretli API'lere bağımlı kalıyor.",
      en: "Most smart note apps push data to the cloud and depend on paid APIs for their AI features."
    },
    role: {
      tr: "Tasarımdan mağaza yayınına kadar tüm süreci tek başıma yürüttüm.",
      en: "I handled everything myself, from design to store release."
    },
    features: {
      tr: [
        "Cihaz üzerinde çalışan dil modeliyle notlara soru sorma",
        "Görseldeki metni çevrimdışı okuma (OCR)",
        "Sesle not alma",
        "Metinden otomatik hatırlatma çıkarma",
        "Tüm özellikler internet olmadan çalışır; veriler telefonda kalır"
      ],
      en: [
        "Ask questions about your notes with an on-device language model",
        "Offline text recognition from images (OCR)",
        "Voice dictation",
        "Automatic reminder extraction from text",
        "Everything works offline; data stays on the phone"
      ]
    },
    techSummary: {
      tr: "Yapay zekâ özellikleri için bulut API'si yerine telefonda çalışan bir model kullanıldı. Böylece veri cihazdan çıkmıyor, uygulama internetsiz çalışıyor ve bir API'ye bağımlılık ya da kullanım ücreti oluşmuyor.",
      en: "The AI features use a model that runs on the phone instead of a cloud API. Data never leaves the device, the app works offline and there is no dependency on, or usage fee for, an external API."
    },
    tech: [
      { name: "React Native + Expo" },
      { name: "llama.rn (llama.cpp / GGUF)", note: { tr: "Dil modelini telefonda, internet olmadan çalıştırır", en: "Runs the language model on the phone, offline" } },
      { name: "ML Kit", note: { tr: "Çevrimdışı metin tanıma (OCR)", en: "Offline text recognition (OCR)" } },
      { name: "Konuşma tanıma", nameEn: "Speech recognition", note: { tr: "Sesle not alma", en: "Voice dictation" } },
      { name: "Zustand" },
      { name: "Jest", note: { tr: "Birim testleri", en: "Unit tests" } }
    ],
    related: ["focuslife", "market-listem", "benim-kasam"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "benim-kasam",
    name: "Benim Kasam",
    featured: false,
    platforms: ["mobile"],
    platformLabel: { tr: "Android uygulaması", en: "Android app" },
    tags: { tr: ["Kişisel finans", "Günlük yaşam"], en: ["Personal finance", "Everyday life"] },
    summary: {
      tr: "Altın ve döviz gibi varlıklarını ve bunlardaki hareketleri tek yerde, şifreli olarak tutmak isteyenler için kişisel kasa uygulaması.",
      en: "A personal vault app for keeping assets such as gold and foreign currency, and their movements, in one encrypted place."
    },
    links: [{ type: "play", url: PLAY + "com.suphiatilim.benimkasam" }],
    icon: "/assets/img/apps/icon-benimkasam.png",
    cover: {
      src: "/assets/img/apps/benimkasam.webp", width: 540, height: 1110, kind: "phone",
      alt: { tr: "Benim Kasam kasa ekranı: toplam kasa değeri ve varlık listesi", en: "Benim Kasam vault screen: total value and list of assets" }
    },
    gallery: [
      {
        src: "/assets/img/apps/benimkasam.webp", width: 540, height: 1110, kind: "phone",
        alt: { tr: "Benim Kasam kasa ekranı: toplam kasa değeri ve varlık listesi", en: "Benim Kasam vault screen: total value and list of assets" },
        caption: { tr: "Kasa ekranı", en: "Vault screen" }
      }
    ],
    purpose: {
      tr: "Kişisel varlıklarını ve bunlardaki hareketleri kaydetmek isteyen kullanıcılar için bir dijital kasa. Günlük hayatta kendi ihtiyacımdan doğan uygulamalardan biri.",
      en: "A digital vault for people who want to record their personal assets and the movements in them. One of the apps that grew out of my own everyday needs."
    },
    role: {
      tr: "Tasarımdan mağaza yayınına kadar tüm süreci tek başıma yürüttüm.",
      en: "I handled everything myself, from design to store release."
    },
    features: {
      tr: [
        "Toplam kasa değeri ve varlık listesi",
        "Hareket kayıtları",
        "Kayıtların şifreli saklanması",
        "QR kod ile cihazlar arası eşleştirme"
      ],
      en: [
        "Total vault value and list of assets",
        "Transaction records",
        "Encrypted storage of records",
        "Pairing between devices with a QR code"
      ]
    },
    tech: [
      { name: "React + Vite" },
      { name: "Capacitor", note: { tr: "Web tabanlı uygulamanın Android paketi", en: "Android packaging of the web-based app" } }
    ],
    related: ["market-listem", "focuslife", "hafiza-tutucum"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "focuslife",
    name: "FocusLife",
    featured: false,
    platforms: ["mobile"],
    platformLabel: { tr: "Android uygulaması", en: "Android app" },
    tags: { tr: ["Üretkenlik", "Günlük yaşam"], en: ["Productivity", "Everyday life"] },
    summary: {
      tr: "Odaklanma süresini Pomodoro yöntemiyle planlamak isteyenler için; eğitim, iş ve spor gibi kategorilere ayrı süreler ve günlük odak istatistikleri sunar.",
      en: "For people who plan their focus time with the Pomodoro method: separate durations for categories such as study, work and sport, plus daily focus statistics."
    },
    links: [{ type: "play", url: PLAY + "com.suphiati.focuslife" }],
    icon: "/assets/img/apps/icon-focuslife.png",
    cover: {
      src: "/assets/img/apps/focuslife.webp", width: 540, height: 1110, kind: "phone",
      alt: { tr: "FocusLife odak sayacı ekranı", en: "FocusLife focus timer screen" }
    },
    gallery: [
      {
        src: "/assets/img/apps/focuslife.webp", width: 540, height: 1110, kind: "phone",
        alt: { tr: "FocusLife odak sayacı ekranı", en: "FocusLife focus timer screen" },
        caption: { tr: "Odak sayacı", en: "Focus timer" }
      }
    ],
    purpose: {
      tr: "Çalışma sürelerini Pomodoro yöntemiyle bölmek ve ne kadar odaklandığını takip etmek isteyenler için bir zamanlayıcı. Günlük hayatta kendi ihtiyacımdan doğan uygulamalardan biri.",
      en: "A timer for people who split their work into Pomodoro sessions and want to see how much they focused. One of the apps that grew out of my own everyday needs."
    },
    role: {
      tr: "Tasarımdan mağaza yayınına kadar tüm süreci tek başıma yürüttüm.",
      en: "I handled everything myself, from design to store release."
    },
    features: {
      tr: [
        "Eğitim, iş ve spor gibi kategoriler ve kategoriye özel süreler",
        "Odak, kısa mola ve uzun mola",
        "Uygulama arka plandayken de doğru çalışan geri sayım",
        "Günlük odak istatistikleri"
      ],
      en: [
        "Categories such as study, work and sport, each with its own duration",
        "Focus, short break and long break",
        "A countdown that stays accurate while the app is in the background",
        "Daily focus statistics"
      ]
    },
    tech: [{ name: "Expo / React Native" }],
    related: ["hafiza-tutucum", "market-listem", "benim-kasam"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "market-listem",
    name: "Market Listem",
    featured: false,
    platforms: ["mobile"],
    platformLabel: { tr: "Android uygulaması", en: "Android app" },
    tags: { tr: ["Alışveriş", "Günlük yaşam"], en: ["Shopping", "Everyday life"] },
    summary: {
      tr: "Alışveriş listesini başkalarıyla birlikte tutmak isteyenler için; listeler bağlantıyla paylaşılır, birlikte düzenlenir, harcamalar kaydedilip kıyaslanır.",
      en: "For people who keep a shopping list together with others: lists are shared by link and edited together, and spending is recorded and compared."
    },
    links: [{ type: "play", url: PLAY + "com.suphiati.marketlistem" }],
    icon: "/assets/img/apps/icon-marketlistem.png",
    cover: {
      src: "/assets/img/apps/marketlistem.webp", width: 540, height: 1110, kind: "phone",
      alt: { tr: "Market Listem listeler ekranı", en: "Market Listem lists screen" }
    },
    gallery: [
      {
        src: "/assets/img/apps/marketlistem.webp", width: 540, height: 1110, kind: "phone",
        alt: { tr: "Market Listem listeler ekranı", en: "Market Listem lists screen" },
        caption: { tr: "Listelerim ekranı", en: "My lists screen" }
      }
    ],
    purpose: {
      tr: "Alışveriş listesini birlikte tutmak ve harcamalarını takip etmek isteyenler için bir liste uygulaması. Günlük hayatta kendi ihtiyacımdan doğan uygulamalardan biri.",
      en: "A list app for people who share their shopping and want to keep an eye on spending. One of the apps that grew out of my own everyday needs."
    },
    role: {
      tr: "Tasarımdan mağaza yayınına kadar tüm süreci tek başıma yürüttüm.",
      en: "I handled everything myself, from design to store release."
    },
    features: {
      tr: [
        "Listeyi bağlantıyla paylaşma",
        "Gerçek zamanlı ortak düzenleme",
        "Alışveriş ve tutar kaydı",
        "Harcamaları kıyaslama"
      ],
      en: [
        "Sharing a list by link",
        "Real-time collaborative editing",
        "Recording purchases and amounts",
        "Comparing spending"
      ]
    },
    tech: [{ name: "Expo / React Native" }],
    related: ["benim-kasam", "focuslife", "hafiza-tutucum"]
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "gidiniz-blog",
    name: "Gidiniz Blog",
    featured: false,
    platforms: ["web"],
    platformLabel: { tr: "Web sitesi", en: "Website" },
    tags: { tr: ["Seyahat", "İçerik"], en: ["Travel", "Content"] },
    summary: {
      tr: "Eşimle birlikte gezdiğimiz yerleri, kendi rotasını planlayanlar için rehbere dönüştürdüğümüz seyahat blogu.",
      en: "A travel blog where my spouse and I turn the places we visit into guides for people planning their own routes."
    },
    links: [{ type: "web", url: "https://gidiniz.blog", label: "gidiniz.blog" }],
    cover: {
      src: "/assets/img/projects/gidiniz.webp", width: 800, height: 450, kind: "wide",
      alt: { tr: "Gidiniz Blog ana sayfası: menü ve kapak fotoğrafı", en: "Gidiniz Blog home page: menu and cover photo" }
    },
    gallery: [
      {
        src: "/assets/img/projects/gidiniz.webp", width: 800, height: 450,
        alt: { tr: "Gidiniz Blog ana sayfası: menü ve kapak fotoğrafı", en: "Gidiniz Blog home page: menu and cover photo" },
        caption: { tr: "Ana sayfa", en: "Home page" }
      }
    ],
    purpose: {
      tr: "Ticari bir ürün değil; eşimle birlikte tuttuğumuz bir seyahat günlüğü. Gördüğümüz yerleri, başkalarının da kendi rotasını planlayabileceği bir rehbere dönüştürüyoruz.",
      en: "Not a commercial product but a travel journal my spouse and I keep together, turned into a guide other people can plan their own routes from."
    },
    role: {
      tr: "Siteyi ben kurdum; içerikleri eşimle birlikte yazıyoruz.",
      en: "I built the site; my spouse and I write the content together."
    },
    features: {
      tr: [
        "Şehir ve rota rehberleri",
        "Faydalı seyahat bilgileri",
        "Sosyal sorumluluk bölümü",
        "Instagram ve YouTube kanallarıyla birlikte yürüyen içerik"
      ],
      en: [
        "City and route guides",
        "Practical travel information",
        "A social responsibility section",
        "Content that runs alongside our Instagram and YouTube channels"
      ]
    },
    techSummary: {
      tr: "Framework kullanmadan, arama motoru görünürlüğü gözetilerek kurulmuş statik bir site.",
      en: "A framework-free static site, built with search visibility in mind."
    },
    tech: [{ name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }, { name: "Vercel" }],
    related: []
  }
];
