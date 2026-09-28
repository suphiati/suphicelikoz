#!/usr/bin/env node
/* =============================================================================
   assets/img/og-cover.jpg uretici  (1200x630 sosyal paylasim gorseli)

     node tools/build-og-cover.js            yeniden uret
     node tools/build-og-cover.js --check    eskimis mi diye bak (cikis kodu 1)

   Sitenin butun sayfalari (src/templates/layout.js) "og:image" olarak kosulsuz sekilde
   https://suphicelikoz.com/assets/img/og-cover.jpg adresini gosteriyor.
   Dosya yoksa LinkedIn, WhatsApp, Slack ve Upwork mesajlarindaki her
   paylasim gorselsiz duz metin olarak aciliyor - onizleme "eksik" degil,
   hic olusmuyor.

   Kaynak tuval: tools/og-cover.html. Kurulum gerekmez; Node ve Chrome
   (ya da Edge) yeterli. Sistem tools/build-cv-pdf.js ile ayni: kendi mini
   statik sunucusunu acar, Chrome'u headless baslatir ve CDP ile konusur.
   ========================================================================== */

"use strict";

const http   = require("http");
const fs     = require("fs");
const os     = require("os");
const path   = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT   = path.resolve(__dirname, "..");
const PAGE   = path.join("tools", "og-cover.html");
const CHECK  = process.argv.indexOf("--check") !== -1;

/* Iki dil, tek sablon: og-cover.html "?lang=en" ile Ingilizce metne geciyor.
   Turkce sayfalar Turkce kapagi, /en/ altindakiler Ingilizce kapagi gosterir. */
const VARIANTS = [
  { query: "",         out: "og-cover.jpg" },
  { query: "?lang=en", out: "og-cover-en.jpg" }
];
const outPath = function (name) { return path.join(ROOT, "assets", "img", name); };

const WIDTH   = 1200;
const HEIGHT  = 630;
const QUALITY = 88;

/* Kapagin icerigini etkileyen dosyalar. build-cv-pdf.js'teki SOURCES ile
   ayni mantik: bu betik de listede, cunku olcu ve kalite burada duruyor. */
const SOURCES = [
  PAGE,
  path.join("assets", "img", "suphifoto.png"),
  path.join("tools", "build-og-cover.js")
];

const STAMP = path.join(ROOT, "assets", "img", ".og-cover-stamp");

/* --- 1. Chrome / Edge bul (build-cv-pdf.js ile ayni sira) --------------- */
function findChrome() {
  if (process.env.CHROME_PATH) {
    if (fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
    throw new Error("CHROME_PATH gecersiz (dosya yok): " + process.env.CHROME_PATH);
  }
  const pf   = process.env["ProgramFiles"]      || "C:\\Program Files";
  const pf86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
  const lad  = process.env.LOCALAPPDATA         || "";
  const win = [
    path.join(pf,   "Google\\Chrome\\Application\\chrome.exe"),
    path.join(pf86, "Google\\Chrome\\Application\\chrome.exe"),
    path.join(lad,  "Google\\Chrome\\Application\\chrome.exe"),
    path.join(pf86, "Microsoft\\Edge\\Application\\msedge.exe"),
    path.join(pf,   "Microsoft\\Edge\\Application\\msedge.exe")
  ];
  const nix = [
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  ];
  const list = process.platform === "win32" ? win : nix;
  for (const p of list) { if (fs.existsSync(p)) return p; }
  throw new Error("Chrome/Edge bulunamadi. CHROME_PATH ortam degiskenini ayarla.");
}

/* --- 2. Tazelik damgasi ------------------------------------------------- */
function sourceHash() {
  const h = crypto.createHash("sha256");
  for (const rel of SOURCES) {
    const p = path.join(ROOT, rel);
    h.update(rel);
    h.update(fs.readFileSync(p));
  }
  return h.digest("hex");
}

function staleness() {
  const stale = [];
  for (const v of VARIANTS) {
    if (!fs.existsSync(outPath(v.out))) stale.push("assets/img/" + v.out + " yok");
  }
  let stamped = "";
  try { stamped = fs.readFileSync(STAMP, "utf8").trim(); } catch (e) { /* damga yok */ }
  if (stamped !== sourceHash()) stale.push("kaynaklar degismis (assets/img/.og-cover-stamp uyusmuyor)");
  return stale;
}

/* --- 3. Mini statik sunucu (build-cv-pdf.js ile ayni) -------------------- */
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".json": "application/json"
};
function startServer() {
  return new Promise(function (resolve, reject) {
    const srv = http.createServer(function (req, res) {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/index.html";
      const file = path.resolve(ROOT, "." + p);
      const rel = path.relative(ROOT, file);
      if (rel.startsWith("..") || path.isAbsolute(rel)) { res.writeHead(403).end(); return; }
      fs.readFile(file, function (err, buf) {
        if (err) { res.writeHead(404).end("404 " + p); return; }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
        res.end(buf);
      });
    });
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", function () { resolve({ srv: srv, port: srv.address().port }); });
  });
}

