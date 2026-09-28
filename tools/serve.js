#!/usr/bin/env node
/* =============================================================================
   Yerel önizleme sunucusu  --  node tools/serve.js
   -----------------------------------------------------------------------------
     node tools/serve.js            yayınla aynı çıktı (taslaklar hariç)
     node tools/serve.js --drafts   taslaklar dahil önizleme (TASLAK şeridiyle)
     node tools/serve.js --port 5000

   Siteyi üretir ve http://localhost:4173 adresinde sunar. Dosya
   değiştirdiğinde (content/, src/, assets/) sayfayı yenilemen yeterli: bir
   sonraki istekte site yeniden üretilir. Bağımlılık yok.

   Vercel'in davranışını taklit eder: /projeler -> /projeler/ yönlendirmesi
   (trailingSlash), vercel.json'daki yönlendirmeler ve 404.html.
   ========================================================================== */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { build } = require("./build-site");

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const DRAFTS = args.indexOf("--drafts") !== -1;
const PORT = Number(args[args.indexOf("--port") + 1]) || 4173;
const WATCH = ["content", "src", "assets", "tools/build-site.js", "vercel.json"];

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".pdf": "application/pdf"
};

function latestMtime(p) {
  const full = path.join(ROOT, p);
  let st;
  try { st = fs.statSync(full); } catch (e) { return 0; }
  if (!st.isDirectory()) return st.mtimeMs;
  return fs.readdirSync(full).reduce(function (max, name) {
    return Math.max(max, latestMtime(path.join(p, name)));
  }, st.mtimeMs);
}

let builtAt = 0;
let lastError = null;
let outDir = null;

function rebuildIfNeeded() {
  const newest = WATCH.reduce(function (m, p) { return Math.max(m, latestMtime(p)); }, 0);
  if (newest <= builtAt) return;   /* değişiklik yok (hata varsa düzeltilene kadar hata sayfası) */
  try {
    const r = build({ drafts: DRAFTS });
    outDir = r.outDir;
    lastError = null;
    console.log("[" + new Date().toLocaleTimeString() + "] yeniden üretildi (" + r.pages + " sayfa, " + r.drafts + " taslak " + (DRAFTS ? "dahil" : "hariç") + ")");
  } catch (e) {
    lastError = e.message;
    console.error("\nDERLEME HATASI\n" + e.message + "\n");
  }
  builtAt = newest;
}

function redirects() {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")).redirects || []; }
  catch (e) { return []; }
}

function send(res, status, file, headers) {
  fs.readFile(file, function (err, buf) {
    if (err) { res.writeHead(500).end("okunamadı"); return; }
    res.writeHead(status, Object.assign({ "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" }, headers || {}));
    res.end(buf);
  });
}

const server = http.createServer(function (req, res) {
  rebuildIfNeeded();
  if (lastError) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Derleme hatası:\n\n" + lastError + "\n\nDosyayı düzeltip sayfayı yenile.");
    return;
  }

  const url = new URL(req.url, "http://localhost");
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch (e) { res.writeHead(400).end(); return; }

  const rule = redirects().find(function (r) { return r.source === pathname; });
  if (rule) {
    res.writeHead(rule.permanent === false ? 307 : 308, { Location: rule.destination + url.search });
    res.end();
    return;
  }

  const file = path.resolve(outDir, "." + pathname);
  const rel = path.relative(outDir, file);
  if (rel.startsWith("..") || path.isAbsolute(rel)) { res.writeHead(403).end(); return; }

  let st = null;
  try { st = fs.statSync(file); } catch (e) { /* yok */ }

  if (st && st.isDirectory()) {
    if (!pathname.endsWith("/")) {
      res.writeHead(308, { Location: pathname + "/" + url.search });
      res.end();
      return;
    }
    const index = path.join(file, "index.html");
    if (fs.existsSync(index)) { send(res, 200, index); return; }
  } else if (st) {
    send(res, 200, file);
    return;
  }
  send(res, 404, path.join(outDir, "404.html"));
});

rebuildIfNeeded();
server.listen(PORT, "127.0.0.1", function () {
  console.log("\nÖnizleme: http://localhost:" + PORT + "/" + (DRAFTS ? "   (taslaklar DAHİL: /blog/ sayfasının altında)" : ""));
  console.log("İngilizce: http://localhost:" + PORT + "/en/");
  console.log("Durdurmak için Ctrl+C\n");
});
