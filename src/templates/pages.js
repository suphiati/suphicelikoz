/* =============================================================================
   Sayfa şablonları. Her fonksiyon layout()'a verilecek bir sayfa nesnesi
   döndürür; HTML'e dönüştürme ve dosyaya yazma tools/build-site.js'te.
   ========================================================================== */
"use strict";

const { esc, L, formatDate } = require("../lib/util");
const { PATHS, ANCHORS, LEGACY_HASHES, SITE_URL, abs } = require("../lib/routes");
const icons = require("./icons");
const SITE = require("../../content/site");
const profile = require("../../content/profile");

/* ---------------------------------------------------------------------------
   Küçük parçalar
   --------------------------------------------------------------------------- */
function fill(str, n) { return String(str).replace("{n}", n); }

function extLink(href, html, cls, lang, extraAttrs) {
  return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener"' + (extraAttrs || "") + ">" +
         html + '<span class="sr-only"> ' + esc(SITE[lang].newTab) + "</span></a>";
}

function tagList(tags, lang, max) {
  const list = (L(tags, lang) || []).slice(0, max || 99);
  if (!list.length) return "";
  return '<ul class="tags" aria-label="' + esc(SITE[lang].tagsLabel) + '">' +
    list.map(function (t) { return '<li class="tag">' + esc(t) + "</li>"; }).join("") + "</ul>";
}

function img(src, alt, width, height, opts) {
  opts = opts || {};
  return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + width + '" height="' + height + '"' +
    (opts.eager ? (opts.priority ? ' fetchpriority="high"' : "") : ' loading="lazy"') + ' decoding="async">';
}

/* Proje dış bağlantıları: kartta küçük, detayda düğme olarak */
function projectLinks(p, lang, style) {
  const t = SITE[lang];
  return p.links.map(function (link) {
    if (style === "buttons") {
      const label = link.type === "play" ? icons.googleplay + esc(t.googlePlay) : esc(t.visitSite);
      const cls = link.type === "play" ? "btn btn--secondary" : "btn btn--primary";
      return extLink(link.url, label + icons.external, cls, lang);
    }
    const label = link.type === "play" ? "Google Play" : esc(link.label);
    return extLink(link.url, label + icons.external, "pcard__ext", lang);
  }).join("");
}

function projectCard(p, lang, opts) {
  opts = opts || {};
  const t = SITE[lang];
  const h = "h" + (opts.level || 3);
  const phone = p.cover.kind === "phone";
  return [
    '<article class="pcard" data-platforms="' + p.platforms.join(" ") + '">',
    '  <div class="pcard__media' + (phone ? " pcard__media--phone" : "") + '">' +
        img(p.cover.src, L(p.cover.alt, lang), p.cover.width, p.cover.height, { eager: opts.eager }) + "</div>",
    '  <div class="pcard__body">',
    '    <p class="pcard__platform">' + esc(L(p.platformLabel, lang)) + "</p>",
    "    <" + h + ' class="pcard__title">' + esc(p.name) + "</" + h + ">",
    '    <p class="pcard__summary">' + esc(L(p.summary, lang)) + "</p>",
    "    " + tagList(p.tags, lang, 3),
    '    <div class="pcard__actions">',
    '      <a class="pcard__more" href="' + PATHS[lang].project(p.slug) + '">' + esc(t.viewProject) +
          '<span class="sr-only">: ' + esc(p.name) + "</span>" + icons.arrow + "</a>",
    '      <span class="pcard__links">' + projectLinks(p, lang, "small") + "</span>",
    "    </div>",
    "  </div>",
    "</article>"
  ].join("\n");
}

function postItem(post, lang, level) {
  const t = SITE[lang].blog;
  const h = "h" + (level || 2);
  const date = post.date
    ? '<time datetime="' + post.date + '">' + esc(formatDate(post.date, lang)) + "</time>"
    : "<span>" + esc(t.noDate) + "</span>";
  return [
    '<article class="post-item">',
    '  <p class="post-meta">' + (post.draft ? '<span class="badge">' + esc(t.draftBadge) + "</span>" : "") +
        "<span>" + esc(post.category) + "</span>" + date + "<span>" + esc(fill(t.readingTime, post.minutes)) + "</span></p>",
    "  <" + h + ' class="post-item__title"><a href="' + PATHS[lang].post(post.slug) + '">' + esc(post.title) + "</a></" + h + ">",
    '  <p class="post-item__desc">' + esc(post.description) + "</p>",
    "</article>"
  ].join("\n");
}

