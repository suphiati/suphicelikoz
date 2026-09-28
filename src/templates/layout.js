/* =============================================================================
   Ortak sayfa iskeleti: <head> (SEO, sosyal paylaşım, dil alternatifleri),
   üst menü, alt menü. Her sayfa buradan geçer.
   ========================================================================== */
"use strict";

const { esc, L } = require("../lib/util");
const { PATHS, ANCHORS, abs } = require("../lib/routes");
const icons = require("./icons");
const SITE = require("../../content/site");
const profile = require("../../content/profile");

const OG_IMAGE = { tr: "/assets/img/og-cover.jpg", en: "/assets/img/og-cover-en.jpg" };
const OG_ALT = {
  tr: "Suphi Atılım ÇELİKÖZ: tehlikeli madde ve lojistik deneyimini yazılıma taşıyan geliştirici",
  en: "Suphi Atılım ÇELİKÖZ: a developer bringing dangerous goods and logistics experience into software"
};

const THEME_COLOR = { dark: "#0b1120", light: "#f7f9fc" };

/* Sayfa boyanmadan önce tema uygulanır (yanıp sönme olmasın). Anahtar eski
   sitedekiyle aynı: ziyaretçinin önceki seçimi korunur. */
const THEME_SCRIPT =
  '(function(){try{var s=localStorage.getItem("sac-theme");' +
  'var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");' +
  'document.documentElement.setAttribute("data-theme",t);' +
  'var m=document.querySelector(\'meta[name="theme-color"]\');' +
  'if(m)m.setAttribute("content",t==="light"?"' + THEME_COLOR.light + '":"' + THEME_COLOR.dark + '");' +
  "}catch(e){}})();";

function other(lang) { return lang === "tr" ? "en" : "tr"; }

