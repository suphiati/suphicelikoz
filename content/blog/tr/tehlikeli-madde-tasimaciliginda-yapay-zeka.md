---
title: Tehlikeli madde taşımacılığında yapay zekâ: nerede yardımcı olur, nerede dikkat ister?
description: Yapay zekânın tehlikeli madde taşımacılığında mevzuat arama, belge ön kontrolü ve eğitim hazırlığı gibi işlerde nasıl yardımcı olabileceğini, hangi risklerin dikkat istediğini ve güvenli kullanım için hangi ilkelere uyulması gerektiğini anlatıyorum.
status: draft
# Yayımlarken tarihi YYYY-AA-GG biçiminde yaz ve status: published yap.
date:
category: Yapay zekâ
related: [safecargo]
---

<!-- ONAY: Bu taslak genel mevzuat/teknik bilgilerden ve sitedeki doğrulanmış bilgilerden yazıldı; yaşamadığın bir olay, ölçüm ya da gerekçe eklenmedi. Onay notlarını yanıtlayıp sil. -->

2019–2026 arasında havayolu ve karayolu tehlikeli madde taşımacılığında güvenlik danışmanı (TMGD) olarak çalıştım. Bugün kendi şirketimde yazılım geliştiriyorum. Projelerimde Anthropic Claude, Google Gemini ve OpenAI API'lerini kullandım; bir uygulamamda da dil modelini tamamen telefonda çalıştırdım.

Bu iki alanı yan yana koyunca akla gelen soru şu: Yapay zekâ tehlikeli madde işinde neye yarar, nerede risk oluşturur? Bu yazıda olası kullanım alanlarını, dikkat isteyen noktaları ve böyle bir araç tasarlanırken gözetilmesi gereken ilkeleri anlatıyorum. Bunları kesinleşmiş çözümler olarak değil, yapay zekânın *yardımcı* olabileceği olası alanlar olarak okuyun. Belge kontrolü gibi bazı işler için kural tabanlı dijital araçlar zaten kullanılıyor.

<!-- ONAY: Bu konuyla neden ilgilendiğini ya da tehlikeli madde alanında yapay zekâyla ilgili bir planın olup olmadığını bir iki cümleyle ekleyebilirsin. Bilinmediği için yazılmadı. Eklemeyeceksen notu sil. -->

## Bu alan neden ayrı bir dikkat istiyor?

Tehlikeli madde taşımacılığında işin özü, bir maddeyi doğru tanımlamak ve onu doğru ambalaj, işaret, etiket ve belgeyle yola çıkarmak. Sınıflandırmadaki ya da belgedeki tek bir hata, gönderinin kabulde geri çevrilmesinden taşıma sırasında gerçek bir tehlikeye kadar uzanan sonuçlar doğurabilir.

Doğru cevap da tek bir yerde durmuyor:

- **Her taşıma modunun kendi kuralları var.** Karayolu için ADR, demiryolu için RID, denizyolu için IMDG Code, havayolu için ICAO Teknik Talimatları ve bunlara dayanan IATA DGR. Aynı madde için kurallar taşıma moduna göre değişebiliyor.
- **Mevzuat düzenli olarak değişiyor.** ADR, RID ve IMDG Code iki yılda bir güncelleniyor; IATA DGR her yıl yeni baskıyla çıkıyor ve 1 Ocak'ta yürürlüğe giriyor.
- **Farklılıklar var.** Havayolunda devletlerin ve havayolu şirketlerinin kendi farklılıkları da uygulanmak zorunda.

Kısacası bir sorunun doğru cevabı taşıma moduna, mevzuatın baskısına ve bazen taşıyan şirkete bağlı. Yapay zekâyı bu alanda değerlendirirken bu durumu akılda tutmak gerekiyor.

## Yapay zekâ nerede yardımcı olabilir?

Aşağıdakiler, bir dil modelinin ya da belge okuma teknolojisinin işi hızlandırabileceği olası alanlar. Hiçbiri son kararı vermiyor; hepsi insanın önüne bir taslak, bir öneri ya da bir uyarı koyuyor.