function breadcrumb(lang, items) {
  return '<nav class="breadcrumb" aria-label="' + esc(SITE[lang].breadcrumb) + '"><ol>' +
    items.map(function (it, i) {
      return i === items.length - 1
        ? '<li><span aria-current="page">' + esc(it.label) + "</span></li>"
        : '<li><a href="' + it.href + '">' + esc(it.label) + "</a></li>";
    }).join("") + "</ol></nav>";
}

function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(function (it, i) {
      return { "@type": "ListItem", position: i + 1, name: it.label, item: abs(it.href) };
    })
  };
}

function personLd(lang, extended) {
  const person = {
    "@type": "Person",
    "@id": SITE_URL + "/#person",
    name: profile.name,
    url: abs(PATHS[lang].home),
    image: abs(profile.photo.src),
    sameAs: profile.links.map(function (l) { return l.url; })
  };
  if (extended) {
    person.jobTitle = L(profile.experience[0].title, lang);
    person.alumniOf = profile.education
      .map(function (e) { return L(e.school, lang); })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .map(function (name) { return { "@type": "CollegeOrUniversity", name: name }; });
  }
  return person;
}

/* ---------------------------------------------------------------------------
   Ana sayfa
   --------------------------------------------------------------------------- */
function home(lang, data) {
  const t = SITE[lang];
  const c = t.pages.home;
  const P = PATHS[lang];
  const featured = data.projects.filter(function (p) { return p.featured; });
  const posts = data.posts.filter(function (p) { return p.lang === lang && !p.draft; }).slice(0, 3);
  const bySlug = function (s) { return data.projects.find(function (p) { return p.slug === s; }); };

  const social = profile.links.map(function (l) {
    return '<li><a class="icon-btn" href="' + esc(l.url) + '" target="_blank" rel="noopener" aria-label="' +
      esc(l.label + " " + t.newTab) + '" title="' + esc(l.label) + '">' + icons[l.key] + "</a></li>";
  }).join("");

  const contactItems = [
    '<li><span class="contact-list__label">' + icons.mail + esc(c.contactLabels.email) + '</span><a class="contact-list__value" id="mail-link" href="#' + ANCHORS[lang].contact + '" data-u="' + esc(profile.contact.emailUser) + '" data-d="' + esc(profile.contact.emailDomain) + '"><span id="mail-text">' + esc(c.jsNeeded) + "</span></a></li>",
    '<li><span class="contact-list__label">' + icons.phone + esc(c.contactLabels.phone) + '</span><a class="contact-list__value" id="tel-link" href="#' + ANCHORS[lang].contact + '" data-p="' + esc(profile.contact.phone) + '"><span id="tel-text">' + esc(c.jsNeeded) + "</span></a></li>"
  ].concat(profile.links.map(function (l) {
    return '<li><span class="contact-list__label">' + icons[l.key] + esc(c.contactLabels[l.key]) + "</span>" +
      extLink(l.url, esc(c.contactValues[l.key]), "contact-list__value", lang) + "</li>";
  })).join("\n");

  const body = [
    /* 1. Tanıtım */
    '<section class="intro" aria-labelledby="intro-title">',
    '  <div class="wrap intro__grid">',
    '    <div class="intro__text">',
    '      <h1 class="intro__name" id="intro-title">' + esc(profile.name) + "</h1>",
    '      <p class="intro__lead">' + esc(L(profile.intro, lang)) + "</p>",
    '      <div class="intro__actions">',
    '        <a class="btn btn--primary" href="' + P.projects + '">' + esc(c.ctaProjects) + icons.arrow + "</a>",
    '        <a class="btn btn--secondary" href="#' + ANCHORS[lang].contact + '">' + esc(c.ctaContact) + "</a>",
    "      </div>",
    '      <ul class="social" aria-label="' + esc(c.socialLabel) + '">' + social + "</ul>",
    "    </div>",
    '    <div class="intro__photo">' + img(profile.photo.src, L(profile.photo.alt, lang), profile.photo.width, profile.photo.height, { eager: true, priority: true }) + "</div>",
    "  </div>",
    "</section>",

    /* 2. Öne çıkan projeler */
    '<section class="section" aria-labelledby="featured-title">',
    '  <div class="wrap">',
    '    <h2 class="section-title" id="featured-title">' + esc(c.featuredTitle) + "</h2>",
    '    <div class="card-grid">',
    featured.map(function (p) { return projectCard(p, lang, { level: 3 }); }).join("\n"),
    "    </div>",
    '    <p class="section-more"><a class="btn btn--secondary" href="' + P.projects + '">' + esc(t.allProjects) + " (" + data.projects.length + ")" + icons.arrow + "</a></p>",
    "  </div>",
    "</section>",

    /* 3. Sektör deneyimi → ürün */
    '<section class="section section--tint" aria-labelledby="sector-title">',
    '  <div class="wrap sector">',
    '    <div class="sector__intro">',
    '      <h2 class="section-title" id="sector-title">' + esc(c.sectorTitle) + "</h2>",
    '      <p class="section-lead">' + esc(c.sectorLead) + "</p>",
    "    </div>",
    '    <ul class="sector__list">',
    c.sectorItems.map(function (item) {
      const p = bySlug(item.project);
      return '<li class="sector__item"><h3>' + esc(item.title) + "</h3><p>" + esc(item.text) + '</p><a class="link-arrow" href="' + P.project(p.slug) + '">' + esc(p.name) + icons.arrow + "</a></li>";
    }).join("\n"),
    "    </ul>",
    "  </div>",
    "</section>",

    /* 4. Son yazılar: yalnızca yayımlanmış yazı varsa */
    posts.length ? [
      '<section class="section" aria-labelledby="posts-title">',
      '  <div class="wrap">',
      '    <h2 class="section-title" id="posts-title">' + esc(t.blog.latest) + "</h2>",
      '    <div class="post-list post-list--grid">',
      posts.map(function (p) { return postItem(p, lang, 3); }).join("\n"),
      "    </div>",
      '    <p class="section-more"><a class="btn btn--secondary" href="' + P.blog + '">' + esc(t.blog.all) + icons.arrow + "</a></p>",
      "  </div>",
      "</section>"
    ].join("\n") : "",

    /* 5. İletişim */
    '<section class="section section--tint contact" id="' + ANCHORS[lang].contact + '" aria-labelledby="contact-title">',
    '  <div class="wrap contact__grid">',
    '    <div class="contact__intro">',
    '      <h2 class="section-title" id="contact-title">' + esc(c.contactTitle) + "</h2>",
    '      <p class="section-lead">' + esc(c.contactText) + "</p>",
    '      <div class="contact__actions">',
    '        <a class="btn btn--primary" id="mail-cta" href="#' + ANCHORS[lang].contact + '" data-subject="' + esc(c.mailSubject) + '">' + icons.mail + esc(c.sendMail) + "</a>",
    '        <a class="btn btn--secondary" href="' + profile.cv[lang] + '" download type="application/pdf">' + icons.download + esc(t.cvLong) + "</a>",
    "      </div>",
    "    </div>",
    '    <ul class="contact-list">',
    contactItems,
    "    </ul>",
    "  </div>",
    "</section>"
  ].filter(Boolean).join("\n");

  /* Eski tek sayfalık sitenin bölüm bağlantıları (ör. /#sertifikalar) */
  const legacy = "(function(){var m=" + JSON.stringify(LEGACY_HASHES[lang]) +
    ";var h=decodeURIComponent(location.hash.slice(1));if(m[h])location.replace(m[h]);})();";

  return {
    lang: lang,
    path: P.home,
    alt: { tr: PATHS.tr.home, en: PATHS.en.home },
    nav: "home",
    title: c.title,
    description: c.description,
    headScript: legacy,
    jsonld: [{
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": SITE_URL + "/#website", url: abs(P.home), name: profile.name, inLanguage: lang },
        personLd(lang, false)
      ]
    }],
    body: body
  };
}

