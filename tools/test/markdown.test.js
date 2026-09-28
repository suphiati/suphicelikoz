/* Blog dönüştürücüsünün birim testleri:  node --test tools/test/
   Bağımlılık yok (Node'un kendi test aracı). */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { renderMarkdown } = require("../../src/lib/markdown");
const { parseFrontMatter } = require("../../src/lib/posts");

const opts = {
  resolveProject: function (slug) { return slug === "safecargo" ? "/projeler/safecargo/" : null; },
  newTabText: "(yeni sekmede açılır)"
};
const md = function (src, extra) { return renderMarkdown(src, Object.assign({}, opts, extra || {})); };

test("metindeki ve koddaki HTML kaçırılır", function () {
  const r = md("<script>alert(1)</script> ve `<b>`\n\n```\n<div>\n```");
  assert.ok(!r.html.includes("<script>"));
  assert.ok(r.html.includes("&lt;script&gt;"));
  assert.ok(r.html.includes("<code>&lt;b&gt;</code>"));
  assert.ok(r.html.includes("<pre><code>&lt;div&gt;</code></pre>"));
});

test("başlıklar Türkçe karakterden arındırılmış, benzersiz kimlik alır", function () {
  const r = md("## Neden cihaz üzerinde?\n\n## Neden cihaz üzerinde?\n\n### Şimdi ÇÖZÜM");
  assert.deepEqual(r.headings.map(function (h) { return h.id; }), ["neden-cihaz-uzerinde", "neden-cihaz-uzerinde-2", "simdi-cozum"]);
  assert.ok(r.html.includes('<h3 id="simdi-cozum">'));
});

test("yazı içinde h1 kullanılamaz (sayfa başlığı front matter'dan gelir)", function () {
  assert.throws(function () { md("# Başlık"); }, /h1/);
});

test("iç içe ve numaralı listeler", function () {
  const r = md("- bir\n- iki\n  - alt\n- üç\n  devam\n\n1. a\n2. b");
  assert.ok(r.html.includes("<ul><li>bir</li><li>iki\n<ul><li>alt</li></ul></li><li>üç devam</li></ul>"));
  assert.ok(r.html.includes("<ol><li>a</li><li>b</li></ol>"));
});

test("dış bağlantı yeni sekmede açılır ve ekran okuyucuya bildirilir", function () {
  const r = md("[site](https://ornek.com/?a=1&b=2)");
  assert.ok(r.html.includes('<a href="https://ornek.com/?a=1&amp;b=2" target="_blank" rel="noopener">site<span class="sr-only"> (yeni sekmede açılır)</span></a>'));
});

test("proje: bağlantısı yazının dilindeki proje sayfasına çözülür; bilinmeyen proje hata verir", function () {
  assert.ok(md("[SafeCargo](proje:safecargo)").html.includes('<a href="/projeler/safecargo/">SafeCargo</a>'));
  assert.throws(function () { md("[X](proje:yok-boyle)"); }, /Bilinmeyen proje/);
});

test("tek başına görsel, alt yazılı figüre dönüşür ve ölçü alır", function () {
  const r = md('![Açıklama](/assets/img/x.webp "Alt yazı")', { imageSize: function () { return { width: 800, height: 450 }; } });
  assert.equal(r.html, '<figure class="figure"><img src="/assets/img/x.webp" alt="Açıklama" width="800" height="450" loading="lazy" decoding="async"><figcaption>Alt yazı</figcaption></figure>');
});

test("onay notları yayında görünmez, yalnızca taslak önizlemesinde görünür; hepsi kaydedilir", function () {
  const src = "Metin <!-- ONAY: satır içi -->\n\n<!-- ONAY: çok\nsatırlı -->\n\n<!-- sıradan yorum -->";
  const pub = md(src);
  assert.deepEqual(pub.notes, ["satır içi", "çok satırlı"]);
  assert.ok(!pub.html.includes("ONAY") && !pub.html.includes("yorum"));
  const draft = md(src, { showNotes: true, noteLabel: "ONAY:" });
  assert.ok(draft.html.includes('<aside class="review-note" role="note"><strong>ONAY:</strong> çok satırlı</aside>'));
  assert.ok(draft.html.includes('<mark class="review-note-inline">ONAY: satır içi</mark>'));
});

test("kapanmamış kod bloğu açık hata verir", function () {
  assert.throws(function () { md("```js\nconst a = 1;"); }, /Kapanmamış kod bloğu/);
});

test("front matter: liste, tırnak, yorum ve boş değer", function () {
  const r = parseFrontMatter("---\ntitle: \"İki: nokta\"\n# yorum satırı\nrelated: [tmgd-asistani, safecargo]\nstatus: draft  # satır sonu yorumu\ndate:\n---\nGövde", "x.md");
  assert.deepEqual(r.data, { title: "İki: nokta", related: ["tmgd-asistani", "safecargo"], status: "draft", date: "" });
  assert.equal(r.body, "Gövde");
  assert.throws(function () { parseFrontMatter("Başlıksız dosya", "x.md"); }, /front matter/);
});