1. **Mevzuatta arama ve açıklama.** Mevzuat metinleri uzun ve önemli bir kısmı İngilizce. "Bu maddeyi sınırlı miktarda gönderebilir miyim?" gibi bir soruyu Türkçe sorup ilgili bölümü bulmak ve sade bir dille açıklatmak, arama süresini kısaltabilir.
2. **Belgelerin ön kontrolü.** Taşıma evrakındaki ya da havayolunda gönderici beyanındaki bilgilerin kendi içinde tutarlı olup olmadığına bakmak: UN numarası ile uygun sevkiyat adı eşleşiyor mu, gereken yerde ambalaj grubu yazılmış mı, miktar alanı boş mu? Bu bir onay değil; gözden kaçabilecek bir tutarsızlık için ikinci bir göz.
3. **Belge okuma (OCR).** Taranmış belgelerden ya da fotoğraflardan metni okuyup ilgili alanlara aktarmak. Örneğin güvenlik bilgi formunun taşımacılık bilgilerini içeren 14. bölümünü okumak. Burada da bir uyarı var: formun kendisi hatalı ya da eski olabilir.
4. **Sınıflandırmaya yardımcı öneri.** Ürün tanımından yola çıkarak incelenmesi gereken aday girişleri listelemek. Sınıflandırmanın kendisi ise maddenin özelliklerine ve mevzuattaki kriterlere göre sorumlu kişi tarafından yapılmalı.
5. **Eğitim içeriği hazırlama.** ADR ve IATA DGR, tehlikeli madde işinde görev alan personelin eğitimini zorunlu tutuyor. Senaryo, soru ve özet taslakları hazırlamak yapay zekânın hızlandırabileceği bir iş; içeriğin doğruluğunu ise eğitimi veren kişi kontrol etmeli.

<!-- ONAY: TMGD olarak çalışırken bu işlerden hangisi en çok zamanını alıyordu ya da hangisinde bir yardımcı araca ihtiyaç duydun? Bir iki cümleyle ekleyebilirsin. Bilinmediği için yazılmadı. Eklemeyeceksen notu sil. -->

## Nerede dikkat istiyor?

### Yanlış ama ikna edici cevap

Dil modelleri akıcı ve kendinden emin cevaplar üretir. Modelin gerçekte olmayan bir bilgiyi uydurmasına halüsinasyon deniyor. Sorun, uydurulan bilginin de doğru bilgiyle aynı akıcılıkla gelmesi. Genel bir konuda küçük bir hata tolere edilebilir. Ama yanlış bir ambalaj talimatı, yanlış bir miktar sınırı ya da hiç var olmayan bir özel hüküm, doğru bilgiyle aynı güvenle yazılabilir.

Asıl tehlike şu: Hatayı fark etmek için konuyu zaten bilmek gerekiyor. Mevzuata yeni başlayan biri ikna edici bir yanlışı ayırt etmekte zorlanır.

<!-- ONAY: Bir dil modeline tehlikeli madde sorusu sorup yanlış ama ikna edici bir cevap aldığın bir deneme olduysa buraya kısaca ekleyebilirsin. Bilinmediği için yazılmadı. Eklemeyeceksen notu sil. -->

### Güncel olmayan baskı

Bir dil modeli belirli bir tarihe kadar olan verilerle eğitilir. Eğitim verisinde mevzuatın birden fazla baskısı bulunabilir ve model bunları karıştırabilir. Cevabın hangi baskıya dayandığını da kendiliğinden söylemeyebilir. Bazı bölümleri her yıl değişen bir kurallar bütününde bu, göz ardı edilemeyecek bir risk.

### Sorumluluk devredilemez

Mevzuat sorumluluğu açıkça tanımlıyor. ADR'nin 1.4. bölümü, gönderenden tehlikeli maddenin sınıflandırıldığından ve taşınmasına izin verildiğinden emin olmasını, gerekli bilgi ve belgeleri sağlamasını ve uygun ambalaj kullanmasını ister. IATA DGR'de de maddenin tanımlanıp sınıflandırılması, ambalajlanması, işaretlenmesi, etiketlenmesi ve gönderici beyanının doldurulması göndericinin sorumluluğundadır. TMGD ise bu süreçlerin mevzuata uygun yürümesi için danışmanlık yapar.

Bir yapay zekâ aracı bu zincirin hiçbir halkasının yerine geçmez. "Araç öyle söyledi" demek sorumluluğu ortadan kaldırmaz.

### Veri gizliliği