/* ---------------------------------------------------------------------------
   Projeler listesi
   --------------------------------------------------------------------------- */
function projects(lang, data) {
  const t = SITE[lang];
  const c = t.pages.projects;
  const f = t.filters;
  const body = [
    '<div class="wrap page">',
    '  <header class="page-head">',
    "    <h1>" + esc(c.heading) + "</h1>",
    '    <p class="page-lead">' + esc(c.lead) + "</p>",
    "  </header>",
    '  <div class="filters" data-filters hidden>',
    '    <div class="filters__group" role="group" aria-label="' + esc(f.label) + '">',
    '      <button class="filter" type="button" data-filter="all" aria-pressed="true">' + esc(f.all) + "</button>",
    '      <button class="filter" type="button" data-filter="web" aria-pressed="false">' + esc(f.web) + "</button>",
    '      <button class="filter" type="button" data-filter="mobile" aria-pressed="false">' + esc(f.mobile) + "</button>",
    "    </div>",
    '    <p class="filters__status" id="filter-status" role="status" data-template="' + esc(f.count) + '">' + esc(fill(f.count, data.projects.length)) + "</p>",
    "  </div>",
    '  <div class="card-grid" id="project-grid">',
    data.projects.map(function (p, i) { return projectCard(p, lang, { level: 2, eager: i < 3 }); }).join("\n"),
    "  </div>",
    "</div>"
  ].join("\n");

  return {
    lang: lang,
    path: PATHS[lang].projects,
    alt: { tr: PATHS.tr.projects, en: PATHS.en.projects },
    nav: "projects",
    title: c.title,
    description: c.description,
    body: body
  };
}

