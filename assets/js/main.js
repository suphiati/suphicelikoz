/* =============================================================================
   Suphi Atilim CELIKOZ - kisisel site etkilesimleri
   Bagimlilik yok, vanilla JS. Tum bolumler bagimsiz calisir: biri hata verse
   bile digerleri etkilenmesin diye her blok kendi guard'i ile korunur.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sayfa dili: index.html -> tr, en.html -> en */
  var isTR = (document.documentElement.lang || "tr").toLowerCase().indexOf("en") !== 0;
  var t = function (tr, en) { return isTR ? tr : en; };

  /* --- 1. Tema -------------------------------------------------------- */
  (function theme() {
    var root   = document.documentElement;
    var toggle = $("#themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("sac-theme", next); } catch (e) { /* private mode */ }
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "light" ? "#f4f7fc" : "#060a15");
    });
  })();

  /* --- 2. Header durumu ----------------------------------------------- */
  (function header() {
    var header = $("#header");
    var toTop  = $("#toTop");
    if (!header) return;

    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-stuck", y > 12);
      if (toTop) toTop.classList.toggle("is-visible", y > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  })();

  /* --- 3. Mobil menu --------------------------------------------------- */
  (function mobileNav() {
    var burger = $("#burger");
    var nav    = $("#nav");
    if (!burger || !nav) return;

    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute(
        "aria-label",
        open ? t("Menüyü kapat", "Close menu") : t("Menüyü aç", "Open menu")
      );
    };

    burger.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) setOpen(false);
    });
  })();

  /* --- 4. Scroll ile beliren ogeler ------------------------------------ */
  (function reveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });

    /* Guvenlik agi: gozlemci herhangi bir sebeple tetiklenmezse (throttle edilmis
       sekme, eski tarayici, arama motoru render'i) icerik gizli kalmasin. */
    window.setTimeout(function () {
      if (document.querySelector(".reveal.is-visible")) return;
      items.forEach(function (el) { el.classList.add("is-visible"); });
    }, 1500);
  })();

  /* --- 5. Istatistik sayaci -------------------------------------------- */
  (function counters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) return; // statik degerler zaten HTML'de

    var run = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var start  = null;
      var dur    = 1100;

      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { io.observe(el); });
  })();

  /* --- 6. Menude aktif bolum (scrollspy) -------------------------------- */
  (function scrollSpy() {
    var links = $$(".nav a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (!sec) return;
      map[id] = a;
      sections.push(sec);
    });
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var active = map[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  })();

  /* --- 7. Proje filtreleri ---------------------------------------------- */
  (function filters() {
    var buttons = $$(".filter");
    var cards   = $$("#projectGrid .project");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        cards.forEach(function (card) {
          var cats = (card.getAttribute("data-cat") || "").split(/\s+/);
          var show = f === "all" || cats.indexOf(f) !== -1;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  })();

  /* --- 8. Sertifika goruntuleyici (lightbox) ---------------------------- */
  (function lightbox() {
    var box     = $("#lightbox");
    var body    = $("#lbBody");
    var title   = $("#lbTitle");
    var issuer  = $("#lbIssuer");
    var closeEl = $("#lbClose");
    var buttons = $$("[data-cert]");
    if (!box || !body || !buttons.length) return;

    var lastFocus = null;

    var open = function (btn) {
      lastFocus = btn;
      title.textContent  = btn.getAttribute("data-title") || t("Sertifika", "Certificate");
      issuer.textContent = btn.getAttribute("data-issuer") || "";

      var src = btn.getAttribute("data-img");
      body.innerHTML = "";

      if (src) {
        var img = new Image();
        img.alt = (btn.getAttribute("data-title") || "") + t(" sertifikası", " certificate");
        img.src = src;
        img.onerror = function () { body.innerHTML = placeholder(); };
        body.appendChild(img);
      } else {
        body.innerHTML = placeholder();
      }

      box.hidden = false;
      void box.offsetHeight;              // gecise hazirlik: rAF'a bagli kalmadan reflow
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeEl.focus();
    };

    /* Belge taramasi konulmadiginda ziyaretcinin gordugu metin. Burada
       dosya yolu ya da "su klasore JPG birak" gibi bir gelistirici notu
       OLMAMALI: bu pencereyi acan kisi sertifikayi dogrulamaya geliyor,
       kurulum talimati okumaya degil. Taramalar assets/img/certs/ altina
       konuldugunda bu metin zaten hic gorunmez (bkz. README). */
    var placeholder = function () {
      return '<div class="lightbox__placeholder">' +
             "<span>" + t("Belgenin kopyası talep üzerine paylaşılır.",
                          "A copy of this document is available on request.") + "</span>" +
             "</div>";
    };

    var close = function () {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(function () { box.hidden = true; body.innerHTML = ""; }, 240);
      if (lastFocus) lastFocus.focus();
    };

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () { open(btn); });
    });
    closeEl.addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !box.hidden) close();
    });
  })();

  /* --- 9. E-posta ve telefon (bot koruması icin JS ile birlestirilir) ---- */
  (function contact() {
    var mailCard = $("#mailCard");
    var mailText = $("#mailText");
    var mailCta  = $("#mailCta");
    var telCard  = $("#telCard");
    var telText  = $("#telText");

    if (mailCard && mailText) {
      var addr = mailCard.getAttribute("data-u") + "@" + mailCard.getAttribute("data-d");
      mailText.textContent = addr;
      mailCard.setAttribute("href", "mailto:" + addr);
      if (mailCta) {
        mailCta.setAttribute(
          "href",
          "mailto:" + addr + "?subject=" +
            encodeURIComponent(t("Web sitesi üzerinden iletişim", "Contact via your website"))
        );
      }
    }

    if (telCard && telText) {
      var raw = telCard.getAttribute("data-p") || "";           // 905547948590
      var national = raw.replace(/^90/, "");                     // 5547948590
      var grouped = national.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
      telText.textContent = isTR ? "0" + grouped : "+90 " + grouped;
      telCard.setAttribute("href", "tel:+" + raw);
    }
  })();

  /* --- 10. CV indirme ----------------------------------------------------
     Burada JS yok: "CV Indir" butonlari artik assets/cv/ altindaki hazir
     PDF'e giden duz <a download> baglantilari. Eskiden window.print()
     cagriliyordu, yani buton indirmiyor yazdirma penceresi aciyordu.
     Ctrl+P hala eksiksiz calisiyor; butonun JS'te yaptigi iki hazirlik
     (reveal animasyonlarini acmak, filtrelenmis projeleri geri getirmek)
     yazdirma stiline tasindi. PDF'leri yenilemek icin:
       node tools/build-cv-pdf.js
     ---------------------------------------------------------------------- */

  /* --- 11. Yil ---------------------------------------------------------- */
  (function year() {
    var el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  })();
})();
