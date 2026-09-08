#!/usr/bin/env node
/* =============================================================================
   CV PDF uretici  --  node tools/build-cv-pdf.js
   -----------------------------------------------------------------------------
   Sitenin kendi "@media print" stilini kullanarak assets/cv/ altina gercek PDF
   uretir. Boylece "CV Indir" butonu yazdirma penceresi acmak yerine hazir bir
   dosya indirebiliyor.

   Bagimlilik yok: yalnizca Node standart kutuphanesi ve kurulu Chrome/Edge
   (DevTools Protocol uzerinden). "npm install" gerekmez.

   Kullanim:
     node tools/build-cv-pdf.js            PDF'leri uret
     node tools/build-cv-pdf.js --check    eskimis mi diye bak (cikis kodu 1)

   Neden .claude/ altinda degil: o klasor .gitignore'da. Betik depoda durmazsa
   PDF'leri baska bir bilgisayarda yeniden uretmek mumkun olmaz. Ayni sebeple
   .claude/serve.js'i cagirmak yerine kendi mini sunucusunu iceriyor.
   ========================================================================== */
"use strict";

const http   = require("http");
const fs     = require("fs");
const os     = require("os");
const path   = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT    = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "cv");
const CHECK   = process.argv.indexOf("--check") !== -1;

/* Cikti adi = indirenin bilgisayarina kaydedilen ad. Vercel her statik dosyada
   Content-Disposition: inline; filename="<gercek ad>" gonderiyor ve tarayici
   bunu <a download="..."> icindeki degere tercih ediyor. Yani indirilen dosyanin
   adini yalnizca buradaki ad belirler; HTML'de oznitelige isim yazmak yerelde
   calisir, yayinda sessizce goz ardi edilir. */
const PAGES = [
  { file: "index.html", out: "Suphi-Atilim-Celikoz-CV.pdf" },
  { file: "en.html",    out: "Suphi-Atilim-Celikoz-CV-EN.pdf" }
];

/* PDF'in icerigini etkileyen dosyalar. Bu betik de listede: paperWidth,
   kenar bosluklari vb. degistiginde de cikti eskimis sayilmali.
   (assets/img/apps ve certs listede yok: o bolumleri yazdirma stili zaten
   display:none yapiyor, PDF'e girmiyorlar.) */
const SOURCES = [
  "index.html", "en.html",
  path.join("assets", "css", "style.css"),
  path.join("assets", "js", "main.js"),
  path.join("assets", "img", "suphifoto.png"),
  path.join("tools", "build-cv-pdf.js")
];

/* Kaynaklarin ozeti bu dosyada durur. mtime ile karsilastirmak ise yaramiyor:
   "git clone" dosyalari indeks (alfabetik) sirasiyla yaziyor, yani
   assets/cv/*.pdf her zaman index.html'den once olusuyor ve taze bir klonda
   --check kosulsuz "eskimis" diyordu. Icerik ozeti klondan bagimsizdir. */
const STAMP = path.join(OUT_DIR, ".build-stamp");