/* ---------------------------------------------------------------------------
   Proje detayı
   --------------------------------------------------------------------------- */
function project(lang, p, data) {
  const t = SITE[lang];
  const s = t.projectSections;
  const P = PATHS[lang];
  const crumbs = [
    { href: P.home, label: t.home },
    { href: P.projects, label: t.nav.projects },
    { href: P.project(p.slug), label: p.name }
  ];
  const wide = p.gallery.filter(function (g) { return g.kind !== "phone"; });
  const phones = p.gallery.filter(function (g) { return g.kind === "phone"; });
  const related = (p.related || []).map(function (slug) {
    return data.projects.find(function (x) { return x.slug === slug; });
  }).filter(Boolean);
  const relatedPosts = data.posts.filter(function (post) {
    return post.lang === lang && post.related.indexOf(p.slug) !== -1 && (!post.draft || data.drafts);
  });

  const figure = function (g, cls, eager) {
    return '<figure class="shot ' + cls + '">' + img(g.src, L(g.alt, lang), g.width, g.height, { eager: eager, priority: eager }) +
      (g.caption ? "<figcaption>" + esc(L(g.caption, lang)) + "</figcaption>" : "") + "</figure>";
  };

  const section = function (title, html) {
    return html ? "<section><h2>" + esc(title) + "</h2>" + html + "</section>" : "";
  };
  const para = function (v) { return v ? "<p>" + esc(L(v, lang)) + "</p>" : ""; };
  const list = function (v) {
    const items = L(v, lang) || [];
    return items.length ? "<ul>" + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "";
  };
  /* Açıklaması bilinen teknolojiler satır olarak, diğerleri etiket olarak.
     Gerekçesi bilinmeyen bir tercihe açıklama uydurulmaz. */
  const techName = function (x) { return lang === "en" && x.nameEn ? x.nameEn : x.name; };
  const plainTech = (p.tech || []).filter(function (x) { return !x.note; });
  const notedTech = (p.tech || []).filter(function (x) { return x.note; });
  const tech = para(p.techSummary) +
    (plainTech.length ? '<ul class="tags tech-tags">' + plainTech.map(function (x) { return '<li class="tag">' + esc(techName(x)) + "</li>"; }).join("") + "</ul>" : "") +
    (notedTech.length ? '<dl class="tech-list">' + notedTech.map(function (x) {
      return '<div class="tech-list__row"><dt>' + esc(techName(x)) + "</dt><dd>" + esc(L(x.note, lang)) + "</dd></div>";
    }).join("") + "</dl>" : "");

  const body = [
    '<article class="wrap page project-page">',
    "  " + breadcrumb(lang, crumbs),
    '  <header class="page-head project-head">',
    p.icon ? '    <img class="project-head__icon" src="' + p.icon + '" alt="" width="64" height="64">' : "",
    '    <p class="page-kicker">' + esc(L(p.platformLabel, lang)) + "</p>",
    "    <h1>" + esc(p.name) + "</h1>",
    '    <p class="page-lead">' + esc(L(p.summary, lang)) + "</p>",
    "    " + tagList(p.tags, lang),
    '    <div class="project-head__actions">' + projectLinks(p, lang, "buttons") + "</div>",
    "  </header>",
    wide.length ? "  " + figure(wide[0], "shot--wide", true) : "",
    '  <div class="project-body' + (phones.length ? " project-body--aside" : "") + '">',
    '    <div class="prose">',
    section(s.purpose, para(p.purpose)),
    section(s.problem, para(p.problem)),
    section(s.role, para(p.role)),
    section(s.features, list(p.features)),
    wide.length > 1 ? section(s.screens, wide.slice(1).map(function (g) { return figure(g, "shot--wide", false); }).join("")) : "",
    section(s.tech, tech),
    "    </div>",
    phones.length ? '    <aside class="project-shots" aria-label="' + esc(s.screens) + '">' + phones.map(function (g) { return figure(g, "shot--phone", !wide.length); }).join("") + "</aside>" : "",
    "  </div>",
    related.length || relatedPosts.length ? [
      '  <div class="project-related">',
      relatedPosts.length ? '    <section aria-labelledby="related-posts"><h2 id="related-posts">' + esc(s.posts) + '</h2><div class="post-list">' +
        relatedPosts.map(function (post) { return postItem(post, lang, 3); }).join("") + "</div></section>" : "",
      related.length ? '    <section aria-labelledby="related-projects"><h2 id="related-projects">' + esc(s.related) + '</h2><div class="card-grid card-grid--compact">' +
        related.map(function (x) { return projectCard(x, lang, { level: 3 }); }).join("") + "</div></section>" : "",
      "  </div>"
    ].join("\n") : "",
    "</article>"
  ].filter(Boolean).join("\n");

  return {
    lang: lang,
    path: P.project(p.slug),
    alt: { tr: PATHS.tr.project(p.slug), en: PATHS.en.project(p.slug) },
    nav: "projects",
    title: p.name + " — " + profile.name,
    description: L(p.summary, lang),
    jsonld: [breadcrumbLd(crumbs)],
    body: body
  };
}

