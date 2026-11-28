/* =============================================================================
   Duskpath bölümü (yalnızca İngilizce): ürün özeti, gizlilik politikası,
   kullanım koşulları, destek ve hesap silme. Google Play bu adresleri ister.
   Bu sayfalar ana menüde ve proje listesinde yoktur; site haritasındadır.
   Metinler bir HTML parçasıdır. İki yer tutucu vardır:
     {{mail}}     e-posta adresini betikle gösteren bağlantı (sayfada bir kez)
     {{mailref}}  aynı sayfadaki #contact bölümüne giden bağlantı
   Adres düz metin olarak HTML'e yazılmaz (bkz. assets/js/main.js).
   ========================================================================== */
"use strict";

const UPDATED = "23 November 2026";
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
  updated: UPDATED,
  operator: OPERATOR,
  navLabel: "Duskpath",
  order: ["overview", "privacy", "terms", "support", "deleteAccount"],
  pages: {
    overview: {
      path: "/duskpath/",
      nav: "Overview",
      title: "Duskpath: run, walk and ride tracker with an adaptive coach",
      description: "Duskpath is a run, walk and ride tracker with an adaptive coach, quests and fair, privacy-first social. Private by default. Coming to Google Play.",
      kicker: "Duskpath",
      heading: "Walk, run, ride and hike. Your way, your data.",
      lead: "Duskpath is a run, walk and ride tracker with an adaptive coach, quests and fair, privacy-first social. It records your activities reliably, even offline, and turns your progress into a quest.",
      body: [
        '<section aria-labelledby="get-h">',
        '<h2 id="get-h">What you get</h2>',
        "<ul>",
        "<li><strong>Reliable recording.</strong> Your GPS track is saved on your phone first. Recording never depends on the network, an account or a subscription.</li>",
        "<li><strong>An adaptive coach.</strong> Beginner-friendly training plans that adapt to how you feel.</li>",
        "<li><strong>Quests.</strong> Earn XP, badges and chapters of an adventure as you move. Race a ghost of your own earlier run.</li>",
        "<li><strong>Fair, privacy-first social.</strong> Activities are private by default. Anything you share has your home and routine cut out.</li>",
        "<li><strong>Your account is optional.</strong> Create one to back up your history and use a second phone.</li>",
        "</ul>",
        "</section>",
        '<section aria-labelledby="pro-h">',
        '<h2 id="pro-h">Free and Pro</h2>',
        "<p>Recording, history, basic stats, beginner plans, export, privacy controls and account deletion are free and stay free. Pro adds extra features, such as a second adventure. Pro is a subscription handled by the Apple App Store or Google Play, and you can cancel it there at any time.</p>",
        "</section>",
        '<section aria-labelledby="avail-h">',
        '<h2 id="avail-h">Availability</h2>',
        "<p>Duskpath is coming to Google Play. It is for people aged 18 and over.</p>",
        "</section>",
        '<section aria-labelledby="more-h">',
        '<h2 id="more-h">Read more</h2>',
        "<ul>",
        '<li><a href="/duskpath-privacy/">Privacy policy</a>: how we handle your data.</li>',
        '<li><a href="/duskpath-terms/">Terms of use</a>: the rules for using the app.</li>',
        '<li><a href="/duskpath-support/">Support</a>: help and how to contact us.</li>',
        '<li><a href="/duskpath-delete-account/">Delete your account</a>: how to delete your account and data.</li>',
        "</ul>",
        "</section>"
      ].join("\n")
    },

    privacy: {
      path: "/duskpath-privacy/",
      nav: "Privacy policy",
      title: "Duskpath privacy policy",
      description: "How Duskpath handles your data: what it collects and why, location and privacy zones, health data, social features, retention and your rights.",
      kicker: "Duskpath",
      heading: "Privacy policy",
      meta: true,
      body: [
        '<p class="dp-meta">Last updated: ' + UPDATED + ". Controller: " + OPERATOR + ". Privacy contact: {{mailref}}.</p>",

        '<section aria-labelledby="p1">',
        '<h2 id="p1">1. In short</h2>',
        "<ul>",
        "<li>The app works without an account. Without one, your activities stay on your phone.</li>",
        "<li>Location is sensitive. Activities are private by default, and we never use your location or health data for advertising.</li>",
        "<li>You can export everything and delete your account in the app.</li>",
        "<li>Duskpath is for people aged 18 and over.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="p2">',
        '<h2 id="p2">2. What we collect and why</h2>',
        '<div class="table-wrap" role="region" aria-labelledby="p2" tabindex="0">',
        "<table>",
        "<thead><tr><th scope=\"col\">Data</th><th scope=\"col\">Why</th><th scope=\"col\">Where</th></tr></thead>",
        "<tbody>",
        "<tr><td>Email address (and an Apple or Google account identifier if you use that sign-in)</td><td>To sign you in and keep your account.</td><td>Account, only if you create one</td></tr>",
        "<tr><td>Profile: username, display name, avatar, units, week start. Optional: birth year, gender, height, weight.</td><td>To show your profile and tailor units and goals. The optional fields only if you give them.</td><td>Phone; server with an account</td></tr>",
        "<tr><td>Activity summaries: times, distance, pace, sport, time zone</td><td>To show your history, stats and quest progress.</td><td>Phone; server with an account</td></tr>",
        "<tr><td>Raw GPS tracks (coordinates with times, accuracy, speed, altitude)</td><td>To record, show and, with an account, back up your activities and build the maps you choose to see or share.</td><td>Phone; private storage with an account</td></tr>",
        "<tr><td>Privacy zones (centre and radius)</td><td>To hide places such as your home from anything shared.</td><td>Phone; server with an account</td></tr>",
        "<tr><td>How a training session felt (effort, comparison with the plan, a pain flag)</td><td>To adapt your plan. This is health data, see section 4.</td><td>Phone; server only if you consent</td></tr>",
        "<tr><td>Plans, quest progress, saved routes</td><td>To run your plan and quests and back them up.</td><td>Phone; server with an account</td></tr>",
        "<tr><td>Social data, only if you use social features: follows and follow requests, kudos and comments, blocks and reports, club memberships and event answers (see section 5)</td><td>To run the social features you choose to use.</td><td>Server</td></tr>",
        "<tr><td>Purchase status: whether Pro is active and until when, an app user identifier, event records without card or payment details</td><td>To unlock Pro. Payment itself is handled by the app store and our subscription provider.</td><td>Server; subscription provider</td></tr>",
        "<tr><td>Consent records: which consent, which text version, when</td><td>To prove and honour your choices.</td><td>Server</td></tr>",
        "<tr><td>Crash and diagnostic information: error codes, app version, device model and OS version, without coordinates or health values</td><td>To find and fix bugs.</td><td>Crash reporting service in the EU</td></tr>",
        "<tr><td>Usage analytics</td><td>Only if you turn it on. Off by default, and nothing is sent before you agree. Never contains location.</td><td>The service is not chosen yet; we will name it here before analytics is switched on</td></tr>",
        "</tbody>",
        "</table>",
        "</div>",
        "<p>We do not collect your contacts or advertising identifiers, and we do not sell your data.</p>",
        "</section>",

        '<section aria-labelledby="p3">',
        '<h2 id="p3">3. Location and privacy zones</h2>',
        "<ul>",
        "<li>The app records location only while you have started a recording, and shows a notification while it does.</li>",
        "<li>Your tracks stay on your phone. With an account they are backed up to a private store that only you can read.</li>",
        "<li>Activities are private by default.</li>",
        "<li>When something is shared (a share card or a map preview), the start and finish are cut, and every stretch inside a privacy zone is cut together with an extra random distance, so the cut does not reveal where the zone ends. Shared images carry no times of day.</li>",
        "<li>Map tiles are requested from a map provider while you look at a map, which tells that provider the area you view. No tile requests are made while the app is in the background. The provider is not chosen yet and will be named here before release.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="p4">',
        '<h2 id="p4">4. Health data and consent</h2>',
        "<p>Pain flags and effort ratings are health data (a special category under GDPR and KVKK). They stay on your phone and drive your local coach. They are sent to the server only if you turn on \"Back up how you feel\", which is off by default and asks for your explicit consent. We record the consent with the text version and the time. If you turn it off, we delete the stored copies. We never use health data for advertising or analytics. Duskpath does not make medical claims and is not a medical device.</p>",
        '<h3 id="p4-hc">Health Connect (Android)</h3>',
        "<p>On Android you can connect Duskpath to Health Connect. Every part is optional, off until you allow it, and you can turn it off at any time. If you allow it, Duskpath saves your finished activities (sport, start and end time, distance, title and notes) to Health Connect on your phone, and, only if you turn on a separate switch, the route. Activities you import from files are never saved there.</p>",
        "<p>If you also allow it, and have turned on \"Back up how you feel\", Duskpath reads the heart-rate readings Health Connect holds for the time of an activity and shows them on that activity. These readings, and the average and maximum worked out from them, stay on your phone: they are not sent to our servers or to anyone else. We keep them on your phone until you delete the activity, withdraw your health consent, or remove your account data from the phone, and they are included when you export your data. We do not read workouts from other apps.</p>",
        "<p>When you disconnect, Duskpath stops saving and reading and gives its access back; workouts already saved stay in Health Connect until you remove them, and the app can remove the ones it saved. Health data from Health Connect is never used for advertising or analytics. Duskpath does not make medical claims and is not a medical device.</p>",
        "</section>",

        '<section aria-labelledby="p5">',
        '<h2 id="p5">5. Social features and who can see what</h2>',
        "<p>Social features are optional and are switched on in stages. If a feature below is not available in your version of the app, it does not apply to you yet. Nothing here changes the default: your activities are private unless you decide otherwise.</p>",
        "<ul>",
        "<li><strong>Visibility.</strong> Each activity is private or visible to your followers. Only people whose follow request you accepted can see an activity that you set to followers, and only as a privacy-safe preview: the start and finish and any stretch inside your privacy zones are cut, and a title that would reveal the time of day is replaced by the sport name.</li>",
        "<li><strong>Your profile.</strong> People who look you up can see your username, display name, level and follower and following counts. You can turn off being discoverable, so that people find you only by your exact username. A follow starts as a request that you accept or decline, and you can end a follow at any time.</li>",
        "<li><strong>Kudos and comments.</strong> Only you and your accepted followers can give kudos or comment on your activity.</li>",
        "<li><strong>Block and report.</strong> You can block a person, which ends any follow between you and removes the kudos and comments you left on each other's activities. You can report a person, comment, route, club or event. A report keeps a copy of the reported content, without any coordinates, so that it can be reviewed even if the content is deleted. That copy is deleted 12 months after the report was handled.</li>",
        "<li><strong>Challenges and fair leagues.</strong> Friend challenges are by invitation. Leagues and challenges count activities that you record in the app; activities you import from files do not earn XP, entries or league points.</li>",
        "<li><strong>Public routes.</strong> A route is public only if you publish it. The public copy carries the name, sport, distance, elevation, whether it is a loop, the route line with the privacy cut applied and your username. It carries no times, privacy zones or link to the activity. It is removed when you delete the saved route or your account, or when you add or move a privacy zone near it.</li>",
        "<li><strong>Clubs and events.</strong> A club shows its name, description, rules, sport and an area label, such as a town, and its members see each other's username and display name. A club event shows an approximate area only: a circle of 750 metres around a centre that is drawn near the real meeting point. The exact meeting point is held on our server and is shown only to the club's owner and admins and to members who answered \"going\". It is cleared 24 hours after the event ends, and at once if the event is cancelled or the club is removed. Events are deleted 90 days after they end. We do not let you place an event within 200 metres of the edge of one of your own privacy zones.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="p6">',
        '<h2 id="p6">6. Who we share data with</h2>',
        "<p>We do not share your activities with other people, except as you choose through the social features in section 5. Service providers process data on our behalf:</p>",
        "<ul>",
        "<li>Our backend and storage provider, in an EU region.</li>",
        "<li>Our subscription provider (RevenueCat) and the app stores (Apple, Google), for purchases.</li>",
        "<li>A crash reporting service with EU data residency.</li>",
        "<li>An email provider, to send your sign-in code.</li>",
        "<li>A map tile provider.</li>",
        "</ul>",
        "<p>Some of these providers are not chosen yet. We will list the providers, and the legal basis for any transfer outside your country (for example to the United States), here once they are confirmed.</p>",
        "</section>",

        '<section aria-labelledby="p7">',
        '<h2 id="p7">7. Legal bases</h2>',
        "<ul>",
        "<li>Contract: to provide recording, backup and sync that you ask for, and your account.</li>",
        "<li>Consent: for health data, analytics, marketing and optional reminders. You can withdraw it at any time.</li>",
        "<li>Legitimate interest: for security, fraud prevention and minimal crash reporting.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="p8">',
        '<h2 id="p8">8. How long we keep data</h2>',
        "<ul>",
        "<li>On your phone: until you delete it, or remove it when you sign out.</li>",
        "<li>On the server: until you delete the activity or your account.</li>",
        "<li>A deleted activity is hidden at once and can be restored for 30 days, then it is removed with its files.</li>",
        '<li>After you ask to delete your account, your sessions end immediately and everything is removed within 30 days (see <a href="/duskpath-delete-account/">Delete your account</a>).</li>',
        "<li>Purchase event records are kept with your account and deleted with it. The app stores and our subscription provider keep their own records under their own rules.</li>",
        "<li>Security audit records hold only identifiers and the outcome of a step, and are kept for 12 months. Sync receipts are kept for 30 days.</li>",
        "<li>Club event details are kept as described in section 5.</li>",
        "<li>Backups at our hosting provider expire on the provider's schedule, which we will state here once it is confirmed.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="p9">',
        '<h2 id="p9">9. Your rights and how to use them</h2>',
        "<p>Depending on where you live (for example under GDPR, UK GDPR, KVKK or CCPA) you can:</p>",
        "<ul>",
        "<li><strong>Access and export:</strong> in the app, Profile, Import and export. You get your activities as GPX files and a JSON archive.</li>",
        "<li><strong>Correct:</strong> edit your profile and activities in the app.</li>",
        '<li><strong>Delete:</strong> delete single activities, privacy zones or your whole account in the app, or by email (see <a href="/duskpath-delete-account/">Delete your account</a>).</li>',
        "<li><strong>Withdraw consent:</strong> in the app's privacy settings, at any time. Withdrawing does not affect what happened before.</li>",
        "<li><strong>Object, restrict or complain:</strong> email us. You may also complain to your data protection authority.</li>",
        "</ul>",
        "<p>We answer within 30 days. To protect your account we may ask you to write from the email address of your account.</p>",
        "</section>",

        '<section aria-labelledby="p10">',
        '<h2 id="p10">10. Children</h2>',
        "<p>Duskpath is for people aged 18 and over. The app asks for your birth year before sign-in and keeps only the result of the check on your phone. If you believe a child has an account, please contact us and we will delete it.</p>",
        "</section>",

        '<section aria-labelledby="p11">',
        '<h2 id="p11">11. Security</h2>',
        "<p>Everything on the server is private to your account and checked at the database level. Sessions are short-lived and are revoked when you sign out or delete your account. Coordinates, tokens and health values are never written to logs. No system is perfectly secure, and we will tell you and the authorities about a breach where the law requires it.</p>",
        "</section>",

        contact("<p>We will post changes to this policy here and tell you in the app when they are important. Controller: " + OPERATOR + ". Email: {{mail}}</p>")
      ].join("\n")
    },

    terms: {
      path: "/duskpath-terms/",
      nav: "Terms of use",
      title: "Duskpath terms of use",
      description: "The terms of use for the Duskpath app: who can use it, safe use, your content, free features and Pro, liability, governing law and contact.",
      kicker: "Duskpath",
      heading: "Terms of use",
      body: [
        '<p class="dp-meta">Last updated: ' + UPDATED + ". Provider: " + OPERATOR + ".</p>",

        '<section aria-labelledby="t1">',
        '<h2 id="t1">1. Who can use Duskpath</h2>',
        "<p>You must be at least 18 years old. You are responsible for your account and for keeping your sign-in secure.</p>",
        "</section>",

        '<section aria-labelledby="t2">',
        '<h2 id="t2">2. Using the app safely</h2>',
        "<ul>",
        "<li>Exercise is physical activity and can be risky. Check with a doctor if you are unsure about your health before you start a plan.</li>",
        "<li>Duskpath gives general guidance only. It is not medical advice and not a medical device.</li>",
        "<li>Pay attention to your surroundings, traffic and the weather. Do not use the app in a way that distracts you from them.</li>",
        "<li>GPS can be wrong. Distances, paces and routes are estimates.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="t3">',
        '<h2 id="t3">3. Your content</h2>',
        "<p>Your activities, tracks and notes stay yours. You give us the permission needed to store, process and show them to you, and to build the previews and share cards that you choose to create. You must not upload files you have no right to use.</p>",
        "</section>",

        '<section aria-labelledby="t4">',
        '<h2 id="t4">4. Acceptable use</h2>',
        "<p>Do not misuse the service: no attacks, scraping or automated access, no attempt to reach another person's data, no tampering with purchases, no faking activities to gain XP, rankings or rewards. We may limit or close accounts that do.</p>",
        "</section>",

        '<section aria-labelledby="t5">',
        '<h2 id="t5">5. Free features and Pro</h2>',
        "<ul>",
        "<li>Recording, history, basic stats, beginner plans, export, privacy controls and account deletion are free.</li>",
        "<li>Pro is an optional paid subscription with extra features. Price, billing period and any trial are shown in the app and the store before you buy.</li>",
        "<li>Payment is taken by the Apple App Store or Google Play. Subscriptions renew automatically until you cancel them in your store account, at least 24 hours before the period ends (check your store's rules). Deleting your Duskpath account does not cancel a store subscription.</li>",
        "<li>Refunds are handled by the store under its policy. When a purchase is refunded or expires, Pro ends.</li>",
        "<li>If Pro ends, your data stays yours and recording keeps working.</li>",
        "</ul>",
        "<p>Consumer rights that the law gives you, such as a right of withdrawal, are not limited by these terms.</p>",
        "</section>",

        '<section aria-labelledby="t6">',
        '<h2 id="t6">6. Availability and changes</h2>',
        "<p>We work to keep the service running but cannot promise it will always be available. We may change features, and we will tell you about changes that matter. We may update these terms and will ask you to accept important changes.</p>",
        "</section>",

        '<section aria-labelledby="t7">',
        '<h2 id="t7">7. Liability</h2>',
        "<p>Nothing in these terms excludes or limits any liability that the law of your country does not allow us to exclude or limit, or any right you have as a consumer.</p>",
        "</section>",

        '<section aria-labelledby="t8">',
        '<h2 id="t8">8. Ending the agreement</h2>',
        '<p>You can stop using Duskpath and delete your account at any time (see <a href="/duskpath-delete-account/">Delete your account</a>). We may suspend or end access for breach of these terms.</p>',
        "</section>",

        '<section aria-labelledby="t9">',
        '<h2 id="t9">9. Law and disputes</h2>',
        "<p>These terms are governed by the laws of the Republic of Türkiye. If you are a consumer, you keep the protection of the mandatory laws of the country where you live, and you may bring a claim in the courts of that country.</p>",
        "</section>",

        contact("<p>Provider: " + OPERATOR + ". Email: {{mail}}</p>")
      ].join("\n")
    },

    support: {
      path: "/duskpath-support/",
      nav: "Support",
      title: "Duskpath support and contact",
      description: "Get help with Duskpath: how to contact us, common questions about recording, exporting data, deleting your account and Pro, and how to report a security problem.",
      kicker: "Duskpath",
      heading: "Support",
      lead: "We are a small team. We read every message.",
      body: [
        contact([
          "<p>Email {{mail}}. Please do not send coordinates, tracks or health details by email. We answer privacy requests within 30 days and other questions as soon as we can.</p>",
          "<p>Please tell us your phone model and Android or iOS version, the app version (Profile, About) and what happened. We never need your password, and we will never ask for it.</p>"
        ].join("\n")),

        '<section aria-labelledby="faq-h">',
        '<h2 id="faq-h">Common questions</h2>',
        "<h3>My recording stopped or looks wrong</h3>",
        "<p>Recording is saved on your phone as it happens, so a crash should not lose it. Open Duskpath again and check your history. Make sure battery saving is not stopping the app while you move, and that location is allowed while the app is in use.</p>",
        "<h3>How do I get my data?</h3>",
        "<p>Profile, Import and export. You get GPX files and a JSON archive.</p>",
        "<h3>How do I delete my account?</h3>",
        '<p>See <a href="/duskpath-delete-account/">Delete your account</a>.</p>',
        "<h3>Pro: restore, refund or cancel</h3>",
        "<ul>",
        "<li>Restore: in the app, open the subscription screen and choose Restore purchases while signed in to your store account.</li>",
        "<li>Cancel: in your Apple App Store or Google Play subscriptions.</li>",
        "<li>Refund: ask the store you bought from. When it is refunded, Pro ends.</li>",
        "</ul>",
        "<h3>Report a security problem</h3>",
        "<p>Email the address in the Contact section with \"Security\" in the subject. Please give us a reasonable time to fix a problem before you tell others.</p>",
        "</section>"
      ].join("\n")
    },

    deleteAccount: {
      path: "/duskpath-delete-account/",
      nav: "Delete account",
      title: "Delete your Duskpath account and data",
      description: "How to delete your Duskpath account and the data stored with it, in the app or by email: what is deleted, when, and what deleting does not do.",
      kicker: "Duskpath",
      heading: "Delete your Duskpath account",
      lead: "You can delete your account and the data stored with it at any time. The quickest way is in the app.",
      body: [
        '<section aria-labelledby="d-app">',
        '<h2 id="d-app">In the app</h2>',
        "<ol>",
        "<li>Open Duskpath and sign in.</li>",
        "<li>Open the Profile tab, scroll to the bottom and tap Delete account (below Sign out). It shows only while you are signed in.</li>",
        "<li>If you want a copy of your data, choose Export first.</li>",
        "<li>Read what will be deleted and confirm.</li>",
        "</ol>",
        "<p>Your sessions end immediately, on every phone.</p>",
        "</section>",

        '<section id="contact" aria-labelledby="d-mail">',
        '<h2 id="d-mail">By email</h2>',
        "<p>If you cannot open the app, write to {{mail}} from the email address of your account, with the subject \"Delete my Duskpath account\". We may ask you to confirm that the account is yours. We will answer within 30 days, and normally much sooner.</p>",
        "</section>",

        '<section aria-labelledby="d-what">',
        '<h2 id="d-what">What is deleted</h2>',
        "<ul>",
        "<li>Your account, sign-in details and profile.</li>",
        "<li>Your activities, splits and GPS track files, and the previews built from them.</li>",
        "<li>Your privacy zones, training plans, session feedback and quest progress, including XP and badges.</li>",
        "<li>Your saved routes and any public copy of them, your challenge joins and your consent records.</li>",
        "<li>Your social data, if you used social features: follows, kudos and comments, club memberships and event answers. A club that you own passes to another member or, if there is none, is removed.</li>",
        "<li>Your Pro entitlement and purchase event records on our server.</li>",
        "<li>Your record at our subscription provider, and your user in our crash reporting service, which we ask to delete it.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="d-when">',
        '<h2 id="d-when">When</h2>',
        "<ul>",
        "<li>At once: your sessions are revoked and the account stops working.</li>",
        "<li>Within 30 days at the latest: all data above is removed. In practice a background job finishes this within hours. We remove your files first and delete the account itself only after nothing is left.</li>",
        "<li>Backups at our hosting provider expire on the provider's schedule, which we will state here once it is confirmed.</li>",
        "<li>Records that identify no one, such as a security audit entry with an identifier and the result of a step, are kept for up to 12 months.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="d-kept">',
        '<h2 id="d-kept">What is kept, and why</h2>',
        "<ul>",
        "<li><strong>Purchase records at the stores and our subscription provider.</strong> The Apple App Store, Google Play and our subscription provider keep their own purchase and payment records under their own rules and the law that applies to them, which we cannot delete for you.</li>",
        "<li><strong>Anonymous security records.</strong> Audit entries that identify no one are kept for up to 12 months, to protect the service.</li>",
        "<li><strong>Reports.</strong> If you reported something, or something about you was reported, the copy kept for review is deleted 12 months after the report was handled.</li>",
        "</ul>",
        "</section>",

        '<section aria-labelledby="d-not">',
        '<h2 id="d-not">What deleting does not do</h2>',
        "<ul>",
        "<li><strong>It does not cancel a subscription.</strong> Cancel Pro in the Apple App Store or Google Play subscriptions screen. The stores keep their own purchase records under their own rules.</li>",
        "<li>Data on your phone stays until you remove it, or you can choose \"remove data from this device\" when you sign out. Uninstalling the app removes it.</li>",
        "<li>Anything you exported or shared as an image is outside our control.</li>",
        "</ul>",
        "</section>"
      ].join("\n")
    }
  }
};
