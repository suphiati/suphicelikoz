---
title: TMGD Asistanı'nı geliştirmeme neden olan günlük sorunlar
description: Tehlikeli madde güvenlik danışmanlığında firma, ziyaret, belge ve hatırlatma takibinin neden dağınık kaldığını ve TMGD Asistanı'nda bu işleri nasıl tek panelde topladığımı anlatıyorum.
status: draft
# Yayımlarken tarihi YYYY-AA-GG biçiminde yaz (ör. 2026-10-01) ve status: published yap.
date:
category: Sektör deneyimi
related: [tmgd-asistani]
---

<!-- ONAY: Bu taslak, sitedeki mevcut proje ve kariyer bilgilerinden yazıldı; yaşamadığın bir olay, ölçüm ya da gerekçe eklenmedi. Aşağıdaki ONAY notlarını yanıtlayıp sil. Yayımlanmış bir yazıda ONAY notu kalırsa site derlenmez. -->

Tehlikeli madde güvenlik danışmanlığının bir kısmı mevzuatı bilmek: sınıflandırma, ambalajlama, etiketleme, dokümantasyon. Diğer kısmı ise çoğu zaman görünmeyen bir takip işi: hangi firmaya ne zaman gidileceği, hangi belgenin nerede olduğu, hangi eğitimin yaklaştığı.

TMGD Asistanı bu ikinci kısım için ortaya çıktı. Bu yazıda, ürünü geliştirmeme neden olan günlük sorunları ve bunları üründe nasıl ele aldığımı anlatıyorum.

<!-- ONAY: Başlık ve giriş, aşağıdaki sorunların bu ürünü geliştirme nedenin olduğunu söylüyor. Bu bilgi sitedeki proje açıklamasından çıkarıldı; doğru değilse düzelt. -->

## İşin görünmeyen kısmı: takip

Danışmanlık süreçleri çoğunlukla Excel tabloları ve kâğıt üzerinde yürüyor. Bir danışman birden fazla firmayı izliyor ve her firmanın kendi takvimi, kendi belgeleri, kendi yükümlülükleri var.

Bu düzende sorunlar tek tek büyük görünmüyor; ama küçük ve sürekliler:

- **Firma atamaları dağınık.** Hangi danışmanın hangi firmadan sorumlu olduğu farklı tablolarda ya da yazışmalarda duruyor.
- **Ziyaret takvimi ayrı bir yerde.** Denetim ve eğitim tarihleri bir yerde, ilgili notlar başka bir yerde.
- **Belge takibi zor.** Bir belgenin güncel hâline ulaşmak için klasörler ve yazışmalar arasında aramak gerekiyor.
- **Hatırlatmalar elle yapılıyor.** Yaklaşan bir mevzuat yükümlülüğünü hatırlamak, danışmanın kendi dikkatine kalıyor.

## Sorunları tek panelde toplamak

TMGD Asistanı'nda her sorunu ayrı bir özellikle karşılamaya çalıştım:

- **Atamalar:** Firma–danışman atamaları onaylı bir akışla yapılıyor. TMGD ve TMGD kuruluşu hesapları ayrı yetkilerle çalışıyor.
- **Takvim:** Ziyaret, denetim ve eğitim tarihleri tek takvimde.
- **Belgeler:** Belgeler platformdaki arşivde tutuluyor.
- **Hatırlatmalar:** Zamanlanmış görevler, yaklaşan işler için otomatik e-posta gönderiyor.
- **Raporlar:** Raporlar PDF olarak üretilebiliyor.

![TMGD Asistanı yönetim paneli: firma listesi, ziyaret takvimi ve dosya sayaçları](/assets/img/projects/tmgdasistani.webp "TMGD Asistanı'nın yönetim paneli")

## Teknik tarafta

Ürünü Next.js ve TypeScript ile geliştirdim. Veritabanı, kimlik doğrulama ve belge arşivi için Supabase kullanıyorum. Farklı rollerdeki kullanıcıların verisi satır seviyesinde güvenlik (RLS) kurallarıyla sınırlandırılıyor. E-posta gönderimi için Resend, uçtan uca testler için Playwright kullanıyorum.

Ürünü [tmgdasistani.app](https://tmgdasistani.app) adresinden inceleyebilirsiniz.
