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

2019'dan bu yana havayolu ve karayolu tehlikeli madde taşımacılığında güvenlik danışmanı (TMGD) olarak çalıştım. Bu işin bir kısmı mevzuatı bilmek: sınıflandırma, ambalajlama, etiketleme, dokümantasyon. Diğer kısmı ise çoğu zaman görünmeyen bir takip işi: hangi firmaya ne zaman gidileceği, hangi belgenin nerede olduğu, hangi eğitimin yaklaştığı.

TMGD Asistanı bu ikinci kısım için ortaya çıktı. Bu yazıda, ürünü geliştirmeme neden olan günlük sorunları ve bunları üründe nasıl ele aldığımı anlatıyorum.

<!-- ONAY: Girişe, danışmanlık yaparken yaşadığın ve bu ürünü düşünmene yol açan somut bir durum eklemek ister misin? (Firma ya da kişi adı vermeden.) Eklemeyeceksen bu notu sil. -->

## İşin görünmeyen kısmı: takip

Danışmanlık süreçleri çoğunlukla Excel tabloları ve kâğıt üzerinde yürüyor. Bir danışman birden fazla firmayı izliyor ve her firmanın kendi takvimi, kendi belgeleri, kendi yükümlülükleri var.

Bu düzende sorunlar tek tek büyük görünmüyor; ama küçük ve sürekliler:

- **Firma atamaları dağınık.** Hangi danışmanın hangi firmadan sorumlu olduğu farklı tablolarda ya da yazışmalarda duruyor.
- **Ziyaret takvimi ayrı bir yerde.** Denetim ve eğitim tarihleri bir yerde, ilgili notlar başka bir yerde.
- **Belge takibi zor.** Bir belgenin güncel hâline ulaşmak için klasörler ve yazışmalar arasında aramak gerekiyor.
- **Hatırlatmalar elle yapılıyor.** Yaklaşan bir mevzuat yükümlülüğünü hatırlamak, danışmanın kendi dikkatine kalıyor.

<!-- ONAY: Bu dört madde, TMGD Asistanı'nın sitedeki "çözülen problem" açıklamasından alındı. Kendi deneyiminde en çok zaman alan ya da en sık aksayan hangisiydi? Bir iki cümleyle ekleyebilirsin. -->

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

<!-- ONAY: Supabase'i ve bu yapıyı neden seçtiğini kendi cümlelerinle ekleyebilirsin. Gerekçe bilinmediği için yazılmadı. -->

## Sektörü bilmenin payı

Sektörde karşılaştığım problemlerin büyük bölümü aslında bir yazılım problemiydi. TMGD Asistanı, bu gözlemi doğrudan kendi mesleğimin günlük işlerine uyguladığım bir ürün.

<!-- ONAY: Ürünün bugünkü durumu ya da sonraki adımları hakkında bir iki cümle eklemek istersen buraya yaz. Doğrulanmadığı için eklenmedi. -->

Ürünü [tmgdasistani.app](https://tmgdasistani.app) adresinden inceleyebilir, ayrıntılarını [proje sayfasında](proje:tmgd-asistani) okuyabilirsiniz.