Taşıma belgelerinde müşteri adları, adresler, içerik ve miktar bilgileri bulunur. Bu belgeleri bulut tabanlı bir yapay zekâ servisine göndermek, şirket verisinin ve kişisel verilerin başka bir şirkete, çoğu zaman da yurt dışındaki sunuculara gönderilmesi demek. KVKK yükümlülükleri, servis sağlayıcının veriyi nasıl kullandığı ve verinin nerede işlendiği önceden netleşmeli.

Bir seçenek de modeli cihazda çalıştırmak. [Hafıza Tutucum](proje:hafiza-tutucum)'da bu yolu seçtim: yapay zekâ özellikleri tamamen telefonda çalışıyor, veri cihazdan çıkmıyor. Bunun bedeli, telefonda çalışabilen modellerin büyük bulut modellerine göre daha küçük olması. Tehlikeli madde belgeleri gibi hata payı düşük bir alanda bunun yeterli olup olmadığı ayrıca değerlendirilmeli.

## Güvenli kullanım için ilkeler

Bu alanda yapay zekâ destekli bir araç tasarlanacaksa şu ilkeler temel alınmalı:

<!-- ONAY: Aşağıdaki ilkeler genel iyi uygulama olarak yazıldı; senin görüşünle örtüşüyorsa "bence" diyerek sahiplenebilirsin. Katılmadığın, farklı ifade etmek istediğin ya da eklemek istediğin bir ilke varsa düzelt. -->

1. **Son karar insanda.** Araç önerir, sorumlu kişi karar verir. Sınıflandırma, belge ve kabul kararı insan onayından geçmeden kesinleşmez.
2. **Her cevabın kaynağı görünür.** Cevap hangi mevzuatın hangi bölümüne dayandığını göstermeli; kullanıcı asıl metne kolayca ulaşabilmeli. Kaynağı gösterilemeyen bir cevap, cevap değil tahmindir.
3. **Baskı açıkça yazılır.** "ADR'ye göre" yetmez; "ADR 2025'e göre" gibi, cevabın hangi baskıya dayandığı belirtilmeli. Yeni baskı çıktığında eski baskıya dayanan içerik işaretlenmeli.
4. **Tablo bilgisi doğrudan tablodan okunur.** UN numarası, uygun sevkiyat adı, sınıf, ambalaj grubu, ambalaj talimatı ve miktar sınırları gibi bilgiler dil modelinin hafızasından değil, doğrudan tablodan gelmeli. Aynı UN numarası tabloda birden fazla satırda yer alabilir; örneğin ADR Tablo A'da UN 1993 farklı ambalaj grupları için ayrı satırlarda geçer. Hangi satırın geçerli olduğu tahmine bırakılmamalı.
5. **Veri ile açıklama ayrılır.** Ekranda mevzuat tablosundan gelen bilgi ile dil modelinin yazdığı açıklama birbirinden ayrı gösterilmeli. Kullanıcı neyin kural, neyin yorum olduğunu her an görebilmeli.
6. **Bilinmeyen yerde "bilmiyorum" denir.** İlgili hüküm bulunamazsa araç bunu açıkça söylemeli; boşluğu tahminle doldurmamalı.

Bu ilkelerin çoğu aslında yapay zekâ kullansın ya da kullanmasın her mevzuat aracı için geçerli. Kaynak göstermek, baskıyı belirtmek ve tablo verisini olduğu gibi sunmak, iyi bir başvuru aracının temel özellikleri.

## Sonuç

Yapay zekâ tehlikeli madde işinde aramayı, belge okumayı ve taslak hazırlamayı hızlandırabilecek bir yardımcı. Ama bu alanda hız tek başına değer taşımıyor; doğruluk, izlenebilirlik ve sorumluluk önce geliyor. Bu yüzden sorulması gereken soru "yapay zekâ bu işi yapabilir mi?" değil; "yapay zekâ bu işi yapan kişiye nasıl güvenli bir destek olabilir?"

<!-- ONAY: SafeCargo ya da TMGD Asistanı'nda yapay zekâ kullanmakla ilgili bir planın ya da görüşün varsa buraya ekleyebilirsin. Bu ürünlerde yapay zekâ kullanımı doğrulanmadığı için yazıda böyle bir şey söylenmedi. Eklemeyeceksen notu sil. -->

ADR Tablo A ve IATA DG List'i doğrudan sorgulayabileceğiniz, dört taşıma modunun kurallarını Türkçe ve tek yerde toplayan [SafeCargo](proje:safecargo)'ya proje sayfasından göz atabilirsiniz.