/* ---------------------------------------------------------------------------
   Hakkımda
   --------------------------------------------------------------------------- */
function about(lang) {
  const t = SITE[lang];
  const c = t.pages.about;
  const A = ANCHORS[lang];

  const text = L(profile.about, lang).map(function (b) {
    return b.quote ? "<blockquote><p>" + esc(b.quote) + "</p></blockquote>" : "<p>" + esc(b.text) + "</p>";
  }).join("\n");

  const experience = profile.experience.map(function (e) {
    return [
      '<li class="timeline__item">',
      '  <p class="timeline__years">' + esc(L(e.years, lang)) + "</p>",
      '  <div class="timeline__body">',
      "    <h3>" + esc(L(e.title, lang)) + "</h3>",
      e.org ? '    <p class="timeline__org">' + esc(L(e.org, lang)) + "</p>" : "",
      "    <p>" + esc(L(e.text, lang)) + "</p>",
      "    " + tagList(e.tags, lang),
      "  </div>",
      "</li>"
    ].filter(Boolean).join("\n");
  }).join("\n");

  const education = profile.education.map(function (e) {
    return [
      '<li class="timeline__item">',
      '  <p class="timeline__years">' + esc(e.years) + "</p>",
      '  <div class="timeline__body">',
      "    <h3>" + esc(L(e.title, lang)) + "</h3>",
      '    <p class="timeline__org">' + esc(L(e.school, lang)) + "</p>",
      "    <p>" + esc(L(e.text, lang)) + "</p>",
      "  </div>",
      "</li>"
    ].join("\n");
  }).join("\n");

  const skills = profile.skills.map(function (g) {
    return '<div class="skill-group"><h3>' + esc(L(g.title, lang)) + '</h3><p class="skill-group__note">' + esc(L(g.note, lang)) + "</p>" +
      '<ul class="tags">' + g.items.map(function (x) { return '<li class="tag">' + esc(L(x, lang)) + "</li>"; }).join("") + "</ul></div>";
  }).join("\n");

  const certs = profile.certificates.map(function (x) {
    return '<li class="cert"><h3>' + esc(L(x.name, lang)) + '</h3><p class="cert__issuer">' + esc(L(x.issuer, lang)) + "</p><p>" + esc(L(x.text, lang)) + "</p></li>";
  }).join("\n");

  const toc = [
    [A.experience, c.experience], [A.education, c.education], [A.skills, c.skills], [A.certificates, c.certificates]
  ].map(function (x) { return '<li><a href="#' + x[0] + '">' + esc(x[1]) + "</a></li>"; }).join("");

  const body = [
    '<div class="wrap page about-page">',
    '  <header class="about-head">',
    '    <div class="about-head__text">',
    "      <h1>" + esc(c.heading) + "</h1>",
    '      <div class="prose about-text">' + text + "</div>",
    "    </div>",
    '    <div class="about-head__photo">' + img(profile.photo.src, L(profile.photo.alt, lang), profile.photo.width, profile.photo.height, { eager: true }) + "</div>",
    "  </header>",
    '  <nav class="on-page" aria-label="' + esc(c.onThisPage) + '"><ul>' + toc + "</ul></nav>",
    '  <section class="about-section" id="' + A.experience + '" aria-labelledby="' + A.experience + '-title"><h2 id="' + A.experience + '-title">' + esc(c.experience) + '</h2><ol class="timeline">' + experience + "</ol></section>",
    '  <section class="about-section" id="' + A.education + '" aria-labelledby="' + A.education + '-title"><h2 id="' + A.education + '-title">' + esc(c.education) + '</h2><ol class="timeline">' + education + "</ol></section>",
    '  <section class="about-section" id="' + A.skills + '" aria-labelledby="' + A.skills + '-title"><h2 id="' + A.skills + '-title">' + esc(c.skills) + '</h2><p class="section-lead">' + esc(c.skillsLead) + '</p><div class="skills">' + skills + "</div></section>",
    '  <section class="about-section" id="' + A.certificates + '" aria-labelledby="' + A.certificates + '-title"><h2 id="' + A.certificates + '-title">' + esc(c.certificates) + '</h2><ul class="certs">' + certs + '</ul><p class="note">' + esc(c.certNote) + "</p></section>",
    '  <section class="cta-band" aria-labelledby="about-cta"><h2 id="about-cta">' + esc(c.ctaTitle) + "</h2><p>" + esc(c.ctaText) + "</p>" +
      '<div class="cta-band__actions"><a class="btn btn--primary" href="' + profile.cv[lang] + '" download type="application/pdf">' + icons.download + esc(t.cvLong) + '</a><a class="btn btn--secondary" href="' + PATHS[lang].home + "#" + ANCHORS[lang].contact + '">' + esc(t.pages.home.ctaContact) + "</a></div></section>",
    "</div>"
  ].join("\n");

  return {
    lang: lang,
    path: PATHS[lang].about,
    alt: { tr: PATHS.tr.about, en: PATHS.en.about },
    nav: "about",
    ogType: "profile",
    title: c.title,
    description: c.description,
    jsonld: [{
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: abs(PATHS[lang].about),
      inLanguage: lang,
      mainEntity: personLd(lang, true)
    }],
    body: body
  };
}