/* --- 4. Minik CDP istemcisi (Node 18+ global WebSocket) ----------------- */
const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

function cdp(wsUrl) {
  return new Promise(function (resolve, reject) {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const waiters = [];
    ws.onerror = reject;
    ws.onclose = function () {
      for (const p of pending.values()) p.rej(new Error("CDP baglantisi kapandi (Chrome oldu?)"));
      pending.clear();
    };
    ws.onmessage = function (ev) {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const p = pending.get(m.id); pending.delete(m.id);
        if (m.error) p.rej(new Error(JSON.stringify(m.error))); else p.res(m.result);
      } else if (m.method) {
        for (let i = waiters.length - 1; i >= 0; i--) {
          if (waiters[i].match(m)) { waiters[i].res(m); waiters.splice(i, 1); }
        }
      }
    };
    ws.onopen = function () {
      resolve({
        send: function (method, params, sessionId) {
          return new Promise(function (res, rej) {
            const n = ++id;
            const timer = setTimeout(function () {
              if (pending.delete(n)) rej(new Error("CDP zaman asimi: " + method));
            }, 60000);
            pending.set(n, {
              res: function (v) { clearTimeout(timer); res(v); },
              rej: function (e) { clearTimeout(timer); rej(e); }
            });
            ws.send(JSON.stringify({ id: n, method: method, params: params || {}, sessionId: sessionId }));
          });
        },
        once: function (match, timeout) {
          return new Promise(function (res, rej) {
            const w = { match: match, res: res };
            waiters.push(w);
            setTimeout(function () {
              const i = waiters.indexOf(w);
              if (i >= 0) { waiters.splice(i, 1); rej(new Error("olay beklenirken zaman asimi")); }
            }, timeout || 45000);
          });
        },
        close: function () { ws.close(); }
      });
    };
  });
}

/* --- 5. Uretilen JPEG'i dogrula ---------------------------------------- */
/* SOF isaretcisinden gercek piksel olcusunu okur. Chrome'un dondurdugu
   base64'e guvenmiyoruz: deviceScaleFactor yanlis giderse gorsel sessizce
   2400x1260 cikar ve dosya boyutu dort katina firlar. */
function inspectJpeg(buf) {
  const out = { bytes: buf.length, isJpeg: buf[0] === 0xFF && buf[1] === 0xD8, width: 0, height: 0 };
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const marker = buf[i + 1];
    /* SOF0..SOF15, DHT/DAC/RST disinda kalanlar olcuyu tasir */
    if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
      out.height = buf.readUInt16BE(i + 5);
      out.width  = buf.readUInt16BE(i + 7);
      return out;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return out;
}

