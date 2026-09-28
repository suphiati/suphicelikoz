#!/usr/bin/env node
/* =============================================================================
   Site üretici  --  node tools/build-site.js
   -----------------------------------------------------------------------------
   content/ altındaki verilerden (profil, projeler, blog yazıları) ve
   src/templates/ şablonlarından statik HTML üretir. Bağımlılık yok: yalnızca
   Node standart kütüphanesi. "npm install" gerekmez.

   Kullanım
     node tools/build-site.js             yayın çıktısı -> dist/  (taslaklar HARİÇ)
     node tools/build-site.js --drafts    önizleme -> .preview/   (taslaklar dahil,
                                          "TASLAK" şeridi ve noindex ile)
     node tools/build-site.js --out <klasör>

   Vercel, vercel.json'daki "buildCommand" ile bu betiği çalıştırır ve
   dist/ klasörünü yayınlar.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

/* Önizleme sunucusu her derlemede içerik dosyalarını yeniden okusun diye
   content/ ve src/ modülleri her derlemede önbellekten atılıp taze yüklenir. */
function loadFresh() {
  Object.keys(require.cache).forEach(function (k) {
    if (k.startsWith(path.join(ROOT, "content") + path.sep) || k.startsWith(path.join(ROOT, "src") + path.sep)) delete require.cache[k];
  });
  return function (rel) { return require(path.join(ROOT, rel)); };
}

