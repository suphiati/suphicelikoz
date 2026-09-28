/* =============================================================================
   Kişisel bilgiler: iletişim, bağlantılar, hakkımda metni, deneyim, eğitim,
   yetkinlikler ve sertifikalar.

   Bu dosya tek kaynak: Hakkımda sayfası, ana sayfa, CV PDF'leri ve
   yapılandırılmış veri (schema.org) buradan beslenir. Bir bilgiyi değiştirince
   sayfalar ve CV birlikte güncellenir (CV için: node tools/build-cv-pdf.js).

   Çift dilli alanlar { tr: "...", en: "..." } biçimindedir. Tek dilli bir
   değer (ör. teknoloji adı) doğrudan yazılabilir.
   ========================================================================== */
"use strict";

module.exports = {
  name: "Suphi Atılım ÇELİKÖZ",
  initials: "SÇ",

  photo: {
    src: "/assets/img/suphifoto.png",
    /* Dosyanın gerçek ölçüsü. Daha büyük bir sürüm konursa burayı da güncelle;
       CSS gösterim boyutunu bu orana göre sınırlar (bkz. README). */
    width: 215,
    height: 265,
    alt: { tr: "Suphi Atılım ÇELİKÖZ'ün portre fotoğrafı", en: "Portrait of Suphi Atılım ÇELİKÖZ" }
  },

  /* E-posta ve telefon HTML'e düz metin olarak yazılmaz; tarayıcıda
     JavaScript birleştirir (basit botlar toplayamasın diye). */
  contact: {
    emailUser: "suphi.celikoz",
    emailDomain: "gmail.com",
    phone: "905547948590"
  },

  links: [
    { key: "linkedin",   label: "LinkedIn",    url: "https://www.linkedin.com/in/suphi-atilim-celikoz/" },
    { key: "github",     label: "GitHub",      url: "https://github.com/suphiati" },
    { key: "googleplay", label: "Google Play", url: "https://play.google.com/store/apps/developer?id=RiskManage+Studio" },
    { key: "upwork",     label: "Upwork",      url: "https://www.upwork.com/freelancers/~0182462aa45cf30710" }
  ],

  /* Adları değiştirme: Vercel indirilen dosyanın adını diskteki addan alır
     (bkz. README → CV çıktısı). */
  cv: {
    tr: "/assets/cv/Suphi-Atilim-Celikoz-CV.pdf",
    en: "/assets/cv/Suphi-Atilim-Celikoz-CV-EN.pdf"
  },

  /* Ana sayfanın ilk ekranı */
  intro: {
    tr: "Madencilikte ve tehlikeli madde taşımacılığında geçen on yılı aşkın deneyimimi yazılıma taşıyorum. Sahada karşılaştığım sorunlar için web platformları ve mobil uygulamalar geliştiriyorum; fikirden yayına kadar her aşamayı kendim yürütüyorum.",
    en: "I bring more than ten years of experience in mining and dangerous goods transport into software. I build web platforms and mobile apps for problems I ran into in the field, and I handle every step myself, from the idea to the release."
  },

  /* CV'nin başındaki kısa unvan satırı (sitede kullanılmaz) */
  cvHeadline: {
    tr: "Tehlikeli Madde Güvenlik Danışmanı (TMGD) · Yazılım Geliştirici · Maden Mühendisi",
    en: "Dangerous Goods Safety Adviser (DGSA) · Software Developer · Mining Engineer"
  },

  /* Hakkımda sayfası. "quote" alanı olan paragraf alıntı olarak gösterilir. */
  about: {
    tr: [
      { text: "Kariyerime maden mühendisi ve daimi nezaretçi olarak başladım. 2015–2019 arasında madencilik sektöründe saha operasyonlarında çalıştım; teknik süreçleri, iş güvenliğini ve mevzuatın sahadaki karşılığını burada öğrendim." },
      { text: "2019'da tehlikeli madde güvenlik danışmanlığına geçtim. FedEx Express dahil farklı kuruluşlarda havayolu ve karayolu taşımacılığında çalıştım; ADR ve IATA DGR mevzuatını yalnızca okuyarak değil, günlük operasyonun içinde uygulayarak öğrendim." },
      { quote: "Sektörde karşılaştığım problemlerin büyük bölümü aslında bir yazılım problemiydi. Bunu fark ettiğim gün yön değiştirdim." },
      { text: "Operasyonda tekrar eden hataların, kaybolan evrakların ve elle yapılan kontrollerin önemli bir bölümünün yazılımla çözülebileceğini gördüm. Bilgisayar programlama eğitimi aldım, yazılım geliştirme ve test alanında sertifikalar alarak teknik altyapımı kurdum." },
      { text: "2026'da kendi yazılım şirketimi kurdum. Bugün tehlikeli madde, lojistik ve günlük yaşam için ürünler geliştiriyorum. Ürünü yalnızca yazmıyorum; test edip yayına da alıyorum." }
    ],
    en: [
      { text: "I started my career as a mining engineer and permanent site supervisor. Between 2015 and 2019 I worked in field operations in the mining industry, where I learned technical processes, occupational safety and what regulation actually means on the ground." },
      { text: "In 2019 I moved into dangerous goods safety advisory. I worked on air and road transport at several organisations, including FedEx Express, applying ADR and IATA DGR inside daily operations rather than only reading them." },
      { quote: "Most of the problems I ran into in the field were, in fact, software problems. The day I realised that, I changed direction." },
      { text: "Recurring operational mistakes, lost paperwork and manual checks could largely be solved with software. I studied computer programming and earned certifications in software development and testing to build a proper technical foundation." },
      { text: "In 2026 I founded my own software company. Today I build products for dangerous goods, logistics and everyday life. I don't just write the product; I test it and ship it too." }
    ]
  },

  /* CV'deki özet: Hakkımda'nın kısa hâli */
  cvSummary: {
    tr: "2015–2019 arasında madencilik sektöründe maden mühendisi ve daimi nezaretçi, 2019–2026 arasında FedEx Express dahil farklı kuruluşlarda havayolu ve karayolu tehlikeli madde güvenlik danışmanı olarak çalıştım. Operasyonda karşılaştığım sorunların önemli bir bölümünün yazılımla çözülebileceğini görünce bilgisayar programlama eğitimi aldım; yazılım geliştirme ve test alanında sertifikalar edindim. 2026'da kendi yazılım şirketimi kurdum; tehlikeli madde, lojistik ve günlük yaşam için web platformları ve mobil uygulamalar geliştiriyor, test ediyor ve yayına alıyorum.",
    en: "From 2015 to 2019 I worked as a mining engineer and permanent site supervisor in the mining industry, and from 2019 to 2026 as a dangerous goods safety adviser for air and road transport at several organisations, including FedEx Express. Seeing that many operational problems could be solved with software, I studied computer programming and earned certifications in software development and testing. In 2026 I founded my own software company; I build, test and ship web platforms and mobile apps for dangerous goods, logistics and everyday life."
  },

  /* Yeniden eskiye */
  experience: [
    {
      years: { tr: "2026 – Bugün", en: "2026 – Present" },
      title: { tr: "Kurucu · Yazılım Geliştirici", en: "Founder · Software Developer" },
      /* Şirketin resmi adı doğrulanmadığı için yazılmadı. Google Play geliştirici
         hesabının adı "RiskManage Studio"; bu resmi şirket adı olarak
         varsayılmadı. Resmi adı eklemek için "org" alanını doldur. */
      org: null,
      text: {
        tr: "2026'da kurduğum şirketle kendi ürünlerimi geliştiriyorum: TMGD Asistanı ve SafeCargo gibi sektör platformları, Kurye ve Nakliyat pazar yeri ve günlük yaşam için Android uygulamaları. Fikir, tasarım, geliştirme, test ve yayın süreçlerini kendim yürütüyorum.",
        en: "Since founding my company in 2026 I build my own products: industry platforms such as TMGD Asistanı and SafeCargo, the Kurye ve Nakliyat marketplace and Android apps for everyday life. I handle the idea, design, development, testing and release myself."
      },
      tags: {
        tr: ["SaaS", "Web", "Mobil", "Ürün geliştirme", "Test"],
        en: ["SaaS", "Web", "Mobile", "Product development", "Testing"]
      }
    },
    {
      years: { tr: "2019 – 2026", en: "2019 – 2026" },
      title: { tr: "Tehlikeli Madde Güvenlik Danışmanı (TMGD)", en: "Dangerous Goods Safety Adviser (DGSA)" },
      org: { tr: "Havayolu ve karayolu · FedEx Express dahil", en: "Air and road · including FedEx Express" },
      text: {
        tr: "Havayolu ve karayolu tehlikeli madde taşımacılığında güvenlik danışmanlığı: mevzuata uygunluk, sınıflandırma, ambalajlama, etiketleme, dokümantasyon, eğitim ve iç denetim süreçlerinin yönetimi.",
        en: "Safety advisory across air and road dangerous goods operations: regulatory compliance, classification, packaging, labelling, documentation, training and internal audits."
      },
      tags: {
        tr: ["ADR", "IATA DGR", "Sınıflandırma", "Dokümantasyon", "Denetim", "Eğitim"],
        en: ["ADR", "IATA DGR", "Classification", "Documentation", "Audit", "Training"]
      }
    },
    {
      years: { tr: "2015 – 2019", en: "2015 – 2019" },
      title: { tr: "Maden Mühendisi / Daimi Nezaretçi", en: "Mining Engineer / Permanent Site Supervisor" },
      org: { tr: "Madencilik sektörü", en: "Mining industry" },
      text: {
        tr: "Saha operasyonlarının yürütülmesi, teknik süreçlerin denetimi ve mevzuata uygunluğun sağlanması. Üretimin ve güvenliğin aynı anda yönetilmesi gereken bir ortamda sorumluluk almayı öğrendim.",
        en: "Running field operations, supervising technical processes and ensuring regulatory compliance in an environment where production and safety have to be managed at the same time."
      },
      tags: {
        tr: ["Saha operasyonu", "İş güvenliği", "Teknik nezaret", "Mevzuat"],
        en: ["Field operations", "Safety", "Supervision", "Compliance"]
      }
    }
  ],

  /* Yeniden eskiye */
  education: [
    {
      years: "2024 – 2026",
      title: { tr: "Bilgisayar Programlama", en: "Computer Programming" },
      school: { tr: "Anadolu Üniversitesi", en: "Anadolu University" },
      text: {
        tr: "Yazılım geliştirme pratiğimi akademik bir temele oturttuğum program.",
        en: "Putting an academic foundation under my hands-on software practice."
      }
    },
    {
      years: "2018 – 2024",
      title: { tr: "Uluslararası Ticaret ve Lojistik Yönetimi", en: "International Trade and Logistics Management" },
      school: { tr: "Anadolu Üniversitesi", en: "Anadolu University" },
      text: {
        tr: "Tehlikeli madde ve taşımacılık alanındaki saha deneyimimi ticaret ve lojistik teorisiyle birleştirdiğim eğitim.",
        en: "Connecting hands-on dangerous goods and transport experience with trade and logistics theory."
      }
    },
    {
      years: "2007 – 2014",
      title: { tr: "Maden Mühendisliği", en: "Mining Engineering" },
      school: { tr: "Dokuz Eylül Üniversitesi", en: "Dokuz Eylül University" },
      text: {
        tr: "Mühendislik disiplininin ve analitik problem çözme alışkanlığının temelini attığım dönem.",
        en: "Where the engineering mindset and the habit of analytical problem solving were formed."
      }
    }
  ],

  /* Yalnızca projelerde fiilen kullanılan teknolojiler (proje klasörlerindeki
     package.json dosyalarından doğrulanmıştı; bkz. README). */
  skills: [
    {
      title: { tr: "Arayüz", en: "Frontend" },
      note: { tr: "Web projelerimin arayüzleri React ve TypeScript üzerine kurulu.", en: "My web products are built with React and TypeScript." },
      items: ["TypeScript", "React 19", "Next.js (App Router)", "Tailwind CSS", "Vite", "Zustand", "TanStack Query", "React Hook Form", "Zod", "Framer Motion", "Recharts"]
    },
    {
      title: { tr: "Sunucu ve veri", en: "Backend and data" },
      note: { tr: "Supabase üzerinde Postgres, kimlik doğrulama ve gerçek zamanlı veri.", en: "Postgres, auth and realtime data on Supabase." },
      items: ["Supabase", "PostgreSQL", "Row Level Security", "Auth", "Realtime", "Storage", "Edge Functions", "Firebase", "REST API"]
    },
    {
      title: { tr: "Mobil", en: "Mobile" },
      note: { tr: "Android uygulamalarını React Native, Expo ve Capacitor ile geliştiriyorum.", en: "I build Android apps with React Native, Expo and Capacitor." },
      items: ["React Native", "Expo (SDK 54–57)", "Expo Router", "Capacitor", "EAS Build", "Play Console", "PWA"]
    },
    {
      title: { tr: "Test ve kalite güvence", en: "Testing and QA" },
      note: { tr: "ISTQB ve SDET eğitimlerimin pratikteki karşılığı: projelerimde test katmanı var.", en: "What ISTQB and SDET look like in practice: my projects ship with a test layer." },
      items: ["ISTQB", "SDET", "Playwright (E2E)", "Vitest", "Jest", "TypeScript strict", "ESLint", "Lighthouse CI", "Sentry"]
    },
    {
      title: { tr: "Yapay zekâ entegrasyonu", en: "AI integration" },
      note: { tr: "Hem bulut dil modelleri hem tamamen cihaz üzerinde çalışan modeller.", en: "Both cloud LLMs and models that run entirely on the device." },
      items: ["Anthropic Claude API", "Google Gemini", "OpenAI API", { tr: "Cihaz üzerinde LLM (llama.rn / GGUF)", en: "On-device LLM (llama.rn / GGUF)" }, "ML Kit OCR", { tr: "Konuşma tanıma", en: "Speech recognition" }]
    },
    {
      title: { tr: "Altyapı ve yayın", en: "Infrastructure and release" },
      note: { tr: "Fikirden mağaza yayınına kadar tüm zinciri kendim yürütüyorum.", en: "I run the whole chain from idea to store release myself." },
      items: ["Vercel", "Git / GitHub", "CI/CD", "Sentry", "Resend", "next-intl (i18n)", "SEO / JSON-LD", "KVKK / GDPR"]
    }
  ],

  /* Belge görselleri sitede yok; ziyaretçiye "Görüntüle" düğmesi
     gösterilmez. Kopyalar talep üzerine paylaşılır. */
  certificates: [
    {
      name: { tr: "Tehlikeli Madde Güvenlik Danışmanı (TMGD)", en: "Dangerous Goods Safety Adviser (DGSA)" },
      issuer: "ADR · IATA DGR",
      text: {
        tr: "Havayolu ve karayolu tehlikeli madde taşımacılığında güvenlik danışmanlığı.",
        en: "Safety advisory for air and road transport of dangerous goods."
      }
    },
    {
      name: "ISTQB®",
      issuer: "Software Testing Certification",
      text: {
        tr: "Yazılım test süreçleri, test prensipleri ve kalite güvence alanında uluslararası geçerliliği olan temel yetkinlik sertifikası.",
        en: "Internationally recognised certification covering software testing processes, testing principles and quality assurance fundamentals."
      }
    },
    {
      name: "Software Development Engineer in Test",
      issuer: "SDET Certification",
      text: {
        tr: "Yazılım geliştirme ve test süreçlerini bir araya getiren, test otomasyonuna odaklanan eğitim.",
        en: "Training that combines software development with testing, focused on test automation."
      }
    },
    {
      name: "Fullstack Developer",
      issuer: "Udemy",
      text: {
        tr: "Frontend ve backend teknolojilerini birlikte kapsayan, uçtan uca web geliştirme eğitimi.",
        en: "End-to-end web development training covering both frontend and backend technologies."
      }
    },
    {
      name: "Introduction to Software Testing",
      issuer: "BTK Akademi",
      text: {
        tr: "Yazılım test süreçlerine giriş, temel test prensipleri ve test yaşam döngüsü eğitimi.",
        en: "Introduction to software testing processes, core principles and the test life cycle."
      }
    }
  ]
};
