/* =============================================================================
   Blog yazıları için küçük Markdown dönüştürücü (bağımlılık yok).

   Desteklenenler
     ## Başlık / ### Alt başlık      (# kullanılmaz; sayfa başlığı front matter'dan gelir)
     paragraf, **kalın**, *italik*, `satır içi kod`
     [metin](https://...)            dış bağlantı yeni sekmede açılır
     [metin](proje:tmgd-asistani)    proje sayfasına bağlantı (yazının dilinde)
     ![açıklama](/assets/img/blog/x.webp "Görsel altı yazısı")
     - madde / 1. madde             (iç içe liste: iki boşluk girinti)
     > alıntı
     ```dil ... ```                  kod bloğu
     ---                             yatay çizgi
     <!-- ONAY: ... -->              onay notu: yalnızca taslak önizlemesinde
                                     görünür, yayında hiçbir zaman çıkmaz
   ========================================================================== */
"use strict";

const { esc, slugify } = require("./util");

const RE = {
  fence: /^```\s*([\w+-]*)\s*$/,
  heading: /^(#{1,6})\s+(.+?)\s*#*\s*$/,
  hr: /^\s{0,3}([-*_])(\s*\1){2,}\s*$/,
  quote: /^\s{0,3}>\s?/,
  ul: /^(\s*)[-*+]\s+(.*)$/,
  ol: /^(\s*)\d+[.)]\s+(.*)$/,
  commentStart: /^\s*<!--/,
  image: /^!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)$/
};

function isListLine(line) { return RE.ul.test(line) || RE.ol.test(line); }

function startsBlock(line) {
  return RE.fence.test(line) || RE.heading.test(line) || RE.hr.test(line) ||
         RE.quote.test(line) || isListLine(line) || RE.commentStart.test(line);
}

/* ---------------------------------------------------------------------------
   Satır içi biçimlendirme
   --------------------------------------------------------------------------- */
function renderInline(text, ctx) {
  const slots = [];
  const hold = function (html) { slots.push(html); return "\u0000" + (slots.length - 1) + "\u0000"; };

  /* 1) Satır içi kod: içi hiç yorumlanmaz */
  let s = String(text).replace(/`([^`]+)`/g, function (_, code) {
    return hold("<code>" + esc(code) + "</code>");
  });

  /* 2) Satır içi yorumlar atılır; cümle ortasındaki onay notu da kaydedilir
        (yayımlanmış yazıda onay notu kalırsa derleme durur, bkz. posts.js) */
  s = s.replace(/<!--([\s\S]*?)-->/g, function (_, inner) {
    const note = /^\s*ONAY\s*:\s*([\s\S]*)$/i.exec(inner);
    if (!note) return "";
    const noteText = note[1].replace(/\s+/g, " ").trim();
    ctx.notes.push(noteText);
    return ctx.showNotes ? hold('<mark class="review-note-inline">' + esc(ctx.noteLabel) + " " + esc(noteText) + "</mark>") : "";
  });

  /* 3) Görseller ve bağlantılar: öznitelikler kaçışlı, metin yeniden işlenir */
  s = s.replace(/!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)/g, function (_, alt, src) {
    return hold(imageTag(src, alt, ctx));
  });
  s = s.replace(/\[([^\]]+)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)/g, function (_, label, href, title) {
    return hold(linkTag(href, renderInline(label, ctx), title, ctx));
  });

  /* 4) Geri kalan metni kaçır, sonra vurguları uygula */
  s = esc(s)
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^\w])__(?=\S)([\s\S]*?\S)__(?!\w)/g, "$1<strong>$2</strong>")
    .replace(/\*(?=\S)([\s\S]*?\S)\*/g, "<em>$1</em>")
    .replace(/(^|[^\w])_(?=\S)([\s\S]*?\S)_(?!\w)/g, "$1<em>$2</em>");

  return s.replace(/\u0000(\d+)\u0000/g, function (_, n) { return slots[Number(n)]; });
}

function linkTag(href, labelHtml, title, ctx) {
  let url = href;
  const project = /^proje:([a-z0-9-]+)$/.exec(href);
  if (project) {
    url = ctx.resolveProject(project[1]);
    if (!url) throw new Error("Bilinmeyen proje bağlantısı: " + href);
  }
  const external = /^https?:\/\//i.test(url);
  const t = title ? ' title="' + esc(title) + '"' : "";
  if (external) {
    return '<a href="' + esc(url) + '"' + t + ' target="_blank" rel="noopener">' + labelHtml +
           '<span class="sr-only"> ' + esc(ctx.newTabText) + "</span></a>";
  }
  return '<a href="' + esc(url) + '"' + t + ">" + labelHtml + "</a>";
}

function imageTag(src, alt, ctx) {
  const size = ctx.imageSize ? ctx.imageSize(src) : null;
  const dims = size ? ' width="' + size.width + '" height="' + size.height + '"' : "";
  return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + dims + ' loading="lazy" decoding="async">';
}

/* ---------------------------------------------------------------------------
   Bloklar
   --------------------------------------------------------------------------- */