/* ---------------------------------------------------------------------------
   Blog listesi
   --------------------------------------------------------------------------- */
function blogIndex(lang, data) {
  const t = SITE[lang];
  const c = t.pages.blog;
  const published = data.posts.filter(function (p) { return p.lang === lang && !p.draft; });
  const drafts = data.drafts ? data.posts.filter(function (p) { return p.lang === lang && p.draft; }) : [];
  const body = [
    '<div class="wrap page blog-page">',
    '  <header class="page-head">',
    "    <h1>" + esc(c.heading) + "</h1>",
    '    <p class="page-lead">' + esc(c.lead) + "</p>",
    published.length ? '    <p class="rss-link"><a href="' + PATHS[lang].rss + '">' + icons.rss + esc(t.blog.rss) + "</a></p>" : "",
    "  </header>",
    published.length
      ? '  <div class="post-list">' + published.map(function (p) { return postItem(p, lang, 2); }).join("\n") + "</div>"
      : '  <div class="empty-state"><p><strong>' + esc(t.blog.empty) + "</strong></p><p>" + esc(t.blog.emptyMore) +
        '</p><p><a class="btn btn--secondary" href="' + PATHS[lang].projects + '">' + esc(t.allProjects) + icons.arrow + "</a></p></div>",
    drafts.length
      ? '  <section class="drafts" aria-labelledby="drafts-title"><h2 id="drafts-title">' + esc(t.blog.draftsTitle) + '</h2><div class="post-list">' +
        drafts.map(function (p) { return postItem(p, lang, 3); }).join("\n") + "</div></section>"
      : "",
    "</div>"
  ].filter(Boolean).join("\n");

  return {
    lang: lang,
    path: PATHS[lang].blog,
    alt: { tr: PATHS.tr.blog, en: PATHS.en.blog },
    nav: "blog",
    title: c.title,
    description: c.description,
    rss: published.length > 0,
    body: body
  };
}

