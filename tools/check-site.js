#!/usr/bin/env node
/* =============================================================================
   Site denetimi  --  node tools/check-site.js
   -----------------------------------------------------------------------------
   Siteyi geçici klasörlere üretir ve yayından önce yakalanması gereken
   hataları arar. Bağımlılık yok; internet gerekmez.

   1. Yayın çıktısı: her sayfada tek h1, atlanmayan başlık sırası, başlık ve
      açıklama, canonical, alt metin, iç bağlantılar ve #bölüm hedefleri,
      karşılıklı hreflang, geçerli JSON-LD, site haritası.
   2. Taslak sızıntısı: taslak yazının adresi, başlığı ya da onay notu yayın
      çıktısının hiçbir dosyasında (sayfa, liste, site haritası, RSS) yok.
   3. Önizleme: taslaklar görünür, noindex taşır, site haritasına girmez.
   4. Yayımlama akışı: geçici bir yayımlanmış yazıyla (TR + EN çeviri)
      liste, ana sayfa, RSS, site haritası, dil bağlantısı ve içindekiler.

   Çıkış kodu 0 = sorun yok, 1 = sorun var.
   ========================================================================== */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { build } = require("./build-site");

const ROOT = path.resolve(__dirname, "..");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "site-check-"));
const problems = [];
let checks = 0;

function ok(cond, msg) { checks++; if (!cond) problems.push(msg); return cond; }

function walk(dir, ext) {
  let out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p, ext));
    else if (!ext || p.endsWith(ext)) out.push(p);
  });
  return out;
}

function urlOf(dir, file) {
  const rel = "/" + path.relative(dir, file).split(path.sep).join("/");
  return rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
}

const redirects = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")).redirects || [];

/* Kök göreli bir adresin çıktıda bir dosyaya denk gelip gelmediği */
function resolve(dir, href) {
  const u = new URL(href, "https://site.test");
  let p = decodeURIComponent(u.pathname);
  const r = redirects.find(function (x) { return x.source === p; });
  if (r) p = new URL(r.destination, "https://site.test").pathname;
  let f = path.join(dir, p);
  if (p.endsWith("/")) f = path.join(f, "index.html");
  return fs.existsSync(f) && fs.statSync(f).isFile() ? { file: f, hash: u.hash.slice(1) } : null;
}

function ids(html) {
  const set = new Set();
  html.replace(/\sid="([^"]+)"/g, function (_, id) { set.add(id); return ""; });
  return set;
}

function attr(tag, name) {
  const m = new RegExp("\\s" + name + '="([^"]*)"').exec(tag);
  return m ? m[1] : null;
}