/* --- 1. Chrome'u bul --------------------------------------------------- */
function findChrome() {
  if (process.env.CHROME_PATH) {
    /* Dogrulamadan spawn edilirse Node ham bir ENOENT yigin izi basiyor ve
       asagidaki yardimci mesaj hic gorunmuyor. */
    if (fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
    throw new Error("CHROME_PATH gecersiz (dosya yok): " + process.env.CHROME_PATH);
  }
  const pf   = process.env["ProgramFiles"]      || "C:\\Program Files";
  const pf86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
  const lad  = process.env.LOCALAPPDATA         || "";
  const win = [
    path.join(pf,   "Google/Chrome/Application/chrome.exe"),
    path.join(pf86, "Google/Chrome/Application/chrome.exe"),
    path.join(lad,  "Google/Chrome/Application/chrome.exe"),
    path.join(pf,   "Microsoft/Edge/Application/msedge.exe"),
    path.join(pf86, "Microsoft/Edge/Application/msedge.exe")
  ];
  const nix = [
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  ];
  const list = process.platform === "win32" ? win : nix;
  for (const p of list) { if (fs.existsSync(p)) return p; }
  throw new Error("Chrome/Edge bulunamadi. CHROME_PATH ortam degiskenini ayarla.");
}

/* --- 2. Eskimislik kontrolu -------------------------------------------- */
function sourceHash() {
  const h = crypto.createHash("sha256");
  for (const rel of SOURCES) {
    const p = path.join(ROOT, rel);
    h.update(rel.replace(/\\/g, "/") + "\n");
    if (!fs.existsSync(p)) { h.update("<yok>"); continue; }
    let buf = fs.readFileSync(p);
    /* Metin dosyalarinda satir sonu normalize edilmeli: core.autocrlf acikken
       git checkout sirasinda LF -> CRLF cevriliyor, yani ayni icerik farkli
       bayt uretiyor ve taze bir klonda ozet tutmuyordu. */
    if (/\.(html|css|js|json|txt|md)$/i.test(rel)) {
      buf = Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
    }
    h.update(buf);
  }
  return h.digest("hex");
}

function staleness() {
  const stale = [];
  for (const page of PAGES) {
    if (!fs.existsSync(path.join(OUT_DIR, page.out))) stale.push(page.out + " (yok)");
  }
  if (stale.length) return stale;

  let stamped = "";
  try { stamped = fs.readFileSync(STAMP, "utf8").trim(); } catch (e) { /* damga yok */ }
  if (stamped !== sourceHash()) {
    stale.push("kaynaklar degismis (assets/cv/.build-stamp uyusmuyor)");
  }
  return stale;
}

/* Chrome her uretimde /CreationDate damgaliyor, ayrica kodlayici bir kac yuz
   bayt oynayabiliyor. Icerik ayni iken 700 KB'lik ikili dosyalari yeniden
   yazmak deponun gecmisini bosuna sisiriyor; tarihleri temizleyip
   karsilastiriyoruz. */
function sameExceptDates(a, b) {
  const strip = function (buf) {
    return buf.toString("latin1")
      .replace(/\/(?:CreationDate|ModDate)\s*\(D:[^)]*\)/g, "")
      .replace(/<xmp:(?:CreateDate|ModifyDate)>[^<]*<\/xmp:(?:CreateDate|ModifyDate)>/g, "");
  };
  return strip(a) === strip(b);
}

