/* =============================================================================
   Suphi Atılım ÇELİKÖZ — site etkileşimleri
   Bağımlılık yok. Her blok kendi başına korunur: biri hata verirse diğerleri
   çalışmaya devam eder. JavaScript kapalıyken site eksiksiz okunur; yalnızca
   filtre düğmeleri görünmez ve e-posta/telefon açık yazılmaz.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var isTR = (document.documentElement.lang || "tr").toLowerCase().indexOf("en") !== 0;

  /* --- 1. Tema -------------------------------------------------------------- */
  (function theme() {
    var root = document.documentElement;
    var btn = $("#theme-toggle");
    if (!btn) return;

    var current = function () {
      return root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    };
    var label = function () {
      btn.setAttribute("aria-label", btn.getAttribute(current() === "light" ? "data-label-dark" : "data-label-light"));
    };
    label();

    btn.addEventListener("click", function () {
      var next = current() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("sac-theme", next); } catch (e) { /* gizli mod */ }
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "light" ? "#f7f9fc" : "#0b1120");
      label();
    });
  })();

  /* --- 2. Proje filtreleri ----------------------------------------------------
     Platform filtresi (Tümü / Web ve SaaS / Mobil). Seçim adrese de yazılır
     (?platform=mobile), böylece filtrelenmiş liste paylaşılabilir ve eski
     sitedeki #uygulamalar bağlantısı mobil listeye düşer. */
  (function filters() {
    var box = $("[data-filters]");
    var grid = $("#project-grid");
    if (!box || !grid) return;
    var buttons = $$(".filter", box);
    var cards = $$(".pcard", grid);
    var status = $("#filter-status");
    var valid = { all: 1, web: 1, mobile: 1 };

    var apply = function (f, push) {
      if (!valid[f]) f = "all";
      var shown = 0;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f)); });
      cards.forEach(function (card) {
        var show = f === "all" || (card.getAttribute("data-platforms") || "").split(" ").indexOf(f) !== -1;
        card.hidden = !show;
        if (show) shown++;
      });
      if (status) status.textContent = status.getAttribute("data-template").replace("{n}", shown);
      if (push && window.history && history.replaceState) {
        var url = new URL(window.location.href);
        if (f === "all") url.searchParams.delete("platform"); else url.searchParams.set("platform", f);
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
    };

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-filter"), true); });
    });

    box.hidden = false;
    var initial = "all";
    try { initial = new URLSearchParams(window.location.search).get("platform") || "all"; } catch (e) {}
    apply(initial, false);
  })();

  /* --- 3. E-posta ve telefon --------------------------------------------------
     HTML'de düz metin olarak durmaz; basit botlar toplayamasın diye burada
     birleştirilir. */
  (function contact() {
    var mail = $("#mail-link");
    var tel = $("#tel-link");
    var cta = $("#mail-cta");

    if (mail) {
      var addr = mail.getAttribute("data-u") + "@" + mail.getAttribute("data-d");
      $("#mail-text").textContent = addr;
      mail.setAttribute("href", "mailto:" + addr);
      if (cta) {
        cta.setAttribute("href", "mailto:" + addr + "?subject=" + encodeURIComponent(cta.getAttribute("data-subject") || ""));
      }
    }

    if (tel) {
      var raw = tel.getAttribute("data-p") || "";                      /* 905547948590 */
      var grouped = raw.replace(/^90/, "").replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
      $("#tel-text").textContent = isTR ? "0" + grouped : "+90 " + grouped;
      tel.setAttribute("href", "tel:+" + raw);
    }
  })();
})();