/* --- 1. Genel sayfa denetimi ---------------------------------------------- */
function auditOutput(dir, label) {
  const pages = walk(dir, ".html");
  const cache = {};
  const read = function (f) { return cache[f] || (cache[f] = fs.readFileSync(f, "utf8")); };

  pages.forEach(function (file) {
    const html = read(file);
    const url = urlOf(dir, file);
    const where = label + " " + url;
    if (/^\/google[0-9a-f]+\.html$/.test(url)) return;   /* Search Console doğrulama dosyası */

    ok(/^<!DOCTYPE html>/i.test(html), where + ": DOCTYPE yok");
    const lang = (/<html lang="([a-z]{2})"/.exec(html) || [])[1];
    ok(lang === "tr" || lang === "en", where + ": <html lang> eksik");
    ok(lang !== "en" || url.startsWith("/en/"), where + ": İngilizce sayfa /en/ altında değil");
    ok(/<title>[^<]{10,}<\/title>/.test(html), where + ": <title> eksik ya da çok kısa");
    ok(/<meta name="description" content="[^"]{30,}"/.test(html), where + ": meta description eksik");
    ok(/<meta name="viewport"/.test(html), where + ": viewport eksik");

    const noindex = /<meta name="robots" content="noindex/.test(html);
    if (url !== "/404.html") ok(/<link rel="canonical" href="https:\/\/suphicelikoz\.com\//.test(html), where + ": canonical eksik");
    if (!noindex && url !== "/404.html") {
      const canonical = attr((/<link rel="canonical"[^>]*>/.exec(html) || [""])[0], "href");
      ok(canonical === "https://suphicelikoz.com" + url, where + ": canonical kendi adresini göstermiyor (" + canonical + ")");
    }

    /* Başlıklar: tek h1, seviye atlanmaz */
    const heads = (html.match(/<h[1-6][\s>]/g) || []).map(function (h) { return Number(h[2]); });
    ok(heads.filter(function (h) { return h === 1; }).length === 1, where + ": tam olarak bir h1 olmalı (" + heads.filter(function (h) { return h === 1; }).length + ")");
    ok(heads[0] === 1, where + ": ilk başlık h1 değil");
    for (let i = 1; i < heads.length; i++) {
      if (heads[i] > heads[i - 1] + 1) { ok(false, where + ": başlık seviyesi atlıyor (h" + heads[i - 1] + " -> h" + heads[i] + ")"); break; }
    }

    /* Görseller */
    (html.match(/<img\b[^>]*>/g) || []).forEach(function (tag) {
      ok(attr(tag, "alt") !== null, where + ": alt özniteliği olmayan görsel: " + tag.slice(0, 80));
      ok(attr(tag, "width") && attr(tag, "height"), where + ": ölçüsüz görsel (düzen kayar): " + attr(tag, "src"));
    });

    /* Tek bir id bir kez */
    const all = (html.match(/\sid="([^"]+)"/g) || []);
    ok(all.length === new Set(all).size, where + ": tekrarlanan id");

    /* İç bağlantılar ve bölüm hedefleri */
    const links = [];
    html.replace(/\s(href|src)="([^"]+)"/g, function (_, a, v) { links.push(v); return ""; });
    links.forEach(function (href) {
      if (/^(https?:|mailto:|tel:|data:)/.test(href)) return;
      if (href.startsWith("#")) {
        ok(ids(html).has(href.slice(1)), where + ": sayfa içi bağlantının hedefi yok: " + href);
        return;
      }
      ok(href.startsWith("/"), where + ": kök göreli olmayan iç bağlantı: " + href);
      const target = resolve(dir, href.replace(/&amp;/g, "&"));
      if (!ok(target, where + ": kırık bağlantı: " + href)) return;
      if (target.hash && target.file.endsWith(".html")) {
        ok(ids(read(target.file)).has(target.hash), where + ": " + href + " bölümü hedef sayfada yok");
      }
    });

    /* Dış bağlantılar yeni sekmede açılıyorsa noopener */
    (html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []).forEach(function (tag) {
      ok(/rel="noopener"/.test(tag), where + ": target=_blank bağlantıda rel=noopener yok");
    });

    /* hreflang karşılıklı olmalı */
    const alts = {};
    html.replace(/<link rel="alternate" hreflang="(tr|en)" href="https:\/\/suphicelikoz\.com([^"]+)">/g, function (_, l, p) { alts[l] = p; return ""; });
    if (alts.tr || alts.en) {
      ok(alts.tr && alts.en, where + ": hreflang eksik (" + JSON.stringify(alts) + ")");
      ok(alts[lang] === url, where + ": hreflang kendi dilini göstermiyor");
      ["tr", "en"].forEach(function (l) {
        const t = alts[l] && resolve(dir, alts[l]);
        if (!ok(t, where + ": hreflang hedefi yok: " + alts[l])) return;
        ok(read(t.file).indexOf('hreflang="' + lang + '" href="https://suphicelikoz.com' + url + '"') !== -1, where + ": hreflang karşılıklı değil (" + alts[l] + ")");
      });
    }

    /* JSON-LD geçerli JSON olmalı */
    html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, function (_, json) {
      try { JSON.parse(json); ok(true, ""); } catch (e) { ok(false, where + ": JSON-LD bozuk: " + e.message); }
      return "";
    });
  });

  return { pages: pages, read: read };
}

function sitemapUrls(dir) {
  const xml = fs.readFileSync(path.join(dir, "sitemap.xml"), "utf8");
  return (xml.match(/<loc>[^<]+<\/loc>/g) || []).map(function (l) { return l.replace(/<\/?loc>/g, "").replace("https://suphicelikoz.com", ""); });
}

