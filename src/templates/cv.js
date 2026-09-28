/* =============================================================================
   CV şablonu (A4). Sitenin sayfalarından bağımsızdır: ana sayfa kısaldı ama
   CV'de kariyer, eğitim, projeler, yetkinlikler ve sertifikaların tamamı yer
   alır. Veriler content/ altındaki aynı dosyalardan gelir.

   Bu HTML yayınlanmaz; yalnızca tools/build-cv-pdf.js onu açıp
   assets/cv/*.pdf dosyalarını üretir.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const { esc, L } = require("../lib/util");
const { abs, PATHS } = require("../lib/routes");
const profile = require("../../content/profile");
const projects = require("../../content/projects");

const T = {
  tr: {
    summary: "Özet", experience: "Deneyim", projects: "Projeler", education: "Eğitim",
    skills: "Yetkinlikler", certificates: "Sertifikalar", details: "Proje ayrıntıları"
  },
  en: {
    summary: "Summary", experience: "Experience", projects: "Projects", education: "Education",
    skills: "Skills", certificates: "Certificates", details: "Project details"
  }
};

function phone(lang) {
  const national = profile.contact.phone.replace(/^90/, "").replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  return lang === "tr" ? "0" + national : "+90 " + national;
}

function renderCv(lang) {
  const t = T[lang];
  const css = fs.readFileSync(path.join(__dirname, "cv.css"), "utf8");
  const email = profile.contact.emailUser + "@" + profile.contact.emailDomain;
  const linkedin = profile.links.find(function (l) { return l.key === "linkedin"; }).url;
  const github = profile.links.find(function (l) { return l.key === "github"; }).url;
  const bare = function (u) { return u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); };

  const contact = [
    '<a href="mailto:' + esc(email) + '">' + esc(email) + "</a>",
    '<a href="tel:+' + esc(profile.contact.phone) + '">' + esc(phone(lang)) + "</a>",
    '<a href="' + abs(PATHS[lang].home) + '">suphicelikoz.com</a>',
    '<a href="' + esc(linkedin) + '">' + esc(bare(linkedin)) + "</a>",
    '<a href="' + esc(github) + '">' + esc(bare(github)) + "</a>"
  ].join('<span aria-hidden="true"> · </span>');

  const experience = profile.experience.map(function (e) {
    return [
      '<div class="item">',
      '  <div class="item__head"><h3>' + esc(L(e.title, lang)) + '</h3><span class="years">' + esc(L(e.years, lang)) + "</span></div>",
      e.org ? '  <p class="org">' + esc(L(e.org, lang)) + "</p>" : "",
      "  <p>" + esc(L(e.text, lang)) + "</p>",
      '  <p class="keywords">' + esc(L(e.tags, lang).join(" · ")) + "</p>",
      "</div>"
    ].filter(Boolean).join("\n");
  }).join("\n");

  const projectItems = projects.map(function (p) {
    const links = p.links.map(function (l) {
      return '<a href="' + esc(l.url) + '">' + esc(l.type === "play" ? "Google Play" : l.label) + "</a>";
    }).join(" · ");
    const tech = (p.tech || []).map(function (x) { return lang === "en" && x.nameEn ? x.nameEn : x.name; }).join(", ");
    return [
      '<div class="project">',
      '  <h3>' + esc(p.name) + ' <span class="platform">' + esc(L(p.platformLabel, lang)) + "</span></h3>",
      '  <p class="links">' + links + "</p>",
      "  <p>" + esc(L(p.summary, lang)) + "</p>",
      tech ? '  <p class="keywords">' + esc(tech) + "</p>" : "",
      "</div>"
    ].filter(Boolean).join("\n");
  }).join("\n");

  const education = profile.education.map(function (e) {
    return '<div class="item item--compact"><div class="item__head"><h3>' + esc(L(e.title, lang)) + '</h3><span class="years">' + esc(e.years) + '</span></div><p class="org">' + esc(L(e.school, lang)) + "</p></div>";
  }).join("\n");

  const skills = profile.skills.map(function (g) {
    return '<p class="skill"><b>' + esc(L(g.title, lang)) + ":</b> " + esc(g.items.map(function (x) { return L(x, lang); }).join(", ")) + "</p>";
  }).join("\n");

  const certs = profile.certificates.map(function (c) {
    return "<li><b>" + esc(L(c.name, lang)) + "</b> — " + esc(L(c.issuer, lang)) + "</li>";
  }).join("\n");

  return [
    "<!DOCTYPE html>",
    '<html lang="' + lang + '">',
    "<head>",
    '<meta charset="UTF-8">',
    "<title>" + esc(profile.name) + " — CV</title>",
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Space+Grotesk:wght@600;700&amp;display=swap" rel="stylesheet">',
    "<style>" + css + "</style>",
    "</head>",
    "<body>",
    '<header class="cv-head">',
    "  <div>",
    "    <h1>" + esc(profile.name) + "</h1>",
    '    <p class="headline">' + esc(L(profile.cvHeadline, lang)) + "</p>",
    '    <p class="contact">' + contact + "</p>",
    "  </div>",
    '  <img class="photo" src="' + esc(profile.photo.src) + '" alt="' + esc(L(profile.photo.alt, lang)) + '" width="' + profile.photo.width + '" height="' + profile.photo.height + '">',
    "</header>",
    '<section><h2>' + esc(t.summary) + '</h2><p class="summary">' + esc(L(profile.cvSummary, lang)) + "</p></section>",
    '<section><h2>' + esc(t.experience) + "</h2>" + experience + "</section>",
    '<section><h2>' + esc(t.projects) + '</h2><div class="projects">' + projectItems + '</div><p class="more">' + esc(t.details) + ': <a href="' + abs(PATHS[lang].projects) + '">' + esc(bare(abs(PATHS[lang].projects))) + "</a></p></section>",
    '<div class="cols">',
    '  <section><h2>' + esc(t.education) + "</h2>" + education + "</section>",
    '  <section><h2>' + esc(t.certificates) + '</h2><ul class="certs">' + certs + "</ul></section>",
    "</div>",
    '<section><h2>' + esc(t.skills) + "</h2>" + skills + "</section>",
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

module.exports = { renderCv };