/* ---------------------------------------------------------------------------
   Blog yazısı
   --------------------------------------------------------------------------- */
function post(lang, p, rendered, data) {
  const t = SITE[lang];
  const b = t.blog;
  const P = PATHS[lang];
  const o = lang === "tr" ? "en" : "tr";
  const crumbs = [
    { href: P.home, label: t.home },
    { href: P.blog, label: t.nav.blog },
    { href: P.post(p.slug), label: p.title }
  ];

  /* Çeviri yalnızca karşı taraf da görünürse (yayımlanmış ya da önizleme) bağlanır */
  const translation = p.translation && data.posts.find(function (x) {
    return x.lang === o && x.slug === p.translation && (!x.draft || data.drafts);
  });
  const alt = {};
  alt[lang] = P.post(p.slug);
  alt[o] = translation ? PATHS[o].post(translation.slug) : null;
  const altFallback = {};
  altFallback[o] = PATHS[o].blog;

  /* İçindekiler: ### başlıkları üstündeki ## başlığının altında iç içe liste
     olur; aynı listede kalsalardı ## numaraları (1, 2, 3, 8…) atlardı. */
  const showToc = rendered.headings.filter(function (h) { return h.level === 2; }).length >= 3;
  const tocGroups = [];
  rendered.headings.forEach(function (h) {
    if (h.level === 2 || (h.level === 3 && !tocGroups.length)) tocGroups.push({ h: h, children: [] });
    else if (h.level === 3) tocGroups[tocGroups.length - 1].children.push(h);
  });
  const tocLink = function (h) { return '<a href="#' + h.id + '">' + esc(h.text) + "</a>"; };
  const toc = showToc
    ? '<nav class="toc" aria-labelledby="toc-title"><h2 id="toc-title">' + esc(b.toc) + "</h2><ol>" +
      tocGroups.map(function (g) {
        return "<li>" + tocLink(g.h) + (g.children.length
          ? "<ul>" + g.children.map(function (c) { return "<li>" + tocLink(c) + "</li>"; }).join("") + "</ul>"
          : "") + "</li>";
      }).join("") + "</ol></nav>"
    : "";

  const related = p.related.map(function (slug) { return data.projects.find(function (x) { return x.slug === slug; }); }).filter(Boolean);

  const meta = [
    p.date ? '<span>' + esc(b.published) + ': <time datetime="' + p.date + '">' + esc(formatDate(p.date, lang)) + "</time></span>" : "<span>" + esc(b.noDate) + "</span>",
    p.updated ? "<span>" + esc(b.updated) + ': <time datetime="' + p.updated + '">' + esc(formatDate(p.updated, lang)) + "</time></span>" : "",
    "<span>" + esc(fill(b.readingTime, p.minutes)) + "</span>"
  ].filter(Boolean).join("");

  const body = [
    '<article class="wrap page post">',
    "  " + breadcrumb(lang, crumbs),
    '  <header class="post-head">',
    '    <p class="page-kicker">' + esc(p.category) + "</p>",
    "    <h1>" + esc(p.title) + "</h1>",
    '    <p class="page-lead">' + esc(p.description) + "</p>",
    '    <p class="post-meta">' + meta + "</p>",
    "  </header>",
    p.draft && rendered.notes.length ? '  <p class="review-summary">' + esc(fill(b.notesSummary, rendered.notes.length)) + "</p>" : "",
    toc ? "  " + toc : "",
    '  <div class="prose post-body">',
    rendered.html,
    "  </div>",
    related.length ? '  <aside class="post-related" aria-labelledby="post-related-title"><h2 id="post-related-title">' +
      esc(related.length > 1 ? b.relatedProjects : b.relatedProject) + '</h2><div class="card-grid card-grid--compact">' +
      related.map(function (x) { return projectCard(x, lang, { level: 3 }); }).join("") + "</div></aside>" : "",
    '  <p class="post-back"><a class="link-arrow link-arrow--back" href="' + P.blog + '">' + icons.arrow + esc(b.all) + "</a></p>",
    "</article>"
  ].filter(Boolean).join("\n");

  return {
    lang: lang,
    path: P.post(p.slug),
    alt: alt,
    altFallback: altFallback,
    nav: "blog",
    ogType: "article",
    article: { published: p.date, modified: p.updated || p.date, section: p.category },
    title: p.title + " — " + profile.name,
    ogTitle: p.title,
    description: p.description,
    noindex: p.draft,
    rss: !p.draft,
    banner: p.draft ? esc(b.draftBanner) : "",
    jsonld: p.draft ? [] : [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        inLanguage: lang,
        datePublished: p.date,
        dateModified: p.updated || p.date,
        articleSection: p.category,
        url: abs(P.post(p.slug)),
        mainEntityOfPage: abs(P.post(p.slug)),
        author: { "@type": "Person", "@id": SITE_URL + "/#person", name: profile.name, url: abs(PATHS[lang].home) }
      },
      breadcrumbLd(crumbs)
    ],
    body: body
  };
}

/* ---------------------------------------------------------------------------
   404: iki dilli tek sayfa (Vercel bulunamayan her adreste /404.html'i gösterir)
   --------------------------------------------------------------------------- */
function notFound() {
  const tr = SITE.tr.pages.notFound;
  const en = SITE.en.pages.notFound;
  return {
    lang: "tr",
    path: null,
    alt: { tr: PATHS.tr.home, en: PATHS.en.home },
    nav: null,
    title: tr.title,
    description: tr.text,
    noindex: true,
    body: [
      '<div class="wrap page not-found">',
      "  <h1>" + esc(tr.heading) + "</h1>",
      '  <p class="page-lead">' + esc(tr.text) + "</p>",
      '  <p><a class="btn btn--primary" href="' + PATHS.tr.home + '">' + esc(tr.back) + "</a></p>",
      '  <div lang="en" class="not-found__en">',
      "    <h2>" + esc(en.heading) + "</h2>",
      "    <p>" + esc(en.text) + "</p>",
      '    <p><a class="btn btn--secondary" href="' + PATHS.en.home + '">' + esc(en.back) + "</a></p>",
      "  </div>",
      "</div>"
    ].join("\n")
  };
}

module.exports = { home, projects, project, about, blogIndex, post, notFound, projectCard };
