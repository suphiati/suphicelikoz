/* =============================================================================
   ScratchMiles bölümü (yalnızca İngilizce): ürün özeti, gizlilik politikası,
   kullanım koşulları ve destek. Google Play ve App Store bu adresleri ister.
   Bu sayfalar ana menüde ve proje listesinde yoktur; site haritasındadır.
   Gizlilik ve destek metinleri uygulamadaki metinlerle aynıdır (scratchmiles
   deposu: docs/legal/PRIVACY.md, docs/legal/SUPPORT.md); birini değiştiren
   ötekini de değiştirir. Yer tutucular content/duskpath.js'teki gibidir.
   ========================================================================== */
"use strict";

const OPERATOR = "Suphi Atılım Çeliköz - SafeCargo Yazılım Teknoloji ve Danışmanlık Hizmetleri (Türkiye)";

const contact = function (intro) {
  return [
    '<section id="contact" aria-labelledby="contact-h">',
    '<h2 id="contact-h">Contact</h2>',
    intro,
    "</section>"
  ].join("\n");
};

module.exports = {
  operator: OPERATOR,
  navLabel: "ScratchMiles",
  order: ["overview", "privacy", "terms", "support"],
  pages: {
    overview: {
      path: "/scratchmiles/",
      nav: "Overview",
      title: "ScratchMiles: scratch-off travel map for your phone",
      description: "ScratchMiles is a scratch-off travel map: scratch gold foil off the countries and regions you have visited. Free, offline, no ads and no account.",
      kicker: "ScratchMiles",
      heading: "Your travels, scratched open.",
      lead: "Every country starts under gold foil. Tap one you have been to, say \"I've been here\", then scratch the foil away with your finger and watch your world map fill in.",
      body: [
        '<section aria-labelledby="get-h">',
        '<h2 id="get-h">What you get</h2>',
        "<ul>",
        "<li><strong>Real scratching.</strong> The foil comes off where your finger goes, country by country and region by region.</li>",
        "<li><strong>A collection.</strong> See every country and region you have revealed, with your trips and their dates.</li>",
        "<li><strong>A passport.</strong> Stamps, badges and statistics that grow as you travel.</li>",
        "<li><strong>Sharing and backups.</strong> Share your map as an image, and keep a backup file of your collection.</li>",
        "<li><strong>Seven languages.</strong> English, Turkish, German, Spanish, Portuguese, Italian and French.</li>",
        "</ul>",
        "</section>",
        '<section aria-labelledby="free-h">',
        '<h2 id="free-h">Free, offline and private</h2>',
        "<p>ScratchMiles is free. It has no ads, no purchases, no account and no tracking. It works offline, and your collection stays on your phone.</p>",
        "</section>",
        '<section aria-labelledby="avail-h">',
        '<h2 id="avail-h">Availability</h2>',
        "<p>ScratchMiles is coming to Google Play and the App Store.</p>",
        "</section>",
        '<section aria-labelledby="more-h">',
        '<h2 id="more-h">Read more</h2>',
        "<ul>",
        '<li><a href="/scratchmiles-privacy/">Privacy policy</a>: what the app stores and where it goes.</li>',
        '<li><a href="/scratchmiles-terms/">Terms of use</a>: the rules for using the app.</li>',
        '<li><a href="/scratchmiles-support/">Support</a>: moving to a new phone, problems and contact.</li>',
        "</ul>",
        "</section>"
      ].join("\n")
    },

    privacy: {
      path: "/scratchmiles-privacy/",
      nav: "Privacy policy",
      title: "ScratchMiles privacy policy",
      description: "The ScratchMiles privacy policy: what the app stores on your phone, what it does not do, sharing and backups, and how to delete your data.",
      kicker: "ScratchMiles",
      heading: "Privacy policy",
      lead: "ScratchMiles is a travel collection you keep on your own phone. This page says what the app stores and where it goes.",
      body: [
        '<p class="dp-meta">Last updated: 2 November 2026. Controller: ' + OPERATOR + ".</p>",

        '<section aria-labelledby="p1">',
        '<h2 id="p1">What the app stores</h2>',
        "<p>The countries and regions you mark, how far you scratched them, your trips with their dates, your badges and your settings (haptics, theme and language). All of it lives in a database on this phone and nowhere else.</p>",
        "</section>",

        '<section aria-labelledby="p2">',
        '<h2 id="p2">What the app does not do</h2>',
        "<p>There are no accounts, no sign-in, no analytics, no advertising and no tracking. The app never asks for your location and makes no network requests of its own.</p>",
        "</section>",

        '<section aria-labelledby="p3">',
        '<h2 id="p3">Sharing and backups</h2>',
        "<p>When you share your map or your passport, or export a backup, the app makes an image or a file on this phone and hands it to your phone's share sheet. Where it goes next is your choice, and the privacy terms of the app you pick apply there. Importing reads only the file you pick.</p>",
        "</section>",

        '<section aria-labelledby="p4">',
        '<h2 id="p4">Deleting your data</h2>',
        "<p>Settings › Reset everything deletes all of it from this phone, including the backup copies and share images the app kept in its cache. Uninstalling the app does the same. Your phone's own backup (Android backup or iCloud) may keep a copy of the app's data under your account; that copy follows your phone's backup settings.</p>",
        "</section>",

        contact("<p>Questions about privacy: {{mail}}. We will post changes to this policy here.</p>")
      ].join("\n")
    },

    terms: {
      path: "/scratchmiles-terms/",
      nav: "Terms of use",
      title: "ScratchMiles terms of use",
      description: "The terms of use for the ScratchMiles app: a free app with no account, your collection and backups, map data, liability, governing law and contact.",
      kicker: "ScratchMiles",
      heading: "Terms of use",
      body: [
        '<p class="dp-meta">Last updated: 28 November 2026. Provider: ' + OPERATOR + ".</p>",

        '<section aria-labelledby="t1">',
        '<h2 id="t1">1. The app</h2>',
        "<p>ScratchMiles is a free app for your personal use. It has no account, no purchases and no ads. It is meant for people aged 13 and over.</p>",
        "</section>",

        '<section aria-labelledby="t2">',
        '<h2 id="t2">2. Your collection and backups</h2>',
        "<p>Your collection stays on your phone, and it stays yours. We have no copy of it, so we cannot restore it if your phone is lost or the app is deleted. Export a backup (Settings › Export a backup) and keep the file somewhere safe. What you share from the app, and where, is your choice and your responsibility.</p>",
        "</section>",

        '<section aria-labelledby="t3">',
        '<h2 id="t3">3. Map data</h2>',
        "<p>Country and region borders come from Natural Earth, which is in the public domain. The map is a travel collection: the borders and names it shows are not a statement about the political or legal status of any territory, and they may be simplified or out of date.</p>",
        "</section>",

        '<section aria-labelledby="t4">',
        '<h2 id="t4">4. Acceptable use</h2>',
        "<p>Do not use the app, or images and files made with it, to break the law or the rights of others. Do not copy, resell or redistribute the app itself.</p>",
        "</section>",

        '<section aria-labelledby="t5">',
        '<h2 id="t5">5. Availability and changes</h2>',
        "<p>We may change or improve the app through updates from the store. We may update these terms and will post the new version on this page.</p>",
        "</section>",

        '<section aria-labelledby="t6">',
        '<h2 id="t6">6. Liability</h2>',
        "<p>The app is provided free of charge, as it is. Nothing in these terms excludes or limits any liability that the law of your country does not allow us to exclude or limit, or any right you have as a consumer.</p>",
        "</section>",

        '<section aria-labelledby="t7">',
        '<h2 id="t7">7. Stopping</h2>',
        "<p>You can stop using ScratchMiles at any time. Settings › Reset everything deletes your data from your phone, and uninstalling the app does the same.</p>",
        "</section>",

        '<section aria-labelledby="t8">',
        '<h2 id="t8">8. Law and disputes</h2>',
        "<p>These terms are governed by the laws of the Republic of Türkiye. If you are a consumer, you keep the protection of the mandatory laws of the country where you live, and you may bring a claim in the courts of that country.</p>",
        "</section>",

        contact("<p>Provider: " + OPERATOR + ". Email: {{mail}}</p>")
      ].join("\n")
    },

    support: {
      path: "/scratchmiles-support/",
      nav: "Support",
      title: "ScratchMiles support and contact",
      description: "Get help with ScratchMiles: moving your collection to a new phone, what to do when something looks wrong, deleting your data, and how to contact us.",
      kicker: "ScratchMiles",
      heading: "Support",
      lead: "ScratchMiles works offline and keeps your collection on this phone, so there is no account to recover and no server to check.",
      body: [
        '<section aria-labelledby="faq-h">',
        '<h2 id="faq-h">Common questions</h2>',
        "<h3>Moving to a new phone</h3>",
        "<p>Open Settings › Export a backup and save the file somewhere you can reach from the new phone. On the new phone, install ScratchMiles and open Settings › Import a backup.</p>",
        "<h3>Something looks wrong</h3>",
        "<p>Close the app completely and open it again. If it still happens, write to us and tell us what you did and what you saw. Please don't send your backup file unless we ask for it.</p>",
        "<h3>Deleting your data</h3>",
        '<p>Settings › Reset everything deletes all of it from this phone. See the <a href="/scratchmiles-privacy/">privacy policy</a> for details.</p>',
        "</section>",

        contact("<p>Email: {{mail}}. Please tell us your phone model and its Android or iOS version.</p>")
      ].join("\n")
    }
  }
};
