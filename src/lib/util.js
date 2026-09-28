/* Küçük yardımcılar: HTML kaçışı, çift dilli alan seçimi, tarih, kimlik üretimi. */
"use strict";

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/* Metni HTML içine güvenle yazmak için. Şablonlardaki her değişken buradan geçer. */
function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return ESC[c]; });
}

/* { tr, en } biçimindeki alandan dile uygun değeri seçer; düz değeri olduğu gibi döndürür. */
function L(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("tr" in value || "en" in value)) {
    return value[lang] != null ? value[lang] : value.tr;
  }
  return value;
}

const MONTHS = {
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

/* "2026-10-01" -> "1 Ekim 2026" / "October 1, 2026". Saat dilimi kaymasın diye elle ayrıştırılır. */
function formatDate(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m) return "";
  const day = Number(m[3]);
  const month = MONTHS[lang][Number(m[2]) - 1];
  return lang === "tr" ? day + " " + month + " " + m[1] : month + " " + day + ", " + m[1];
}

function isValidDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
}

/* Başlıktan bağlantı kimliği: "Neden cihaz üzerinde?" -> "neden-cihaz-uzerinde" */
const TR_MAP = { "ç": "c", "ğ": "g", "ı": "i", "İ": "i", "ö": "o", "ş": "s", "ü": "u", "Ç": "c", "Ğ": "g", "Ö": "o", "Ş": "s", "Ü": "u", "â": "a", "î": "i", "û": "u" };
function slugify(text) {
  return String(text)
    .replace(/[çğıİöşüÇĞÖŞÜâîû]/g, function (c) { return TR_MAP[c]; })
    .toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "bolum";
}

/* Okuma süresi (dakika). Türkçe ve İngilizce için dakikada ~200 kelime. */
function readingMinutes(text) {
  const words = String(text).replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

module.exports = { esc, L, formatDate, isValidDate, slugify, readingMinutes };
