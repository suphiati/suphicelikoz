/* =============================================================================
   Uygulama bölümleri (yalnızca İngilizce, Türkçe eşi yok): Duskpath, ScratchMiles.
   İçerik: content/<uygulama>.js (order, navLabel, pages). Ana menüde değil;
   sayfalar alt menüyle birbirine bağlı. Mağazalar bu adresleri ister.
   ========================================================================== */
"use strict";

const { esc } = require("../lib/util");
const { PATHS } = require("../lib/routes");

function subNav(D, current) {
  return '<nav class="dp-nav" aria-label="' + esc(D.navLabel) + '"><ul>' + D.order.map(function (k) {
    const p = D.pages[k];
    return '<li><a href="' + p.path + '"' + (k === current ? ' aria-current="page"' : "") + ">" + esc(p.nav) + "</a></li>";
  }).join("") + "</ul></nav>";
}

/* Adres HTML'e yazılmaz; assets/js/main.js data-u / data-d'den birleştirir. */
function mail(profile) {
  return '<a class="contact-list__value" id="mail-link" href="#contact" data-u="' + esc(profile.contact.emailUser) +
    '" data-d="' + esc(profile.contact.emailDomain) + '"><span id="mail-text">shown with JavaScript</span></a>' +
    '<noscript> (Enable JavaScript to see the address, or use the <a href="' + PATHS.en.home + '#contact">contact section</a> on the home page.)</noscript>';
}

function build(D, key) {
  const profile = require("../../content/profile");
  const p = D.pages[key];
  const body = p.body.replace("{{mail}}", mail(profile)).replace(/\{\{mailref\}\}/g, '<a href="#contact">the address in the Contact section</a>');
  return {
    lang: "en",
    path: p.path,
    noTwin: true,
    altFallback: { tr: PATHS.tr.home },
    nav: null,
    title: p.title,
    description: p.description,
    body: [
      '<div class="wrap page dp">',
      "  " + subNav(D, key),
      '  <article class="prose dp-article">',
      '    <header class="page-head">',
      '      <p class="page-kicker">' + esc(p.kicker) + "</p>",
      "      <h1>" + esc(p.heading) + "</h1>",
      p.lead ? '      <p class="page-lead">' + esc(p.lead) + "</p>" : "",
      "    </header>",
      body,
      "  </article>",
      "</div>"
    ].filter(Boolean).join("\n")
  };
}

module.exports = { all: function (D) { return D.order.map(function (k) { return build(D, k); }); } };