/* --- 3. Kendi statik sunucusu ------------------------------------------ */
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".json": "application/json",
  ".pdf": "application/pdf"
};
function startServer() {
  return new Promise(function (resolve, reject) {
    const srv = http.createServer(function (req, res) {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/index.html";
      const file = path.resolve(ROOT, "." + p);
      /* startsWith(ROOT) ile karsilastirmak Windows'ta egik cizgi yonu
         yuzunden her istegi 403 yapabiliyor; path.relative guvenli. */
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
    /* Chrome yol ortasinda olurse bekleyen her istek burada reddedilmeli.
       Aksi halde await hic donmuyor: hata yok, cikis yok, kod yok - betik
       sonsuza kadar asili kaliyor. */
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

/* --- 5. Uretilen PDF'i dogrula ----------------------------------------- */
function inspect(buf) {
  const s = buf.toString("latin1");
  return {
    bytes: buf.length,
    pages: (s.match(/\/Type\s*\/Page[^s]/g) || []).length,
    mediaBox: (s.match(/\/MediaBox\s*\[[^\]]*\]/) || ["?"])[0],
    isPdf: s.indexOf("%PDF-") === 0
  };
}

/* --- 6. Ana akis -------------------------------------------------------- */
(async function () {
  if (CHECK) {
    const stale = staleness();
    if (stale.length) {
      console.log("PDF'ler eskimis:");
      stale.forEach(function (s) { console.log("  - " + s); });
      console.log("\nYenilemek icin: node tools/build-cv-pdf.js");
      process.exit(1);
    }
    console.log("PDF'ler guncel.");
    process.exit(0);
  }

  const chromePath = findChrome();
  const server  = await startServer();
  const port    = server.port;
  const profile = path.join(os.tmpdir(), "cv-pdf-profile-" + process.pid);
  const dbgPort = 9200 + (process.pid % 300);

  console.log("Chrome : " + chromePath);
  console.log("Sunucu : http://127.0.0.1:" + port + "  (kok: " + ROOT + ")");

  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    "--no-first-run", "--no-default-browser-check",
    "--disable-background-networking", "--disable-extensions",
    "--disable-features=Translate,MediaRouter",
    "--remote-debugging-port=" + dbgPort,
    "--user-data-dir=" + profile,
    "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"] });
  chrome.stderr.on("data", function () { /* GCM / uzanti gurultusunu yut */ });

  /* Profil klasoru silinirken Chrome'un tutamaclari hala acik olabiliyor
     (Windows'ta EBUSY: silme sessizce basarisiz olup her calistirmada
     %TEMP% altinda ~13 MB birakiyordu). Once cikisini bekleyip sonra
     birkac kez deniyoruz. */
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

  /* Duzgun kapanis: Chrome'un gercekten olmesini bekle, sonra sil. */
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
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let failed = 0;
  for (const page of PAGES) {
    const created  = await client.send("Target.createTarget", { url: "about:blank" });
    const targetId = created.targetId;
    const attached = await client.send("Target.attachToTarget", { targetId: targetId, flatten: true });
    const sessionId = attached.sessionId;
    const S = function (m, p) { return client.send(m, p, sessionId); };

    await S("Page.enable");
    await S("Runtime.enable");

    /* A4 genisligi: yazdirmada da eslesen mobil medya sorgulariyla ayni
       sutun duzeni olussun. */
    await S("Emulation.setDeviceMetricsOverride",
      { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });

    /* KRITIK - navigasyondan ONCE olmali (main.js reduceMotion'i dosya
       basinda bir kez okuyor).
       Istatistik sayaci [data-count] ogelerini 0'dan hedefe 1100 ms boyunca
       animasyonla sayiyor. Baski o sirada alinirsa PDF'e yarim rakamlar
       giriyordu: EN cikti "8+ yil" yaziyor, hemen ustundeki paragraf ise
       "10+ years" diyordu - hangi rakamin donacagi zamanlamaya bagliydi.
       Sitenin kendi erisilebilirlik yolu bunu tam olarak cozuyor: azaltilmis
       hareket tercihinde sayac hic calismiyor ve HTML'deki gercek degerler
       oldugu gibi kaliyor (main.js:118), .reveal ogeleri de aninda goruntuye
       giriyor (main.js:90). Yani cikti belirlenimli oluyor. */
    const MEDIA_FEATURES = [{ name: "prefers-reduced-motion", value: "reduce" }];
    await S("Emulation.setEmulatedMedia", { features: MEDIA_FEATURES });

    const loaded = client.once(function (m) {
      return m.method === "Page.loadEventFired" && m.sessionId === sessionId;
    }, 45000);
    await S("Page.navigate", { url: "http://127.0.0.1:" + port + "/" + page.file });
    await loaded;

    /* Web fontlari inmeden yazdirilirsa satir metrikleri kayar. */
    await S("Runtime.evaluate", {
      expression: "document.fonts.ready.then(function () { return 1; })",
      awaitPromise: true, returnByValue: true
    });

    /* --brand'i olcebilmek icin gecici olarak yazdirma medyasina geciyoruz:
       "@media print" blogu yalnizca o sirada uygulanir, ekran medyasinda
       okunan deger sitenin normal mavisidir ve hicbir sey kanitlamaz.
       features her cagride yeniden verilmeli, yoksa sifirlaniyor. */
    await S("Emulation.setEmulatedMedia", { media: "print", features: MEDIA_FEATURES });

    /* Emniyet kemeri + saglik kontrolu. Yazdirma stili bunlari zaten
       hallediyor; buradaki amac ileride CSS degisirse ciktinin sessizce
       eksilmemesi. */
    const state = await S("Runtime.evaluate", {
      returnByValue: true,
      expression: [
        "(function () {",
        "  var rv = document.querySelectorAll('.reveal');",
        "  [].forEach.call(rv, function (el) {",
        "    el.style.transition = 'none';",
        "    el.classList.add('is-visible');",
        "  });",
        "  [].forEach.call(document.querySelectorAll('.project.is-hidden'), function (el) {",
        "    el.classList.remove('is-hidden');",
        "  });",
        "  var bad = [].filter.call(document.images, function (i) {",
        "    return !(i.complete && i.naturalWidth > 0);",
        "  });",
        "  /* Portre ayri kontrol edilmeli: <img> uzerindeki onerror kendini",
        "     DOM'dan siliyor, yani kirik fotograf document.images'e hic",
        "     girmiyor ve yukaridaki filtre onu asla goremiyor. Oysa yazdirma",
        "     stilinden gecen tek fotograf o. */",
        "  var photo = document.querySelector('.hero__photo-frame img');",
        "  var photoOk = !!(photo && photo.complete && photo.naturalWidth > 0) &&",
        "                !document.querySelector('.hero__photo-fallback');",
        "  /* Sayaclar animasyonun ortasinda yakalanirsa PDF'e yarim rakam",
        "     girer. Beklenen deger data-count + data-suffix. */",
        "  var stats = [].map.call(document.querySelectorAll('[data-count]'), function (e) {",
        "    var want = e.getAttribute('data-count') + (e.getAttribute('data-suffix') || '');",
        "    return { got: e.textContent.trim(), want: want };",
        "  });",
        "  var badStats = stats.filter(function (s) { return s.got !== s.want; })",
        "                      .map(function (s) { return s.got + '!=' + s.want; });",
        "  var mail = document.getElementById('mailText');",
        "  var probe = document.createElement('div');",
        "  probe.className = 'tag';",
        "  document.body.appendChild(probe);",
        "  var brand = getComputedStyle(document.documentElement)",
        "                .getPropertyValue('--brand').trim();",
        "  probe.remove();",
        "  return JSON.stringify({",
        "    reveal: document.querySelectorAll('.reveal.is-visible').length + '/' + rv.length,",
        "    projHidden: document.querySelectorAll('.project.is-hidden').length,",
        "    brokenImages: bad.length,",
        "    photoOk: photoOk,",
        "    stats: stats.map(function (s) { return s.got; }).join(' '),",
        "    badStats: badStats,",
        "    mailOk: !!(mail && mail.textContent.indexOf('@') !== -1),",
        "    fonts: document.fonts.status,",
        "    webfonts: Array.from(document.fonts).filter(function (f) {",
        "      return f.status === 'loaded';",
        "    }).length,",
        "    brand: brand",
        "  });",
        "})()"
      ].join("\n")
    });

    /* Olcum bitti; Page.printToPDF yazdirma medyasini kendisi uyguluyor. */
    await S("Emulation.setEmulatedMedia", { media: "", features: MEDIA_FEATURES });
    await sleep(400);

    /* A4. Kagit kenar bosluklarini "@page { margin: 12mm 12mm 10mm }" zaten
       belirliyor; asagidaki margin* degerleri onu ezmiyor. paperWidth /
       paperHeight sart: verilmezse Chrome US Letter uretir, oysa yazdirma
       stili A4 (794px) icin yazildi. */
    const res = await S("Page.printToPDF", {
      printBackground: true,      // kart zeminleri, ikon dolgular, zaman cizelgesi
      preferCSSPageSize: true,
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
      scale: 1
    });

    const buf   = Buffer.from(res.data, "base64");
    const info  = inspect(buf);
    const probe = JSON.parse(state.result.value);
    const dest  = path.join(OUT_DIR, page.out);

    /* Sessiz bozulmaya karsi kapi: gecmezse dosya yazilmaz. */
    const problems = [];
    if (!info.isPdf)                              problems.push("gecerli PDF degil");
    if (info.pages < 2 || info.pages > 4)         problems.push(info.pages + " sayfa (2-4 bekleniyor)");
    if (info.bytes < 100000)                      problems.push("cok kucuk: " + info.bytes + " bayt");
    if (probe.brokenImages !== 0)                 problems.push(probe.brokenImages + " gorsel yuklenmedi");
    if (!probe.photoOk)                           problems.push("hero fotografi yuklenmedi");
    if (probe.badStats.length)                    problems.push("istatistik rakamlari yanlis: " + probe.badStats.join(", "));
    if (probe.projHidden !== 0)                   problems.push(probe.projHidden + " proje gizli kaldi");
    if (!probe.mailOk)                            problems.push("e-posta adresi yerlesmedi");
    /* Yazdirma paleti: acik/koyu tema degiskenleri bu blogu ezerse cikti
       sitenin ekran renkleriyle basilir. #14497f yazdirma lacivertidir. */
    if (probe.brand !== "#14497f")                problems.push("yazdirma paleti uygulanmadi (--brand: " + probe.brand + ")");

    let wrote = "yazildi";
    if (problems.length) {
      failed++;
      wrote = "YAZILMADI";
    } else if (fs.existsSync(dest) && sameExceptDates(fs.readFileSync(dest), buf)) {
      wrote = "degismedi, dokunulmadi";
    } else {
      fs.writeFileSync(dest, buf);
    }

    if (probe.webfonts === 0) {
      console.warn("  UYARI: web fontlari yuklenmedi (internet yok?)." +
                   " PDF sistem yazi tipiyle uretilirdi.");
    }

    console.log(
      (problems.length ? "  HATA " : "  OK   ") + page.out + "  (" + wrote + ")\n" +
      "         " + info.pages + " sayfa, " + (info.bytes / 1024).toFixed(0) + " KB, " + info.mediaBox + "\n" +
      "         durum: " + state.result.value +
      (problems.length ? "\n         sorun: " + problems.join("; ") : "")
    );
    await client.send("Target.closeTarget", { targetId: targetId });
  }

  client.close();
  await shutdown();

  /* Damga yalnizca her sey basarili olduysa yazilir; yoksa --check bir daha
     hic "eskimis" demez ve bozuk cikti guncelmis gibi gorunur. */
  if (!failed) fs.writeFileSync(STAMP, sourceHash() + "\n");

  console.log("\n" + (failed ? failed + " sayfa basarisiz - dosyalar yazilmadi." : "Bitti -> " + OUT_DIR));
  process.exit(failed ? 1 : 0);
})().catch(function (e) {
  console.error("BASARISIZ:", e && e.message ? e.message : e);
  process.exit(1);
});
