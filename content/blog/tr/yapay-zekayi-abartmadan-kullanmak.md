---
title: Yapay zekâyı abartmadan kullanmak
description: Dil modellerinin neyi iyi yapıp nerede yanıldığını, bulut ve cihaz üzerinde çalışan modeller arasındaki farkları ve geleneksel sektörlerde yapay zekâyı küçük, ölçülebilir işlerle denemeyi anlatıyorum.
status: draft
# Yayımlarken tarihi YYYY-AA-GG biçiminde yaz ve status: published yap.
date:
category: Yapay zekâ
related: [hafiza-tutucum]
---

<!-- ONAY: Bu taslak genel teknik bilgilerden yazıldı; yaşamadığın bir olay, ölçüm ya da gerekçe eklenmedi. Yazıyı onaylarsan bu notu sil. -->

Yapay zekâ konuşulurken genellikle iki uç öne çıkıyor: ya her işi yapacak ya da hiçbir işe yaramayacak. Oysa ikisi de gerçeği tam yansıtmıyor.

Bu yazıda dil modellerinin neyi iyi yaptığını, nerede tökezlediğini ve özellikle geleneksel sektörlerde çalışanların yapay zekâyı nasıl küçük ve ölçülebilir adımlarla deneyebileceğini anlatıyorum.

## Dil modeli aslında ne yapıyor?

Bir dil modeli, kendisine verilen metnin devamında hangi kelimenin (daha doğrusu hangi metin parçasının) gelmesinin olası olduğunu tahmin ederek yanıt üretir. Bunu çok büyük miktarda metinden öğrendiği örüntülere dayanarak yapar. Yani model bir bilgiyi bir veritabanından okuyup getirmez; olası bir metin üretir.

Bu yapı bazı işlerde çok kullanışlı:

- **Taslak çıkarmak:** e-posta, duyuru, eğitim notu ya da rapor için ilk metin.
- **Özetlemek ve yeniden yazmak:** uzun bir metni kısaltmak, dili sadeleştirmek, tonu değiştirmek.
- **Metinden bilgi ayıklamak:** serbest yazılmış bir notun içinden tarih, kişi ya da iş kalemi çıkarmak.
- **Sınıflandırmak:** gelen talepleri konu başlıklarına ayırmak gibi tekrar eden işler.
- **Kod yazmaya yardım etmek:** tekrar eden kodu yazmak, bir hatanın olası nedenlerini sıralamak.

Aynı yapı, bazı sınırları da beraberinde getiriyor.

### Güncellik

Model, eğitildiği tarihe kadarki metinlerden öğrenir. Arama ya da belge okuma gibi bir araca bağlanmamışsa, o tarihten sonra değişen bir şeyi bilmez; bilmediğini de her zaman söylemez.

Tehlikeli madde mevzuatı bunun iyi bir örneği. ADR iki yılda bir, IATA DGR her yıl yeni baskıyla güncelleniyor. Bir dil modeli, eski bir baskıya dayanan bir yanıtı da güncel bir yanıt kadar kendinden emin bir dille yazabilir.

### Halüsinasyon

Modelin gerçekte olmayan bir bilgiyi akıcı ve inandırıcı bir dille üretmesine halüsinasyon deniyor. Var olmayan bir kaynak, yanlış bir madde numarası ya da uydurma bir sayı; hepsi doğru bilgiyle aynı tonda yazılabiliyor.

Bu, bir kerede düzeltilip tamamen ortadan kaldırılabilecek bir hata değil; olasılığa dayalı metin üretmenin bir yan etkisi. Modeli güvenilir belgelere dayandırmak, arama gibi araçlara bağlamak ve talimatları iyi yazmak bu riski azaltıyor ama sıfırlamıyor.

## Bulutta mı, cihazda mı?

Dil modelini kullanmanın iki temel yolu var: bir bulut servisine istek göndermek ya da modeli doğrudan cihazda çalıştırmak. İkisi arasında seçim yaparken birkaç açıdan artıyı ve eksiyi tartmak gerekiyor:

- **Kalite:** Bulut modelleri çok büyük donanımlarda çalışıyor; uzun ve karmaşık görevlerde genellikle daha iyi sonuç veriyor. Telefonda çalışabilecek modeller daha küçük.
- **Gizlilik:** Bulut kullanıldığında metin, servis sağlayıcının sunucusuna gidiyor. Cihaz üzerinde çalışan modelde veri cihazdan çıkmıyor.
- **Maliyet:** Bulut API'leri genellikle kullanım miktarına göre ücretlendiriliyor. Cihaz üzerinde çalışan modelde istek başına bir ücret yok; ama hesaplama yükü kullanıcının cihazına biniyor.
- **İnternet bağımlılığı:** Bulut modeli bağlantı ister. Cihazdaki model çevrimdışı çalışabiliyor.
- **Cihaz yükü:** Cihaz üzerindeki model depolama alanı kaplıyor; hızı cihazın donanımına bağlı.

