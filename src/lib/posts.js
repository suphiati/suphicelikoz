/* =============================================================================
   Blog yazılarını okur: content/blog/<dil>/<adres>.md

   Her dosya bir front matter bloğuyla başlar:

     ---
     title: Yazının başlığı
     description: Listelerde ve arama sonuçlarında görünen kısa özet
     status: draft            # draft = taslak, published = yayımlanmış
     date: 2026-10-01         # yayın tarihi (yayımlarken zorunlu)
     updated: 2026-10-15      # isteğe bağlı güncelleme tarihi
     category: Ürün geliştirme
     related: [tmgd-asistani] # isteğe bağlı: ilgili proje(ler)in slug'ı
     translation: english-slug  # isteğe bağlı: diğer dildeki karşılığı
     ---

   Taslaklar (status: draft) üretimde HİÇBİR çıktıya girmez: sayfa, liste,
   site haritası, RSS, ilgili yazılar. Yalnızca --drafts ile yapılan önizleme
   derlemesinde görünürler.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const { isValidDate, readingMinutes } = require("./util");

const LANGS = ["tr", "en"];
const STATUSES = ["draft", "published"];

function parseValue(raw) {
  const v = raw.trim();
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^\[.*\]$/.test(v)) {
    return v.slice(1, -1).split(",").map(function (x) { return parseValue(x); }).filter(function (x) { return x !== ""; });
  }
  const q = /^(["'])([\s\S]*)\1$/.exec(v);
  if (q) return q[2];
  return v;
}

/* Yalnızca "anahtar: değer" satırlarını anlayan bilinçli olarak küçük bir
   ayrıştırıcı. # ile başlayan satırlar ve satır sonu yorumları yok sayılır. */
function parseFrontMatter(text, file) {
  const src = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src);
  if (!m) throw new Error(file + ": dosya '---' ile başlayan bir front matter bloğuyla başlamalı.");
  const data = {};
  m[1].split("\n").forEach(function (line, n) {
    if (!line.trim() || /^\s*#/.test(line)) return;
    const kv = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) throw new Error(file + ": front matter satırı " + (n + 2) + " anlaşılamadı: " + line);
    let value = kv[2];
    /* Tırnak dışındaki " # yorum" kısmını at */
    if (!/^["']/.test(value.trim())) value = value.replace(/\s+#.*$/, "");
    data[kv[1]] = parseValue(value);
  });
  return { data: data, body: m[2] };
}

/* blogDir: yazıların klasörü (varsayılan content/blog). Kontrol betiği
   gerçek içeriğe dokunmadan yayımlama akışını denemek için başka bir
   klasör verir. */
function loadPosts(root, projectSlugs, blogDir) {
  const posts = [];
  const errors = [];
  const base = blogDir || path.join(root, "content", "blog");

  LANGS.forEach(function (lang) {
    const dir = path.join(base, lang);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).filter(function (f) { return f.endsWith(".md"); }).sort().forEach(function (f) {
      const full = path.join(dir, f);
      const file = path.relative(root, full).split(path.sep).join("/");
      const slug = f.replace(/\.md$/, "");
      try {
        const parsed = parseFrontMatter(fs.readFileSync(full, "utf8"), file);
        const d = parsed.data;
        const problems = [];
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) problems.push("dosya adı yalnızca küçük harf, rakam ve tire içermeli (Türkçe karakter yok): " + f);
        if (!d.title) problems.push("title eksik");
        if (!d.description) problems.push("description eksik");
        if (!d.category) problems.push("category eksik");
        if (STATUSES.indexOf(d.status) === -1) problems.push("status 'draft' ya da 'published' olmalı (şu an: " + d.status + ")");
        if (d.status === "published" && !isValidDate(d.date)) problems.push("yayımlanan yazıda date YYYY-AA-GG biçiminde olmalı");
        if (d.date && !isValidDate(d.date)) problems.push("date geçersiz: " + d.date);
        if (d.updated && !isValidDate(d.updated)) problems.push("updated geçersiz: " + d.updated);
        if (d.updated && d.date && d.updated < d.date) problems.push("updated, date'ten önce olamaz");
        const related = d.related ? [].concat(d.related) : [];
        related.forEach(function (s) {
          if (projectSlugs.indexOf(s) === -1) problems.push("related içindeki proje bulunamadı: " + s);
        });
        if (problems.length) throw new Error(file + ":\n  - " + problems.join("\n  - "));

        posts.push({
          lang: lang,
          slug: slug,
          file: file,
          title: String(d.title),
          description: String(d.description),
          category: String(d.category),
          status: d.status,
          draft: d.status !== "published",
          date: d.date || null,
          updated: d.updated || null,
          related: related,
          translation: d.translation || null,
          body: parsed.body,
          minutes: readingMinutes(parsed.body.replace(/<!--[\s\S]*?-->/g, " "))
        });
      } catch (e) {
        errors.push(e.message);
      }
    });
  });

  /* Çeviri bağlantıları iki yönlü olmalı; yoksa dil geçişi yanlış sayfaya gider */
  posts.forEach(function (p) {
    if (!p.translation) return;
    const other = posts.find(function (o) { return o.lang !== p.lang && o.slug === p.translation; });
    if (!other) errors.push(p.file + ": translation '" + p.translation + "' diğer dilde bulunamadı.");
    else if (other.translation !== p.slug) errors.push(p.file + ": çeviri karşılıklı değil (" + other.file + " içinde translation: " + p.slug + " olmalı).");
  });

  if (errors.length) throw new Error("Blog yazılarında hata:\n" + errors.join("\n"));

  /* Yeniden eskiye; tarihsiz taslaklar sonda */
  posts.sort(function (a, b) {
    return String(b.date || "0000").localeCompare(String(a.date || "0000")) || a.slug.localeCompare(b.slug);
  });
  return posts;
}

module.exports = { loadPosts, parseFrontMatter };