/* --- Çalıştır ---------------------------------------------------------------- */
const t0 = Date.now();
try {
  /* 1) Yayın çıktısı */
  const prodDir = path.join(TMP, "prod");
  const prod = build({ out: prodDir });
  const a = auditOutput(prodDir, "[yayın]");

  const indexable = a.pages.filter(function (f) {
    return !/noindex/.test((/<meta name="robots"[^>]*>/.exec(a.read(f)) || [""])[0]) && !f.endsWith("404.html") && !/google[0-9a-f]+\.html$/.test(f);
  }).map(function (f) { return urlOf(prodDir, f); }).sort();
  const inMap = sitemapUrls(prodDir).sort();
  ok(JSON.stringify(indexable) === JSON.stringify(inMap), "[yayın] site haritası ile dizine eklenebilir sayfalar uyuşmuyor");
  inMap.forEach(function (u) { ok(resolve(prodDir, u), "[yayın] site haritasında olmayan sayfa: " + u); });
  ok(/Sitemap: https:\/\/suphicelikoz\.com\/sitemap\.xml/.test(fs.readFileSync(path.join(prodDir, "robots.txt"), "utf8")), "[yayın] robots.txt site haritasını göstermiyor");

  /* Eski adresler: /en.html yönlendirmesi ve eski #bölüm eşlemeleri */
  ok(resolve(prodDir, "/en.html"), "[yayın] /en.html yönlendirmesi hedefi yok");
  const { LEGACY_HASHES } = require(path.join(ROOT, "src", "lib", "routes.js"));
  ["tr", "en"].forEach(function (l) {
    Object.keys(LEGACY_HASHES[l]).forEach(function (k) {
      const t = resolve(prodDir, LEGACY_HASHES[l][k]);
      if (ok(t, "[yayın] eski #" + k + " bağlantısının hedefi yok")) {
        if (t.hash) ok(ids(a.read(t.file)).has(t.hash), "[yayın] eski #" + k + " bölümü hedefte yok");
      }
    });
  });
  ok(fs.existsSync(path.join(prodDir, "assets", "cv", "Suphi-Atilim-Celikoz-CV.pdf")) && fs.existsSync(path.join(prodDir, "assets", "cv", "Suphi-Atilim-Celikoz-CV-EN.pdf")), "[yayın] CV PDF'leri çıktıda yok");
  ok(!fs.existsSync(path.join(prodDir, "tools")) && !fs.existsSync(path.join(prodDir, "content")), "[yayın] kaynak klasörleri yayına girmiş");

  /* 2) Taslak sızıntısı */
  const { loadPosts } = require(path.join(ROOT, "src", "lib", "posts.js"));
  const projects = require(path.join(ROOT, "content", "projects.js"));
  const drafts = loadPosts(ROOT, projects.map(function (p) { return p.slug; })).filter(function (p) { return p.draft; });
  const everything = walk(prodDir).filter(function (f) { return /\.(html|xml|txt|json)$/.test(f); }).map(function (f) { return fs.readFileSync(f, "utf8"); }).join("\n");
  drafts.forEach(function (d) {
    ok(everything.indexOf("/" + d.slug + "/") === -1, "[sızıntı] taslak adresi yayında: " + d.slug);
    ok(everything.indexOf(d.title.replace(/'/g, "&#39;")) === -1 && everything.indexOf(d.title) === -1, "[sızıntı] taslak başlığı yayında: " + d.title);
  });
  ok(!/ONAY:|review-note/.test(everything), "[sızıntı] onay notu yayın çıktısında");
  ok(!/Son yazılar|Latest posts/.test(a.read(path.join(prodDir, "index.html")) + a.read(path.join(prodDir, "en", "index.html"))) || prod.published > 0,
    "[yayın] yayımlanmış yazı yokken ana sayfada yazı bölümü var");
  if (prod.published === 0) {
    ok(/Henüz yayımlanmış yazı yok/.test(a.read(path.join(prodDir, "blog", "index.html"))), "[yayın] boş blogda boş durum mesajı yok");
  }

  /* 3) Önizleme */
  const prevDir = path.join(TMP, "preview");
  build({ drafts: true, out: prevDir });
  auditOutput(prevDir, "[önizleme]");
  drafts.forEach(function (d) {
    const f = path.join(prevDir, d.lang === "en" ? "en" : "", "blog", d.slug, "index.html");
    if (ok(fs.existsSync(f), "[önizleme] taslak sayfası yok: " + d.slug)) {
      ok(/<meta name="robots" content="noindex/.test(fs.readFileSync(f, "utf8")), "[önizleme] taslakta noindex yok: " + d.slug);
    }
  });
  ok(sitemapUrls(prevDir).every(function (u) { return drafts.every(function (d) { return u.indexOf(d.slug) === -1; }); }), "[önizleme] taslak site haritasında");
  ok(/Disallow: \//.test(fs.readFileSync(path.join(prevDir, "robots.txt"), "utf8")), "[önizleme] robots.txt dizinlemeyi engellemiyor");

  /* 4) Yayımlama akışı: geçici blog klasöründe gerçek yazılar + deneme yazıları */
  const blogDir = path.join(TMP, "blog");
  ["tr", "en"].forEach(function (l) {
    fs.mkdirSync(path.join(blogDir, l), { recursive: true });
    const src = path.join(ROOT, "content", "blog", l);
    if (fs.existsSync(src)) fs.readdirSync(src).filter(function (f) { return f.endsWith(".md"); }).forEach(function (f) { fs.copyFileSync(path.join(src, f), path.join(blogDir, l, f)); });
  });
  const body = "Giriş paragrafı.\n\n## Birinci\n\nMetin ve [proje](proje:safecargo).\n\n## İkinci\n\n### Alt başlık\n\nMetin.\n\n```js\nconst x = 1 < 2;\n```\n\n## Üçüncü\n\n![Ekran](/assets/img/projects/safecargo.webp \"Alt yazı\")\n";
  fs.writeFileSync(path.join(blogDir, "tr", "deneme-yazisi.md"),
    "---\ntitle: Deneme yazısı\ndescription: Kontrol betiğinin geçici yayımlanmış yazısı, gerçek içerik değil.\nstatus: published\ndate: 2026-01-15\nupdated: 2026-02-01\ncategory: Deneme\nrelated: [safecargo]\ntranslation: test-post\n---\n" + body);
  fs.writeFileSync(path.join(blogDir, "en", "test-post.md"),
    "---\ntitle: Test post\ndescription: A temporary published post created by the check script, not real content.\nstatus: published\ndate: 2026-01-15\ncategory: Test\ntranslation: deneme-yazisi\n---\nIntro.\n\n## One\n\nText.\n");
  const fixDir = path.join(TMP, "fixture");
  const fix = build({ out: fixDir, blogDir: blogDir });
  auditOutput(fixDir, "[yayımlama]");
  const fr = function (p) { return fs.readFileSync(path.join(fixDir, p), "utf8"); };
  ok(fix.published === prod.published + 2, "[yayımlama] deneme yazıları yayımlanmış sayılmadı");
  ok(/Deneme yazısı/.test(fr("blog/index.html")), "[yayımlama] yazı blog listesinde yok");
  ok(/Deneme yazısı/.test(fr("index.html")) && /Son yazılar/.test(fr("index.html")), "[yayımlama] yazı ana sayfadaki son yazılarda yok");
  ok(/deneme-yazisi/.test(fr("sitemap.xml")) && /test-post/.test(fr("sitemap.xml")), "[yayımlama] yazı site haritasında yok");
  ok(/<item>[\s\S]*Deneme yazısı/.test(fr("blog/rss.xml")), "[yayımlama] yazı RSS'te yok");
  ok(/<item>[\s\S]*Test post/.test(fr("en/blog/rss.xml")) && !/Deneme/.test(fr("en/blog/rss.xml")), "[yayımlama] İngilizce RSS yanlış");
  const post = fr("blog/deneme-yazisi/index.html");
  ok(/class="toc"/.test(post), "[yayımlama] uzun yazıda içindekiler yok");
  /* ### başlıkları ## altında iç içe olmalı; aynı listede kalırsa numaralar atlar */
  ok(/<li><a href="#ikinci">İkinci<\/a><ul><li><a href="#alt-baslik">Alt başlık<\/a><\/li><\/ul><\/li><li><a href="#ucuncu">/.test(post), "[yayımlama] içindekilerde alt başlık iç içe değil");
  ok(/<pre><code class="language-js">const x = 1 &lt; 2;<\/code><\/pre>/.test(post), "[yayımlama] kod bloğu yanlış");
  ok(/<figure class="figure"><img src="\/assets\/img\/projects\/safecargo.webp" alt="Ekran" width="800" height="450"/.test(post), "[yayımlama] görsel ölçüsüyle birlikte eklenmedi");
  ok(/href="\/projeler\/safecargo\/"/.test(post), "[yayımlama] proje: bağlantısı çözülmedi");
  ok(/hreflang="en" href="https:\/\/suphicelikoz\.com\/en\/blog\/test-post\/"/.test(post), "[yayımlama] çeviri hreflang yok");
  ok(/"@type":"BlogPosting"/.test(post) && /"dateModified":"2026-02-01"/.test(post), "[yayımlama] BlogPosting verisi eksik");
  ok(/Güncellendi/.test(post) && /dk okuma/.test(post), "[yayımlama] güncelleme tarihi ya da okuma süresi yok");
  drafts.forEach(function (d) { ok(fr("blog/index.html").indexOf(d.slug) === -1, "[yayımlama] taslak listeye sızdı: " + d.slug); });

  /* Onay notu kalmış yayımlanmış yazı derlemeyi durdurmalı */
  fs.writeFileSync(path.join(blogDir, "tr", "notlu.md"), "---\ntitle: Notlu\ndescription: Onay notu unutulmuş yayımlanmış yazı denemesi.\nstatus: published\ndate: 2026-01-20\ncategory: Deneme\n---\nMetin.\n\n<!-- ONAY: unutulan not -->\n");
  let stopped = false;
  try { build({ out: path.join(TMP, "notlu"), blogDir: blogDir }); } catch (e) { stopped = /onay notu/.test(e.message); }
  ok(stopped, "[yayımlama] onay notu kalan yayımlanmış yazı derlemeyi durdurmadı");
} catch (e) {
  problems.push("Derleme hatası: " + e.message);
} finally {
  fs.rmSync(TMP, { recursive: true, force: true });
}

if (problems.length) {
  console.error("\nSite denetimi: " + problems.length + " sorun\n  - " + problems.join("\n  - ") + "\n");
  process.exit(1);
}
console.log("Site denetimi geçti: " + checks + " kontrol, " + (Date.now() - t0) + " ms");