/* --- Görsel ölçüsü (PNG / JPEG / WebP / GIF) ------------------------------ */
function imageSize(file) {
  let buf;
  try { buf = fs.readFileSync(file); } catch (e) { return null; }
  if (buf.length < 30) return null;
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.toString("ascii", 0, 3) === "GIF") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") { const v = buf.readUInt32LE(21); return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
    if (kind === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

function assetFile(src) {
  if (!/^\/assets\//.test(src)) return null;
  return path.join(ROOT, src.split("?")[0]);
}

/* --- Proje verisini doğrula ----------------------------------------------- */
function validateProjects(projects) {
  const errors = [];
  const slugs = projects.map(function (p) { return p.slug; });
  const need = function (p, cond, msg) { if (!cond) errors.push(p.slug + ": " + msg); };
  projects.forEach(function (p) {
    need(p, /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug || ""), "slug yalnızca küçük harf, rakam ve tire içermeli");
    need(p, slugs.indexOf(p.slug) === slugs.lastIndexOf(p.slug), "slug tekrar ediyor");
    need(p, p.name, "name eksik");
    need(p, Array.isArray(p.platforms) && p.platforms.length && p.platforms.every(function (x) { return x === "web" || x === "mobile"; }), "platforms yalnızca 'web' ve/veya 'mobile' olabilir");
    ["tr", "en"].forEach(function (lang) {
      need(p, p.summary && p.summary[lang], "summary." + lang + " eksik");
      need(p, p.platformLabel && p.platformLabel[lang], "platformLabel." + lang + " eksik");
      need(p, p.tags && Array.isArray(p.tags[lang]) && p.tags[lang].length >= 1 && p.tags[lang].length <= 3, "tags." + lang + " 1–3 etiket olmalı");
      need(p, p.purpose && p.purpose[lang], "purpose." + lang + " eksik");
      need(p, p.role && p.role[lang], "role." + lang + " eksik");
      need(p, p.features && Array.isArray(p.features[lang]) && p.features[lang].length, "features." + lang + " eksik");
      need(p, p.cover && p.cover.alt && p.cover.alt[lang], "cover.alt." + lang + " eksik");
      (p.gallery || []).forEach(function (g, i) { need(p, g.alt && g.alt[lang], "gallery[" + i + "].alt." + lang + " eksik"); });
    });
    need(p, Array.isArray(p.links) && p.links.length, "en az bir dış bağlantı (links) gerekli");
    (p.links || []).forEach(function (l) {
      need(p, (l.type === "web" || l.type === "play") && /^https:\/\//.test(l.url || ""), "geçersiz bağlantı: " + JSON.stringify(l));
    });
    [p.cover].concat(p.gallery || []).concat(p.icon ? [{ src: p.icon }] : []).forEach(function (g) {
      if (!g || !g.src) { errors.push(p.slug + ": görsel yolu eksik"); return; }
      const f = assetFile(g.src);
      need(p, f && fs.existsSync(f), "görsel bulunamadı: " + g.src);
      if (f && fs.existsSync(f) && g.width) {
        const size = imageSize(f);
        need(p, size && size.width === g.width && size.height === g.height,
          "görsel ölçüsü uyuşmuyor: " + g.src + " (dosya " + (size ? size.width + "x" + size.height : "?") + ", kayıt " + g.width + "x" + g.height + ")");
      }
    });
    (p.related || []).forEach(function (s) { need(p, slugs.indexOf(s) !== -1 && s !== p.slug, "related içinde geçersiz slug: " + s); });
  });
  const featured = projects.filter(function (p) { return p.featured; }).length;
  if (featured < 1 || featured > 3) errors.push("Ana sayfada 1–3 öne çıkan proje olmalı (şu an " + featured + ").");
  if (errors.length) throw new Error("Proje verisinde hata:\n  - " + errors.join("\n  - "));
}

/* --- Güvenli çıktı klasörü --------------------------------------------------
   Derleme çıktı klasörünü önce siler. Yanlış bir --out değeri kaynakları
   silmesin diye proje kökü ve kaynak klasörleri reddedilir. */
function safeOutDir(out) {
  const abs = path.resolve(ROOT, out);
  const rel = path.relative(ROOT, abs);
  const inside = rel && !rel.startsWith("..") && !path.isAbsolute(rel);
  if (!rel || (!inside && (ROOT + path.sep).startsWith(abs + path.sep))) {
    throw new Error("Çıktı klasörü proje kökü ya da onu kapsayan bir klasör olamaz: " + abs);
  }
  if (inside && ["content", "src", "tools", "assets", ".git"].indexOf(rel.split(path.sep)[0]) !== -1) {
    throw new Error("Çıktı klasörü kaynak klasörlerinden biri olamaz: " + abs);
  }
  return abs;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(function (e) {
    if (e.name.startsWith(".")) return; /* .build-stamp gibi iç dosyalar yayınlanmaz */
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  });
}

/* --- XML --------------------------------------------------------------------- */
function xml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function rfc822(iso) {
  const d = new Date(iso + "T09:00:00Z");
  return d.toUTCString();
}

/* --- Ana derleme ------------------------------------------------------------ */
function build(options) {
  options = options || {};
  const drafts = !!options.drafts;
  const outDir = safeOutDir(options.out || (drafts ? ".preview" : "dist"));

  const req = loadFresh();
  const routes = req("src/lib/routes.js");
  const { renderMarkdown } = req("src/lib/markdown.js");
  const { loadPosts } = req("src/lib/posts.js");
  const { layout } = req("src/templates/layout.js");
  const pages = req("src/templates/pages.js");
  const SITE = req("content/site.js");
  const profile = req("content/profile.js");
  const projects = req("content/projects.js");

  validateProjects(projects);
  [profile.photo.src].concat([profile.cv.tr, profile.cv.en]).forEach(function (src) {
    if (!fs.existsSync(assetFile(src))) throw new Error("Dosya bulunamadı: " + src);
  });

  const allPosts = loadPosts(ROOT, projects.map(function (p) { return p.slug; }), options.blogDir);
  const posts = allPosts.filter(function (p) { return drafts || !p.draft; });
  const data = { projects: projects, posts: posts, drafts: drafts };

  /* Yazıları HTML'e çevir */
  const rendered = {};
  const errors = [];
  posts.forEach(function (p) {
    try {
      const r = renderMarkdown(p.body, {
        resolveProject: function (slug) {
          return projects.some(function (x) { return x.slug === slug; }) ? routes.PATHS[p.lang].project(slug) : null;
        },
        imageSize: function (src) { const f = assetFile(src); return f ? imageSize(f) : null; },
        showNotes: drafts && p.draft,
        noteLabel: SITE[p.lang].blog.noteLabel,
        newTabText: SITE[p.lang].newTab
      });
      if (!p.draft && r.notes.length) {
        errors.push(p.file + ": yayımlanmış yazıda " + r.notes.length + " onay notu (<!-- ONAY: ... -->) kaldı. Notları çözüp sil.");
      }
      rendered[p.lang + "/" + p.slug] = r;
    } catch (e) {
      errors.push(p.file + ": " + e.message);
    }
  });
  if (errors.length) throw new Error("Blog yazılarında hata:\n  - " + errors.join("\n  - "));

  /* Sayfaları topla */
  const out = [];
  ["tr", "en"].forEach(function (lang) {
    out.push(pages.home(lang, data));
    out.push(pages.projects(lang, data));
    projects.forEach(function (p) { out.push(pages.project(lang, p, data)); });
    out.push(pages.about(lang, data));
    out.push(pages.blogIndex(lang, data));
    posts.filter(function (p) { return p.lang === lang; }).forEach(function (p) {
      out.push(pages.post(lang, p, rendered[lang + "/" + p.slug], data));
    });
  });

  /* Yaz */
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  out.forEach(function (page) {
    const file = path.join(outDir, routes.fileFor(page.path));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, layout(page));
  });
  fs.writeFileSync(path.join(outDir, "404.html"), layout(pages.notFound()));

  copyDir(path.join(ROOT, "assets"), path.join(outDir, "assets"));
  /* Google Search Console doğrulama dosyası: kökte kalmalı */
  fs.readdirSync(ROOT).filter(function (f) { return /^google[0-9a-f]+\.html$/.test(f); }).forEach(function (f) {
    fs.copyFileSync(path.join(ROOT, f), path.join(outDir, f));
  });

  /* robots.txt: önizleme derlemesi yanlışlıkla yayınlansa bile dizine girmesin */
  fs.writeFileSync(path.join(outDir, "robots.txt"), drafts
    ? "# Taslak önizlemesi: dizine eklenmez\nUser-agent: *\nDisallow: /\n"
    : "User-agent: *\nAllow: /\n\nSitemap: " + routes.abs("/sitemap.xml") + "\n");

  /* Site haritası: yalnızca dizine eklenebilir sayfalar (taslaklar asla) */
  const indexable = out.filter(function (p) { return p.path && !p.noindex; });
  const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
  indexable.forEach(function (p) {
    sitemap.push("  <url>");
    sitemap.push("    <loc>" + xml(routes.abs(p.path)) + "</loc>");
    if (p.article && (p.article.modified || p.article.published)) sitemap.push("    <lastmod>" + (p.article.modified || p.article.published) + "</lastmod>");
    if (p.alt && p.alt.tr && p.alt.en) {
      ["tr", "en"].forEach(function (l) {
        sitemap.push('    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + xml(routes.abs(p.alt[l])) + '"/>');
      });
      sitemap.push('    <xhtml:link rel="alternate" hreflang="x-default" href="' + xml(routes.abs(p.alt.tr)) + '"/>');
    }
    sitemap.push("  </url>");
  });
  sitemap.push("</urlset>", "");
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap.join("\n"));

  /* RSS: dil başına bir akış, yalnızca yayımlanmış yazılar */
  ["tr", "en"].forEach(function (lang) {
    const items = allPosts.filter(function (p) { return p.lang === lang && !p.draft; });
    const feedUrl = routes.abs(routes.PATHS[lang].rss);
    const rss = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      "<channel>",
      "  <title>" + xml(profile.name + " — Blog") + "</title>",
      "  <link>" + xml(routes.abs(routes.PATHS[lang].blog)) + "</link>",
      "  <description>" + xml(SITE[lang].pages.blog.description) + "</description>",
      "  <language>" + (lang === "tr" ? "tr-TR" : "en-US") + "</language>",
      '  <atom:link href="' + xml(feedUrl) + '" rel="self" type="application/rss+xml"/>'];
    items.forEach(function (p) {
      const url = routes.abs(routes.PATHS[lang].post(p.slug));
      rss.push("  <item>",
        "    <title>" + xml(p.title) + "</title>",
        "    <link>" + xml(url) + "</link>",
        '    <guid isPermaLink="true">' + xml(url) + "</guid>",
        "    <pubDate>" + rfc822(p.date) + "</pubDate>",
        "    <category>" + xml(p.category) + "</category>",
        "    <description>" + xml(p.description) + "</description>",
        "  </item>");
    });
    rss.push("</channel>", "</rss>", "");
    const file = path.join(outDir, routes.PATHS[lang].rss);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, rss.join("\n"));
  });

  return {
    outDir: outDir,
    pages: out.length + 1,
    published: allPosts.filter(function (p) { return !p.draft; }).length,
    drafts: allPosts.filter(function (p) { return p.draft; }).length,
    draftSlugs: allPosts.filter(function (p) { return p.draft; }).map(function (p) { return p.lang + "/" + p.slug; })
  };
}

module.exports = { build, imageSize };

if (require.main === module) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  try {
    const t0 = Date.now();
    const r = build({ drafts: args.indexOf("--drafts") !== -1, out: outIdx !== -1 ? args[outIdx + 1] : undefined });
    console.log("Site üretildi -> " + path.relative(ROOT, r.outDir) + "/  (" + r.pages + " sayfa, " +
      r.published + " yayımlanmış yazı, " + r.drafts + " taslak " +
      (args.indexOf("--drafts") !== -1 ? "DAHİL" : "hariç") + ", " + (Date.now() - t0) + " ms)");
  } catch (e) {
    console.error("\nDERLEME BAŞARISIZ\n" + e.message + "\n");
    process.exit(1);
  }
}