/* --- 6. Ana akis -------------------------------------------------------- */
(async function () {
  if (CHECK) {
    const stale = staleness();
    if (stale.length) {
      console.log("Sosyal paylasim kapaklari eskimis:");
      stale.forEach(function (s) { console.log("  - " + s); });
      console.log("\nYenilemek icin: node tools/build-og-cover.js");
      process.exit(1);
    }
    console.log("Sosyal paylasim kapaklari guncel.");
    process.exit(0);
  }

  const chromePath = findChrome();
  const server  = await startServer();
  const port    = server.port;
  const profile = path.join(os.tmpdir(), "og-cover-profile-" + process.pid);
  const dbgPort = 9500 + (process.pid % 300);

  console.log("Chrome : " + chromePath);
  console.log("Sunucu : http://127.0.0.1:" + port + "  (kok: " + ROOT + ")");

  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    "--no-first-run", "--no-default-browser-check",
    "--disable-background-networking", "--disable-extensions",
    "--disable-features=Translate,MediaRouter",
    "--force-color-profile=srgb",
    "--remote-debugging-port=" + dbgPort,
    "--user-data-dir=" + profile,
    "about:blank"
  /* Linux'ta root olarak (ör. kapsayici/CI) Chrome korumali alan olmadan
     acilmayi reddeder; Windows ve normal kullanicida bu bayrak eklenmez. */
  ].concat(process.getuid && process.getuid() === 0 ? ["--no-sandbox"] : [])
   /* Kurumsal ağ gibi yalnızca proxy ile internete çıkılan ortamlarda web
      fontları insin diye. Tanımlı değilse hiçbir şey eklenmez. */
   .concat(process.env.HTTPS_PROXY ? ["--proxy-server=" + process.env.HTTPS_PROXY] : []), { stdio: ["ignore", "ignore", "pipe"] });
  chrome.stderr.on("data", function () { /* GCM / uzanti gurultusunu yut */ });

  let chromeGone = false;
  chrome.on("exit", function () { chromeGone = true; });

  const rmProfile = function () {
    const wait = new Int32Array(new SharedArrayBuffer(4));
    for (let i = 0; i < 25; i++) {
      try { fs.rmSync(profile, { recursive: true, force: true }); return true; }
      catch (e) { Atomics.wait(wait, 0, 0, 100); }
    }
    return false;
  };

  let cleaned = false;
  const cleanup = function () {
    if (cleaned) return;
    cleaned = true;
    try { chrome.kill(); } catch (e) {}
    try { server.srv.close(); } catch (e) {}
    rmProfile();
  };
  const shutdown = async function () {
    if (cleaned) return;
    cleaned = true;
    try { chrome.kill(); } catch (e) {}
    try { server.srv.close(); } catch (e) {}
    for (let i = 0; i < 50 && !chromeGone; i++) await sleep(100);
    rmProfile();
  };
  process.on("exit", cleanup);
  process.on("SIGINT", function () { cleanup(); process.exit(1); });
  chrome.on("error", function (e) {
    console.error("Chrome baslatilamadi: " + e.message);
    cleanup();
    process.exit(1);
  });

  let version = null;
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch("http://127.0.0.1:" + dbgPort + "/json/version");
      version = await r.json();
      break;
    } catch (e) { await sleep(150); }
  }
  if (!version) { cleanup(); throw new Error("Chrome DevTools acilmadi."); }
  console.log("Surum  : " + version.Browser + "\n");

  const client = await cdp(version.webSocketDebuggerUrl);

  let failed = 0;
  for (const variant of VARIANTS) {
  const OUT = outPath(variant.out);
  const created  = await client.send("Target.createTarget", { url: "about:blank" });
  const targetId = created.targetId;
  const attached = await client.send("Target.attachToTarget", { targetId: targetId, flatten: true });
  const sessionId = attached.sessionId;
  const S = function (m, p) { return client.send(m, p, sessionId); };

  await S("Page.enable");
  await S("Runtime.enable");
  await S("Emulation.setDeviceMetricsOverride",
    { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });

  const loaded = client.once(function (m) {
    return m.method === "Page.loadEventFired" && m.sessionId === sessionId;
  }, 45000);
  await S("Page.navigate", {
    url: "http://127.0.0.1:" + port + "/" + PAGE.split(path.sep).join("/") + variant.query
  });
  await loaded;

  /* Web fontlari inmeden goruntu alinirsa kapak sistem yazi tipiyle cikar
     ve satirlar kayar - build-cv-pdf.js ile ayni gerekce. */
  await S("Runtime.evaluate", {
    expression: "document.fonts.ready.then(function () { return 1; })",
    awaitPromise: true, returnByValue: true
  });
  await sleep(300);

  const state = await S("Runtime.evaluate", {
    returnByValue: true,
    expression: [
      "(function () {",
      "  var bad = [].filter.call(document.images, function (i) {",
      "    return !(i.complete && i.naturalWidth > 0);",
      "  });",
      "  var photo = document.querySelector('.shot img');",
      "  return JSON.stringify({",
      "    brokenImages: bad.length,",
      "    photoOk: !!(photo && photo.complete && photo.naturalWidth > 0),",
      "    fonts: document.fonts.status,",
      "    webfonts: Array.from(document.fonts).filter(function (f) {",
      "      return f.status === 'loaded';",
      "    }).length,",
      "    docW: document.documentElement.scrollWidth,",
      "    docH: document.documentElement.scrollHeight",
      "  });",
      "})()"
    ].join("\n")
  });
  const probe = JSON.parse(state.result.value);

  const shot = await S("Page.captureScreenshot", {
    format: "jpeg",
    quality: QUALITY,
    captureBeyondViewport: false,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 }
  });
  const buf  = Buffer.from(shot.data, "base64");
  const info = inspectJpeg(buf);

  /* Sessiz bozulmaya karsi kapi: gecmezse dosya yazilmaz. */
  const problems = [];
  if (!info.isJpeg)                          problems.push("gecerli JPEG degil");
  if (info.width !== WIDTH || info.height !== HEIGHT)
    problems.push(info.width + "x" + info.height + " (" + WIDTH + "x" + HEIGHT + " bekleniyor)");
  if (info.bytes < 30000)                    problems.push("cok kucuk: " + info.bytes + " bayt");
  if (info.bytes > 900000)                   problems.push("cok buyuk: " + info.bytes + " bayt");
  if (probe.brokenImages !== 0)              problems.push(probe.brokenImages + " gorsel yuklenmedi");
  if (!probe.photoOk)                        problems.push("portre yuklenmedi");
  if (probe.webfonts === 0)                  problems.push("web fontlari yuklenmedi (internet yok?)");
  /* Tuval tam olarak 1200x630 olmali: tasarsa kapagin sag/alt kenari kirpilir. */
  if (probe.docW > WIDTH || probe.docH > HEIGHT)
    problems.push("tuval tasti: " + probe.docW + "x" + probe.docH);

  let wrote = "yazildi";
  if (problems.length) {
    failed++;
    wrote = "YAZILMADI";
  } else if (fs.existsSync(OUT) && Buffer.compare(fs.readFileSync(OUT), buf) === 0) {
    wrote = "degismedi, dokunulmadi";
  } else {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, buf);
  }

  console.log(
    (problems.length ? "  HATA " : "  OK   ") + "assets/img/" + variant.out + "  (" + wrote + ")\n" +
    "         " + info.width + "x" + info.height + ", " + (info.bytes / 1024).toFixed(0) + " KB\n" +
    "         durum: " + state.result.value +
    (problems.length ? "\n         sorun: " + problems.join("; ") : "")
  );

  await client.send("Target.closeTarget", { targetId: targetId });
  }

  client.close();
  await shutdown();

  /* Damga yalnizca iki kapak da basariliysa yazilir; yoksa --check bir daha
     hic "eskimis" demez ve eksik kapak guncelmis gibi gorunur. */
  if (!failed) fs.writeFileSync(STAMP, sourceHash() + "\n");

  console.log("\n" + (failed
    ? failed + " kapak basarisiz - dosyalar yazilmadi."
    : "Bitti -> " + path.join(ROOT, "assets", "img")));
  process.exit(failed ? 1 : 0);
})().catch(function (e) {
  console.error("BASARISIZ:", e && e.message ? e.message : e);
  process.exit(1);
});
