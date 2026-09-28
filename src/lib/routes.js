/* =============================================================================
   Adresler. Sitedeki bütün iç bağlantılar buradan üretilir; bir adres
   değişecekse tek yer burası (eski adres için vercel.json'a yönlendirme ekle).
   ========================================================================== */
"use strict";

const SITE_URL = "https://suphicelikoz.com";

const PATHS = {
  tr: {
    home: "/",
    projects: "/projeler/",
    about: "/hakkimda/",
    blog: "/blog/",
    rss: "/blog/rss.xml",
    project: function (slug) { return "/projeler/" + slug + "/"; },
    post: function (slug) { return "/blog/" + slug + "/"; }
  },
  en: {
    home: "/en/",
    projects: "/en/projects/",
    about: "/en/about/",
    blog: "/en/blog/",
    rss: "/en/blog/rss.xml",
    project: function (slug) { return "/en/projects/" + slug + "/"; },
    post: function (slug) { return "/en/blog/" + slug + "/"; }
  }
};

/* Sayfa içi bölüm kimlikleri. Eski tek sayfalık sitenin bağlantıları
   (ör. /#sertifikalar) bu kimliklere yönlendirilir (bkz. LEGACY_HASHES). */
const ANCHORS = {
  tr: { contact: "iletisim", experience: "deneyim", education: "egitim", skills: "yetkinlikler", certificates: "sertifikalar" },
  en: { contact: "contact", experience: "experience", education: "education", skills: "skills", certificates: "certificates" }
};

/* Eski tek sayfalık sitedeki bölüm bağlantıları -> yeni adresler.
   Ana sayfadaki küçük bir betik #hash'i okuyup buraya göre yönlendirir
   (hash sunucuya gitmediği için bu iş vercel.json'da yapılamaz).
   #iletisim / #contact ana sayfada hâlâ var, o yüzden listede yok. */
const LEGACY_HASHES = {
  tr: {
    hakkimda: PATHS.tr.about,
    uzmanlik: PATHS.tr.about,
    yolculuk: PATHS.tr.about + "#" + ANCHORS.tr.experience,
    egitim: PATHS.tr.about + "#" + ANCHORS.tr.education,
    yetkinlikler: PATHS.tr.about + "#" + ANCHORS.tr.skills,
    sertifikalar: PATHS.tr.about + "#" + ANCHORS.tr.certificates,
    projeler: PATHS.tr.projects,
    uygulamalar: PATHS.tr.projects + "?platform=mobile"
  },
  en: {
    about: PATHS.en.about,
    expertise: PATHS.en.about,
    journey: PATHS.en.about + "#" + ANCHORS.en.experience,
    education: PATHS.en.about + "#" + ANCHORS.en.education,
    skills: PATHS.en.about + "#" + ANCHORS.en.skills,
    certificates: PATHS.en.about + "#" + ANCHORS.en.certificates,
    projects: PATHS.en.projects,
    apps: PATHS.en.projects + "?platform=mobile"
  }
};

function abs(pathname) { return SITE_URL + pathname; }

/* Ön izleme sunucusu ve kontrol betiği URL -> dosya eşlemesinde kullanır. */
function fileFor(pathname) {
  return pathname.endsWith("/") ? pathname + "index.html" : pathname;
}

module.exports = { SITE_URL, PATHS, ANCHORS, LEGACY_HASHES, abs, fileFor };