Tek bir doğru yok. Hangi yolun seçileceği, işlenen verinin ne kadar hassas olduğuna, beklenen kaliteye ve bütçeye bağlı.

## Çıktıyı nasıl değerlendirmeli?

Dil modelinin çıktısını, işini bilen ama bazen emin olmadığı konuda da emin konuşan bir çalışma arkadaşının taslağı gibi okumak iyi bir başlangıç. Değerlendirirken şu dört soru işe yarar bir çerçeve sunuyor:

1. **Bu bilgi kesinlik istiyor mu?** Sayı, tarih, madde numarası, UN numarası, sınır değer gibi bilgiler her zaman kaynağından ayrıca kontrol edilmeli.
2. **Kaynağı gösterebiliyor muyum?** Yanıt bir mevzuata ya da belgeye dayanıyorsa, o metni açıp ilgili bölümü kendim görmeliyim. Modelin verdiği kaynak da var olmayabilir.
3. **Yanıtını bildiğim örneklerle denedim mi?** Yazılım testindeki basit bir fikir burada da işe yarıyor: bir aracı gerçek işe koymadan önce doğru cevabını bildiğiniz birkaç örnekle sınamak.
4. **Yanlış olursa ne olur?** Bir e-posta taslağındaki hata düzeltilir. Bir tehlikeli madde beyanındaki hata ise güvenlik ve yasal sorumluluk sonucu doğurabilir.

### Sorumluluk kimde?

Kısa cevap: çıktıyı kullanan kişide ve kuruluşta. Tehlikeli madde mevzuatı örneğinde yükümlülükler gönderen, taşımacı, alıcı, yükleyen ve paketleyen gibi taşımaya katılan taraflara ait; güvenlik danışmanının da kendi görevleri var. Yani sorumluluk insanlarda ve kuruluşlarda; bir yazılım aracında değil. "Yapay zekâ böyle söyledi" bir denetimde ya da bir kazadan sonra savunma olmaz.

Bu yüzden yapay zekâyı karar veren değil, kararı hazırlamaya yardım eden bir araç olarak konumlandırmak gerekiyor. Son kontrol ve imza insanda kalmalı.

## Geleneksel sektörlerde küçük başlamak

Lojistik, madencilik ya da danışmanlık gibi alanlarda çalışan birinin yapay zekâyı denemek için büyük bir dönüşüm projesine ihtiyacı yok. Daha sağlıklı yol, küçük ve ölçülebilir işlerle başlamak.

Başlamak için uygun işlerden bazıları:

- Tekrar eden yazışmalar için e-posta taslağı hazırlamak.
- Toplantı ya da saha ziyareti notlarını düzenli bir özete dönüştürmek.
- Bir eğitim sunumunun ilk iskeletini çıkarmak.
- İngilizce bir teknik metni anlamayı kolaylaştırmak için çeviri desteği almak. Çeviri anlamayı hızlandırır; ama esas alınacak olan mevzuat metninin kendisidir.
- Serbest yazılmış notlardan tarih, firma ya da iş kalemi gibi alanları çıkarmak.

Denerken birkaç basit kural işe yarıyor:

- **Önce ölçün.** İşin bugün ne kadar sürdüğünü ve ne sıklıkla hata çıktığını not edin. Sonra yapay zekâ ile yapılan hâlini aynı ölçütlerle karşılaştırın: süre, düzeltme ihtiyacı, hata.
- **Hassas veriyi göndermeyin.** Müşteri bilgisi, kişisel veri ya da ticari sır içeren metinleri bir bulut servisine göndermeden önce şirket politikasına ve KVKK yükümlülüklerine bakın.
- **Kritik kararlarla başlamayın.** Sınıflandırma, ambalaj seçimi ya da güvenlik kararı gibi hatanın ağır sonuç doğurabileceği işleri ilk deneme alanı yapmayın.
- **İnsan onayını sürecin içine yazın.** Çıktının kim tarafından, hangi kaynağa bakılarak kontrol edileceği baştan belli olsun.
- **Sonuç yoksa bırakın.** Birkaç haftalık denemede fark yaratmayan bir kullanım, sırf yapay zekâ olduğu için sürdürülmemeli.

## Sonuç

Dil modelleri metinle çalışan işlerde gerçekten zaman kazandırabiliyor. Ama bu, onların doğruyu bildiği anlamına gelmiyor; olası olanı yazıyorlar. Bu farkı akılda tutarak, küçük işlerle başlayıp sonucu ölçerek ve son sözü insana bırakarak kullanmak, hem abartıdan hem de gereksiz korkudan uzak durmanın sağlam bir yolu.