function head(page) {
  const t = SITE[page.lang];
  const lines = [];
  lines.push('<meta charset="UTF-8">');
  lines.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
  lines.push("<title>" + esc(page.title) + "</title>");
  lines.push('<meta name="description" content="' + esc(page.description) + '">');
  lines.push('<meta name="author" content="' + esc(profile.name) + '">');
  if (page.noindex) lines.push('<meta name="robots" content="noindex, nofollow">');

  if (page.path) {
    lines.push('<link rel="canonical" href="' + abs(page.path) + '">');
    /* Dil alternatifleri yalnızca gerçek bir karşılık varsa yazılır */
    if (page.alt && page.alt.tr && page.alt.en) {
      lines.push('<link rel="alternate" hreflang="tr" href="' + abs(page.alt.tr) + '">');
      lines.push('<link rel="alternate" hreflang="en" href="' + abs(page.alt.en) + '">');
      lines.push('<link rel="alternate" hreflang="x-default" href="' + abs(page.alt.tr) + '">');
    }
  }
  if (page.rss) {
    lines.push('<link rel="alternate" type="application/rss+xml" title="' + esc(profile.name + " — Blog") + '" href="' + PATHS[page.lang].rss + '">');
  }

  /* Open Graph / sosyal paylaşım */
  lines.push('<meta property="og:type" content="' + (page.ogType || "website") + '">');
  lines.push('<meta property="og:site_name" content="' + esc(profile.name) + '">');
  lines.push('<meta property="og:locale" content="' + t.locale + '">');
  if (page.alt && page.alt.tr && page.alt.en) {
    lines.push('<meta property="og:locale:alternate" content="' + SITE[other(page.lang)].locale + '">');
  }
  lines.push('<meta property="og:title" content="' + esc(page.ogTitle || page.title) + '">');
  lines.push('<meta property="og:description" content="' + esc(page.description) + '">');
  if (page.path) lines.push('<meta property="og:url" content="' + abs(page.path) + '">');
  lines.push('<meta property="og:image" content="' + abs(OG_IMAGE[page.lang]) + '">');
  lines.push('<meta property="og:image:type" content="image/jpeg">');
  lines.push('<meta property="og:image:width" content="1200">');
  lines.push('<meta property="og:image:height" content="630">');
  lines.push('<meta property="og:image:alt" content="' + esc(OG_ALT[page.lang]) + '">');
  if (page.article) {
    if (page.article.published) lines.push('<meta property="article:published_time" content="' + page.article.published + '">');
    if (page.article.modified) lines.push('<meta property="article:modified_time" content="' + page.article.modified + '">');
    lines.push('<meta property="article:section" content="' + esc(page.article.section) + '">');
  }
  lines.push('<meta name="twitter:card" content="summary_large_image">');
  lines.push('<meta name="twitter:image:alt" content="' + esc(OG_ALT[page.lang]) + '">');

  lines.push('<meta name="theme-color" content="' + THEME_COLOR.dark + '">');
  lines.push('<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">');
  lines.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
  lines.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  lines.push('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Space+Grotesk:wght@600;700&amp;display=swap" rel="stylesheet">');
  lines.push('<link rel="stylesheet" href="/assets/css/style.css">');
  lines.push("<script>" + THEME_SCRIPT + "</script>");
  if (page.headScript) lines.push("<script>" + page.headScript + "</script>");
  (page.jsonld || []).forEach(function (obj) {
    lines.push('<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, "\\u003c") + "</script>");
  });
  return lines.join("\n");
}

function langSwitch(page) {
  const t = SITE[page.lang];
  const o = other(page.lang);
  const cur = '<a href="' + esc(page.path || PATHS[page.lang].home) + '" lang="' + page.lang + '" aria-current="true">' + page.lang.toUpperCase() + "</a>";
  let target = page.alt && page.alt[o];
  /* Erişilebilir ad görünen "EN"/"TR" yazısını içermeli (WCAG 2.5.3) */
  let label = o.toUpperCase() + " — " + t.langOther;
  let extra = "";
  if (!target) {
    target = (page.altFallback && page.altFallback[o]) || PATHS[o].home;
    label = o.toUpperCase() + " — " + t.langNoTranslation;
    extra = ' title="' + esc(t.langNoTranslation) + '"';
  }
  const otherLink = '<a href="' + esc(target) + '" hreflang="' + o + '" lang="' + o + '" aria-label="' + esc(label) + '"' + extra + ">" + o.toUpperCase() + "</a>";
  const links = page.lang === "tr" ? cur + otherLink : otherLink + cur;
  return '<div class="lang-switch" role="group" aria-label="' + esc(t.langGroup) + '">' + links + "</div>";
}

function navItems(lang, current) {
  const t = SITE[lang];
  const P = PATHS[lang];
  return [
    { key: "projects", href: P.projects, label: t.nav.projects },
    { key: "about", href: P.about, label: t.nav.about },
    { key: "blog", href: P.blog, label: t.nav.blog },
    { key: "contact", href: P.home + "#" + ANCHORS[lang].contact, label: t.nav.contact }
  ].map(function (item) {
    const on = item.key === current ? ' aria-current="page"' : "";
    return '<li><a href="' + item.href + '"' + on + ">" + esc(item.label) + "</a></li>";
  }).join("");
}

function header(page) {
  const t = SITE[page.lang];
  return [
    '<header class="site-header">',
    '  <div class="wrap site-header__inner">',
    '    <a class="brand" href="' + PATHS[page.lang].home + '" aria-label="' + esc(t.homeAria) + '"' + (page.nav === "home" ? ' aria-current="page"' : "") + ">",
    '      <span class="brand__mark" aria-hidden="true">' + esc(profile.initials) + "</span>",
    '      <span class="brand__name">' + esc(profile.name) + "</span>",
    "    </a>",
    '    <nav class="site-nav" aria-label="' + esc(t.mainMenu) + '"><ul>' + navItems(page.lang, page.nav) + "</ul></nav>",
    '    <div class="site-header__actions">',
    "      " + langSwitch(page),
    '      <button class="icon-btn theme-toggle" id="theme-toggle" type="button" aria-label="' + esc(t.theme) + '" data-label-light="' + esc(t.themeToLight) + '" data-label-dark="' + esc(t.themeToDark) + '">' + icons.sun + icons.moon + "</button>",
    '      <a class="btn btn--primary btn--sm header-cv" href="' + profile.cv[page.lang] + '" download type="application/pdf" aria-label="' + esc(t.cvAria) + '">' + icons.download + '<span class="header-cv__label">' + esc(t.cv) + "</span></a>",
    "    </div>",
    "  </div>",
    "</header>"
  ].join("\n");
}

function footer(page) {
  const t = SITE[page.lang];
  const o = other(page.lang);
  const altHref = (page.alt && page.alt[o]) || (page.altFallback && page.altFallback[o]) || PATHS[o].home;
  const year = new Date().getFullYear();
  return [
    '<footer class="site-footer">',
    '  <div class="wrap site-footer__inner">',
    '    <nav aria-label="' + esc(t.footerMenu) + '"><ul>',
    "      " + navItems(page.lang, page.nav),
    '      <li><a href="' + profile.cv[page.lang] + '" download type="application/pdf">' + esc(t.cvLong) + "</a></li>",
    '      <li><a href="' + esc(altHref) + '" hreflang="' + o + '" lang="' + o + '">' + esc(t.langOther) + "</a></li>",
    "    </ul></nav>",
    "    <p>© " + year + " " + esc(profile.name) + ". " + esc(t.rights) + "</p>",
    "  </div>",
    "</footer>"
  ].join("\n");
}

/* page: { lang, path, alt, altFallback, title, description, nav, body,
           ogType, article, jsonld, rss, noindex, headScript, banner } */
function layout(page) {
  const t = SITE[page.lang];
  return [
    "<!DOCTYPE html>",
    '<html lang="' + page.lang + '">',
    "<head>",
    head(page),
    "</head>",
    "<body>",
    '<a class="skip-link" href="#main">' + esc(t.skip) + "</a>",
    header(page),
    '<main id="main" tabindex="-1">',
    page.banner ? '<div class="draft-banner" role="note"><div class="wrap">' + page.banner + "</div></div>" : "",
    page.body,
    "</main>",
    footer(page),
    '<script src="/assets/js/main.js" defer></script>',
    "</body>",
    "</html>",
    ""
  ].filter(function (x) { return x !== ""; }).join("\n") + "\n";
}

module.exports = { layout, L, THEME_COLOR };
