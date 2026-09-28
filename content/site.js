/* =============================================================================
   Arayüz ve sayfa metinleri (Türkçe / İngilizce).
   Menü adları, düğmeler, sayfa başlıkları ve açıklamaları burada.
   ========================================================================== */
"use strict";

module.exports = {
  tr: {
    locale: "tr_TR",
    skip: "İçeriğe geç",
    home: "Ana sayfa",
    homeAria: "Suphi Atılım ÇELİKÖZ, ana sayfa",
    nav: { projects: "Projelerim", about: "Hakkımda", blog: "Blog", contact: "İletişim" },
    mainMenu: "Ana menü",
    footerMenu: "Alt menü",
    langGroup: "Dil seçimi",
    langOther: "English",
    langNoTranslation: "Bu yazının İngilizce sürümü yok; İngilizce blog sayfasına gider",
    theme: "Açık / koyu tema",
    themeToLight: "Açık temaya geç",
    themeToDark: "Koyu temaya geç",
    cv: "CV İndir",
    cvAria: "CV İndir (PDF)",
    cvLong: "CV'mi indir (PDF)",
    newTab: "(yeni sekmede açılır)",
    breadcrumb: "Sayfa konumu",
    viewProject: "Projeyi incele",
    visitSite: "Siteyi ziyaret et",
    googlePlay: "Google Play'de aç",
    allProjects: "Tüm projelerim",
    tagsLabel: "Alanlar",
    rights: "Tüm hakları saklıdır.",

    filters: {
      label: "Platforma göre filtrele",
      all: "Tümü",
      web: "Web ve SaaS",
      mobile: "Mobil Uygulamalar",
      count: "{n} proje gösteriliyor"
    },

    projectSections: {
      purpose: "Amaç ve hedef kitle",
      problem: "Çözülen problem",
      role: "Üstlendiğim çalışmalar",
      features: "Öne çıkan özellikler",
      screens: "Ekran görüntüleri",
      tech: "Teknik tercihler",
      related: "İlgili projeler",
      posts: "İlgili yazılar",
      links: "Bağlantılar"
    },

    blog: {
      readingTime: "{n} dk okuma",
      published: "Yayın tarihi",
      updated: "Güncellendi",
      noDate: "Yayın tarihi belirlenmedi",
      toc: "İçindekiler",
      relatedProject: "İlgili proje",
      relatedProjects: "İlgili projeler",
      all: "Tüm yazılar",
      latest: "Son yazılar",
      empty: "Henüz yayımlanmış yazı yok.",
      emptyMore: "İlk yazılar hazırlanıyor. O zamana kadar projelerime göz atabilirsiniz.",
      rss: "RSS akışı",
      draftBadge: "Taslak",
      draftsTitle: "Taslaklar (yalnızca önizlemede görünür)",
      draftBanner: "Taslak: Bu yazı yayımlanmadı. Yalnızca yerel önizlemede görünür; canlı sitede, listelerde, site haritasında ve RSS'te yer almaz.",
      noteLabel: "ONAY:",
      notesSummary: "Bu taslakta onay bekleyen {n} not var."
    },

    pages: {
      home: {
        title: "Suphi Atılım ÇELİKÖZ — TMGD ve Yazılım Geliştirici",
        description: "Madencilik ve tehlikeli madde taşımacılığındaki deneyimimi yazılıma taşıyorum. TMGD Asistanı, SafeCargo ve Hafıza Tutucum gibi projelerim, yazılarım ve iletişim bilgilerim.",
        ctaProjects: "Projelerimi incele",
        ctaContact: "İletişime geç",
        socialLabel: "Bağlantılar",
        featuredTitle: "Öne çıkan projeler",
        sectorTitle: "Sahadaki deneyim, ürünün başlangıç noktası",
        sectorLead: "Tehlikeli madde güvenlik danışmanı olarak sınıflandırma, ambalajlama, etiketleme, dokümantasyon, eğitim ve iç denetim süreçlerini yönettim. Operasyonda tekrar eden hataları, kaybolan evrakları ve elle yapılan kontrolleri yakından gördüm. Projelerimin çoğu bu gözlemlerden doğdu.",
        sectorItems: [
          {
            title: "Dört mevzuat, tek arama",
            text: "ADR, RID, IMDG ve IATA DGR ayrı kaynaklarda ve çoğunlukla İngilizce. SafeCargo bu dört mevzuatı Türkçe ve tek yerde arar.",
            project: "safecargo"
          },
          {
            title: "Excel ve kâğıttan tek panele",
            text: "Danışmanlık işinde firma atamaları, ziyaretler ve belgeler dağınık tutuluyor. TMGD Asistanı bunları hatırlatmalarla birlikte tek panelde toplar.",
            project: "tmgd-asistani"
          },
          {
            title: "Telefonla yürüyen taşıma talepleri",
            text: "Küçük ölçekli taşıma ve kurye işleri çoğu zaman telefon ve mesajla, kayıt tutulmadan yürüyor. Kurye ve Nakliyat talebi, teklifleri ve karşılaştırmayı kayıt altına alır.",
            project: "kurye-ve-nakliyat"
          }
        ],
        contactTitle: "İletişim",
        contactText: "Proje, danışmanlık veya iş birliği için yazabilirsiniz. Yeni projeler ve iş birlikleri için uygunum; genellikle aynı gün içinde dönüş yapıyorum.",
        sendMail: "E-posta gönder",
        mailSubject: "Web sitesi üzerinden iletişim",
        contactLabels: { email: "E-posta", phone: "Telefon", linkedin: "LinkedIn", github: "GitHub", googleplay: "Google Play", upwork: "Upwork" },
        contactValues: { linkedin: "Profilime git", github: "Kod depolarım", googleplay: "Uygulamalarım", upwork: "Upwork profilim" },
        jsNeeded: "JavaScript ile gösterilir"
      },
      projects: {
        title: "Projelerim — Suphi Atılım ÇELİKÖZ",
        heading: "Projelerim",
        description: "Tehlikeli madde, lojistik ve günlük yaşam için geliştirdiğim web platformları ve mobil uygulamalar: TMGD Asistanı, SafeCargo, Kurye ve Nakliyat, Hafıza Tutucum ve diğerleri.",
        lead: "Tehlikeli madde ve lojistik alanında geliştirdiğim web platformları ile günlük kullanım için yaptığım mobil uygulamalar. Her projenin ayrıntıları kendi sayfasında."
      },
      about: {
        title: "Hakkımda — Suphi Atılım ÇELİKÖZ",
        heading: "Hakkımda",
        description: "Maden mühendisliğinden tehlikeli madde güvenlik danışmanlığına, oradan yazılım geliştirmeye uzanan deneyimim; eğitimim, yetkinliklerim ve sertifikalarım.",
        onThisPage: "Bu sayfada",
        experience: "Deneyim",
        education: "Eğitim",
        skills: "Yetkinlikler",
        skillsLead: "Aşağıdaki teknolojileri projelerimde fiilen kullanıyorum. Yazılımda geliştirme ile test ve kalite güvenceyi birlikte yürütüyorum.",
        certificates: "Sertifikalar",
        certNote: "Belge kopyaları talep üzerine paylaşılır.",
        ctaTitle: "Birlikte çalışalım",
        ctaText: "Kariyerimin tamamı ve projelerim CV'mde de var."
      },
      blog: {
        title: "Blog — Suphi Atılım ÇELİKÖZ",
        heading: "Blog",
        description: "Yazılım üretimi, sektör deneyimi, ürün geliştirme ve mesleki yolculuğum üzerine yazılar.",
        lead: "Yazılım üretimi, sektör deneyimim, ürün geliştirme ve mesleki yolculuğum üzerine yazılar."
      },
      notFound: {
        title: "Sayfa bulunamadı — Suphi Atılım ÇELİKÖZ",
        heading: "Sayfa bulunamadı",
        text: "Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.",
        back: "Ana sayfaya dön"
      }
    }
  },

  en: {
    locale: "en_US",
    skip: "Skip to content",
    home: "Home",
    homeAria: "Suphi Atılım ÇELİKÖZ, home",
    nav: { projects: "Projects", about: "About", blog: "Blog", contact: "Contact" },
    mainMenu: "Main menu",
    footerMenu: "Footer menu",
    langGroup: "Language",
    langOther: "Türkçe",
    langNoTranslation: "This post has no Turkish version; goes to the Turkish blog page",
    theme: "Light / dark theme",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    cv: "Download CV",
    cvAria: "Download CV (PDF)",
    cvLong: "Download my CV (PDF)",
    newTab: "(opens in a new tab)",
    breadcrumb: "Breadcrumb",
    viewProject: "View project",
    visitSite: "Visit site",
    googlePlay: "Open on Google Play",
    allProjects: "All projects",
    tagsLabel: "Areas",
    rights: "All rights reserved.",

    filters: {
      label: "Filter by platform",
      all: "All",
      web: "Web and SaaS",
      mobile: "Mobile apps",
      count: "Showing {n} projects"
    },

    projectSections: {
      purpose: "Purpose and audience",
      problem: "The problem",
      role: "My role",
      features: "Key features",
      screens: "Screenshots",
      tech: "Technical choices",
      related: "Related projects",
      posts: "Related posts",
      links: "Links"
    },

    blog: {
      readingTime: "{n} min read",
      published: "Published",
      updated: "Updated",
      noDate: "No publication date yet",
      toc: "Contents",
      relatedProject: "Related project",
      relatedProjects: "Related projects",
      all: "All posts",
      latest: "Latest posts",
      empty: "No posts published yet.",
      emptyMore: "The first posts are in progress. In the meantime, have a look at my projects.",
      rss: "RSS feed",
      draftBadge: "Draft",
      draftsTitle: "Drafts (visible only in preview)",
      draftBanner: "Draft: this post is not published. It is visible only in the local preview and never appears on the live site, in lists, the sitemap or RSS.",
      noteLabel: "TO CONFIRM:",
      notesSummary: "This draft has {n} note(s) awaiting confirmation."
    },

    pages: {
      home: {
        title: "Suphi Atılım ÇELİKÖZ — Dangerous Goods Adviser and Software Developer",
        description: "I bring my experience in mining and dangerous goods transport into software. Projects such as TMGD Asistanı, SafeCargo and Hafıza Tutucum, my writing and how to reach me.",
        ctaProjects: "Explore my projects",
        ctaContact: "Get in touch",
        socialLabel: "Links",
        featuredTitle: "Featured projects",
        sectorTitle: "Field experience is where my products start",
        sectorLead: "As a dangerous goods safety adviser I managed classification, packaging, labelling, documentation, training and internal audits. I saw recurring operational mistakes, lost paperwork and manual checks up close. Most of my projects grew out of those observations.",
        sectorItems: [
          {
            title: "Four regulations, one search",
            text: "ADR, RID, IMDG and IATA DGR live in separate sources, mostly in English. SafeCargo searches all four in Turkish, in one place.",
            project: "safecargo"
          },
          {
            title: "From spreadsheets and paper to one panel",
            text: "In advisory work, company assignments, visits and documents are kept in scattered places. TMGD Asistanı brings them together in one panel, with reminders.",
            project: "tmgd-asistani"
          },
          {
            title: "Transport requests that run over the phone",
            text: "Small courier and freight jobs often run over calls and messages with no record. Kurye ve Nakliyat keeps the request, the offers and the comparison on record.",
            project: "kurye-ve-nakliyat"
          }
        ],
        contactTitle: "Contact",
        contactText: "Feel free to write about a project, consulting or a collaboration. I'm available for new projects and collaborations and usually reply the same day.",
        sendMail: "Send an email",
        mailSubject: "Contact via your website",
        contactLabels: { email: "Email", phone: "Phone", linkedin: "LinkedIn", github: "GitHub", googleplay: "Google Play", upwork: "Upwork" },
        contactValues: { linkedin: "Visit profile", github: "My repositories", googleplay: "My apps", upwork: "My Upwork profile" },
        jsNeeded: "shown with JavaScript"
      },
      projects: {
        title: "Projects — Suphi Atılım ÇELİKÖZ",
        heading: "Projects",
        description: "Web platforms and mobile apps I built for dangerous goods, logistics and everyday life: TMGD Asistanı, SafeCargo, Kurye ve Nakliyat, Hafıza Tutucum and more.",
        lead: "Web platforms I built for dangerous goods and logistics, and mobile apps for everyday use. Each project has its own page with the details."
      },
      about: {
        title: "About — Suphi Atılım ÇELİKÖZ",
        heading: "About me",
        description: "From mining engineering to dangerous goods safety advisory to software development: my experience, education, skills and certificates.",
        onThisPage: "On this page",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        skillsLead: "I use the technologies below in my own projects. In software I work on development and on testing and quality assurance together.",
        certificates: "Certificates",
        certNote: "Copies of the documents are available on request.",
        ctaTitle: "Let's work together",
        ctaText: "My full career and projects are also in my CV."
      },
      blog: {
        title: "Blog — Suphi Atılım ÇELİKÖZ",
        heading: "Blog",
        description: "Writing on building software, industry experience, product development and my professional journey.",
        lead: "Writing on building software, my industry experience, product development and my professional journey."
      },
      notFound: {
        title: "Page not found — Suphi Atılım ÇELİKÖZ",
        heading: "Page not found",
        text: "The page you are looking for may have moved or never existed.",
        back: "Back to the home page"
      }
    }
  }
};
