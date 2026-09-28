---
title: Hafıza Tutucum'da neden cihaz üzerinde çalışan yapay zekâyı seçtim?
description: Not ve hatırlatma uygulaması Hafıza Tutucum'da yapay zekâ özelliklerini buluta göndermek yerine telefonda çalıştırmanın gerekçeleri, bedelleri ve kullandığım araçlar.
status: draft
# Yayımlarken tarihi YYYY-AA-GG biçiminde yaz (ör. 2026-10-15) ve status: published yap.
date:
category: Ürün geliştirme
related: [hafiza-tutucum]
---

<!-- ONAY: Bu taslak, sitedeki Hafıza Tutucum proje açıklamasından yazıldı; yaşamadığın bir olay, ölçüm ya da karar gerekçesi eklenmedi. Aşağıdaki ONAY notlarını yanıtlayıp sil. Yayımlanmış bir yazıda ONAY notu kalırsa site derlenmez. -->

Hafıza Tutucum, not almak, notlara soru sormak ve hatırlatma kurmak için geliştirdiğim bir Android uygulaması. En belirgin özelliği, yapay zekâ özelliklerinin tamamen telefonda çalışması: sunucu yok, hesap yok, bulut yok.

Bu yazıda bu tercihi neden yaptığımı ve karşılığında nelerden vazgeçildiğini anlatıyorum.

## Başlangıçtaki sorun

Akıllı not uygulamalarının çoğu veriyi buluta taşıyor ve yapay zekâ özellikleri için ücretli API'lere bağımlı kalıyor. Oysa bir not uygulamasına yazılanlar çoğu zaman kişisel: iş notları, yapılacaklar, randevular.

<!-- ONAY: Bu uygulamayı yapmaya seni iten kişisel bir ihtiyaç var mıydı? Varsa bir iki cümleyle ekle; bilinmediği için yazılmadı. -->

## Neden cihaz üzerinde?

Üç gerekçe öne çıkıyor:

1. **Veri telefondan çıkmıyor.** Notlar, sorular ve yanıtlar cihazda işleniyor; kullanıcının verisini bir sunucuya göndermek gerekmiyor.
2. **API bağımlılığı ve kullanım ücreti yok.** Bulut tabanlı bir dil modeli, her istekte ücretli bir API çağrısı demek. Telefonda çalışan bir modelde böyle bir çalışma maliyeti oluşmuyor.
3. **İnternetsiz çalışıyor.** Not almak, notlara soru sormak ve görseldeki metni okumak için bağlantı gerekmiyor.

<!-- ONAY: Bu üç gerekçe, sitedeki proje açıklamasından ("veri cihazdan hiç çıkmıyor", "çalışma maliyeti sıfır, API bağımlılığı yok", "hepsi internet olmadan") alındı. Karar verirken hangisi senin için belirleyiciydi? Sıralamayı ve ifadeleri kendine göre düzelt. -->

## Hangi araçlarla?

- **Dil modeli:** llama.rn ile llama.cpp tabanlı, GGUF biçiminde bir model telefonda çalışıyor.
- **Görseldeki metin:** ML Kit ile çevrimdışı metin tanıma (OCR).
- **Sesle not:** Konuşma tanıma ile dikte.
- **Hatırlatmalar:** Yazılan metinden hatırlatmalar otomatik olarak çıkarılıyor.
- **Uygulamanın kendisi:** React Native ve Expo; durum yönetimi için Zustand, birim testleri için Jest.

<!-- ONAY: Hangi modeli (adı ve boyutu) kullandığını ve modelin telefona nasıl geldiğini (uygulamayla birlikte mi, ilk açılışta indirilerek mi) eklemek istersen buraya yaz. Doğrulanmadığı için yazılmadı. -->

![Hafıza Tutucum'dan üç ekran: notlar, cihaz üzerinde yanıtlanan sorular ve gizlilik ayarları](/assets/img/projects/hafizatutucum.webp "Hafıza Tutucum'un mağaza görselleri")

## Bu tercihin bedeli

Cihaz üzerinde çalışan yapay zekânın bilinen sınırları var. Telefonda çalışabilecek modeller büyük bulut modellerine göre küçük; yanıt hızı ve kalitesi cihazın donanımına bağlı; model dosyası telefonda yer kaplıyor.

<!-- ONAY: Bu paragraf genel teknik bilgiye dayanıyor, Hafıza Tutucum'da ölçülmüş bir sonuç değil. Uygulamada gözlemlediğin gerçek bir sınırlama varsa ekle; ölçüm yoksa rakam yazma. -->

Bulut modelleri de başka projelerimde kullandığım bir seçenek; Anthropic Claude, Google Gemini ve OpenAI API'leriyle de çalışıyorum. Hafıza Tutucum'da ise önceliği gizliliğe ve internetsiz çalışmaya verdim.

## Sonuç

Kişisel notlarda yapay zekâdan yararlanmak, verinin bir sunucuya gitmesini gerektirmek zorunda değil. Hafıza Tutucum bu fikri uygulayan bir not ve hatırlatma asistanı.

Uygulamanın [Google Play sayfasına](https://play.google.com/store/apps/details?id=com.hafizatutucum.app) ve [proje sayfasına](proje:hafiza-tutucum) göz atabilirsiniz.