function renderBlocks(lines, ctx, depth) {
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    /* Kod bloğu */
    let m = RE.fence.exec(line);
    if (m) {
      const lang = m[1];
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { body.push(lines[i]); i++; }
      if (i >= lines.length) throw new Error("Kapanmamış kod bloğu (```)");
      i++;
      const cls = lang ? ' class="language-' + esc(lang) + '"' : "";
      out.push("<pre><code" + cls + ">" + esc(body.join("\n")) + "</code></pre>");
      continue;
    }

    /* Yorum / onay notu */
    if (RE.commentStart.test(line)) {
      const buf = [];
      while (i < lines.length) {
        buf.push(lines[i]);
        if (lines[i].indexOf("-->") !== -1) { i++; break; }
        i++;
      }
      const raw = buf.join("\n");
      if (raw.indexOf("-->") === -1) throw new Error("Kapanmamış yorum (<!-- ... -->)");
      const inner = raw.replace(/^\s*<!--/, "").replace(/-->[\s\S]*$/, "").trim();
      const note = /^ONAY\s*:\s*([\s\S]*)$/i.exec(inner);
      if (note) {
        const text = note[1].replace(/\s+/g, " ").trim();
        ctx.notes.push(text);
        if (ctx.showNotes) {
          out.push('<aside class="review-note" role="note"><strong>' + esc(ctx.noteLabel) + "</strong> " +
                   renderInline(text, ctx) + "</aside>");
        }
      }
      continue;
    }

    /* Başlık */
    m = RE.heading.exec(line);
    if (m) {
      const level = m[1].length;
      if (level === 1) throw new Error('Yazı içinde "# " (h1) kullanılmaz; sayfa başlığı front matter\'daki title. "## " kullan: ' + line);
      const html = renderInline(m[2], ctx);
      if (depth === 0) {
        const plain = html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        let id = slugify(plain);
        ctx.ids[id] = (ctx.ids[id] || 0) + 1;
        if (ctx.ids[id] > 1) id += "-" + ctx.ids[id];
        ctx.headings.push({ level: level, text: plain, id: id });
        out.push("<h" + level + ' id="' + id + '">' + html + "</h" + level + ">");
      } else {
        out.push("<h" + level + ">" + html + "</h" + level + ">");
      }
      i++;
      continue;
    }

    /* Yatay çizgi */
    if (RE.hr.test(line)) { out.push("<hr>"); i++; continue; }

    /* Alıntı */
    if (RE.quote.test(line)) {
      const body = [];
      while (i < lines.length && lines[i].trim() && RE.quote.test(lines[i])) {
        body.push(lines[i].replace(RE.quote, ""));
        i++;
      }
      out.push("<blockquote>" + renderBlocks(body, ctx, depth + 1) + "</blockquote>");
      continue;
    }

    /* Liste */
    if (isListLine(line)) {
      const ordered = !RE.ul.test(line) && RE.ol.test(line);
      const baseIndent = (ordered ? RE.ol : RE.ul).exec(line)[1].length;
      const items = [];
      while (i < lines.length) {
        const cur = lines[i];
        if (!cur.trim()) {
          /* Boş satırdan sonra aynı türden madde geliyorsa liste sürer */
          const next = lines[i + 1];
          if (next && (ordered ? RE.ol : RE.ul).test(next) && (ordered ? RE.ol : RE.ul).exec(next)[1].length === baseIndent) { i++; continue; }
          break;
        }
        const mm = (ordered ? RE.ol : RE.ul).exec(cur);
        if (mm && mm[1].length === baseIndent) {
          items.push([mm[2]]);
          i++;
          continue;
        }
        const indent = /^(\s*)/.exec(cur)[1].length;
        if (indent > baseIndent && items.length) {
          items[items.length - 1].push(cur.slice(Math.min(indent, baseIndent + 2)));
          i++;
          continue;
        }
        break;
      }
      const tag = ordered ? "ol" : "ul";
      out.push("<" + tag + ">" + items.map(function (item) {
        let html = renderBlocks(item, ctx, depth + 1);
        const single = /^<p>([\s\S]*)<\/p>$/.exec(html);
        if (single && html.indexOf("<p>", 1) === -1) html = single[1];
        html = html.replace(/^<p>([\s\S]*?)<\/p>(?=\n?<[uo]l>)/, "$1");
        return "<li>" + html + "</li>";
      }).join("") + "</" + tag + ">");
      continue;
    }

    /* Paragraf (tek başına görselse figür) */
    const para = [];
    while (i < lines.length && lines[i].trim() && !(para.length && startsBlock(lines[i]))) {
      para.push(lines[i].trim());
      i++;
    }
    const text = para.join(" ");
    m = RE.image.exec(text);
    if (m) {
      const caption = m[3] ? "<figcaption>" + renderInline(m[3], ctx) + "</figcaption>" : "";
      out.push('<figure class="figure">' + imageTag(m[2], m[1], ctx) + caption + "</figure>");
    } else {
      out.push("<p>" + renderInline(text, ctx) + "</p>");
    }
  }

  return out.join("\n");
}

/* src: Markdown metni
   options.resolveProject(slug) -> proje adresi ya da null
   options.imageSize(src)       -> { width, height } ya da null
   options.showNotes            -> onay notlarını HTML'e koy (yalnızca taslak önizlemesi)
   options.noteLabel / newTabText -> arayüz metinleri */
function renderMarkdown(src, options) {
  const ctx = {
    resolveProject: options.resolveProject || function () { return null; },
    imageSize: options.imageSize,
    showNotes: !!options.showNotes,
    noteLabel: options.noteLabel || "ONAY:",
    newTabText: options.newTabText || "(yeni sekmede açılır)",
    headings: [],
    notes: [],
    ids: {}
  };
  const lines = String(src).replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  const html = renderBlocks(lines, ctx, 0);
  return { html: html, headings: ctx.headings, notes: ctx.notes };
}

module.exports = { renderMarkdown, renderInline };
