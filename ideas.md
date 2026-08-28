# Donanım & TinyML Mühendisi — Tasarım Yaklaşımları

## Yaklaşım 1

**Tema Adı:** Koyu Oda Osiloskobu

**Kısa Tanıtım:** Karanlık laboratuvar ortamını ve gerçek zamanlı telemetri hissini bir osiloskop arayüzüyle birleştirir. Yeşil fosfor vurgularıyla karmaşık mühendislik verisini sakin ve odaklı tutar.

**Olasılık:** 0.04

## Yaklaşım 2

**Tema Adı:** Frosted Signal Lab

**Kısa Tanıtım:** Gece mavisi zemin üzerinde buzlu cam katmanlar ve elektrik mavisi sinyal izleri kullanır. Araç niteliğindeki yoğun içeriği, modern mühendislik stüdyosu gibi hissettiren berrak bir hiyerarşiyle sunar.

**Olasılık:** 0.07

## Yaklaşım 3

**Tema Adı:** Mavi Baskı Atölyesi

**Kısa Tanıtım:** Teknik çizim estetiğini açık kobalt yüzeyler, ölçü çizgileri ve kağıtsı dokularla yorumlar. Daha editoryal, sakin ve tasarım odaklı bir alternatif sunar.

**Olasılık:** 0.02

---

# Seçilen Yaklaşım: Frosted Signal Lab

## Tasarım Hareketi

**Tekno-minimalizm** ile **yüksek kontrastlı endüstriyel arayüz** estetiğinin bir birleşimi. Estetik, gösterişli bir bilim kurgu kontrol odası yerine donanım mühendisleri için oluşturulmuş rafine ve güvenilir bir masaüstü aracı hissi yaratır.

## Temel İlkeler

1. **Sinyal önceliklidir:** Renk, parlaklık ve hareket yalnızca durum, önem ve veri akışını belirtmek için kullanılır.
2. **Katmanlı berraklık:** Buzlu paneller, arka plandaki teknik ızgarayı görünür bırakırken metin okunurluğunu kesin biçimde korur.
3. **Asimetrik çalışma yüzeyi:** Sol yanda bağlam ve oturum bilgisi; sağda yoğun sonuç yüzeyi; altta bağımsız komut yuvası bulunur.
4. **Mühendislik güveni:** Ölçümler, durum etiketleri, uyarılar ve kod blokları sistematik aralıklarla, yüksek bilgi yoğunluğuyla sunulur.

## Renk Felsefesi

Ana zemin, elektronik ekipmanlarda görülen lacivert-siyah bir **gece PCB yüzeyi**dir; göz yorgunluğunu azaltır ve uzun teknik okumaları destekler. Ayırt edici turkuaz-mavi, canlı sinyali ve başarılı bağlantıyı anlatır. Sarı, elektriksel ihtiyatı; mercan kırmızısı ise kritik güvenlik ihlallerini temsil eder. Cam katmanları opak beyaz yerine soğuk mavimsi gri taşır; bu sayede arayüz karanlıkta temiz, fakat ağır olmayan bir derinlik kazanır.

## Yerleşim Paradigması

Yerleşim, **sabit sol telemetri sütunu + akışkan mühendislik tuvali + alt komut yuvası** olarak kurulacaktır. Başlık üstte dar bir veri barı gibi çalışır. Ana rapor alanı modüler panellere ayrılır; ilk ekranda mimari özetiyle birlikte veri izleri görünür, sekmeler aşağıda yatay olarak ilerler. Mobilde telemetri sütunu bir durum şeridine dönüşür ve komut yuvası ekranın altına taşınır.

## İmza Öğeleri

1. **Sinyal izi:** Başlık, kart sınırları ve yükleme durumlarında ince turkuaz dalga/sinyal çizgileri görülür.
2. **Bağlantı düğümleri:** Sistem durumları, küçük konsantrik halka ve merkez ışık noktasıyla gösterilir.
3. **Kesik köşeli cam paneller:** Tam yuvarlak kartlar yerine, bir köşesinde hafif diyagonal kesik bulunan katmanlı modüller kullanılır.

## Etkileşim Felsefesi

Etkileşimler ölçülü ve araç odaklıdır. Sekmeler, belirgin alt sinyal çubuğuyla aktifleşir; kartlar hover durumunda 1–2 px yükselir; kopyalama ve indirme gibi eylemler anında net bir geri bildirim verir. Klavye odak halkaları vurgulu turkuaz olmalı, araç hızlı kullanım için erişilebilir kalmalıdır.

## Animasyon

Sayfa açılışında yalnızca temel modüller 40–70 ms gecikmeli ve opaklıktan girer. Veri işlenirken komut kutusunda bir tarama çizgisi, API durumunda ise yumuşak bir sinyal nefesi görünür. Buton basımları 140–160 ms içinde `scale(0.97)` geri bildirimi verir. Animasyonlar yalnızca `transform` ve `opacity` kullanır, 300 ms’yi geçmez ve `prefers-reduced-motion` ayarına saygı gösterir.

## Tipografi Sistemi

Başlıklar ve ana arabirim metni için **Inter** kullanılacaktır; başlıklar 650–800 ağırlıkta, gövde metni 400–500 ağırlıkta tutulacaktır. Sayısal metrikler, pin adları, kod ve durum ayrıntıları için **JetBrains Mono** kullanılacaktır. Ana başlık büyük ancak merkezlenmemiş; modül başlıkları küçük üst satır etiketi + güçlü ikinci satır yapısında ilerler.

## Marka Özü

**Donanım & TinyML Mühendisi, gömülü sistem ekipleri için doğal dilden doğrulanabilir donanım kararlarına geçiş sağlayan çalışma istasyonudur.**

Kişilik: **analitik, kararlı, ileri görüşlü.**

## Marka Sesi

Başlıklar ve eylem metinleri özlü, teknik ve eyleme dönük olmalıdır. Söylem gereksiz vaatler yerine sonuç ve kısıtları görünür kılar.

Örnek satırlar:

> “Kart seçimini güç bütçesiyle birlikte doğrulayın.”

> “Sorunuzu gönderin; mimari, pin ve üretim riskleri tek akışta çözümlensin.”

## Wordmark & Logo

Logo, birbirine geçen iki PCB izinden doğan, dikey eksende bölünmüş geometrik bir **H** sembolüdür. Sol iz donanımı, sağ iz sinyal/AI akışını temsil eder. Sembol metinden bağımsız, turkuaz-mavi parlaklıkla görünür; wordmark ise sıkı harf aralıklı Inter ile kullanılır.

## İmza Marka Rengi

**Signal Cyan — `#28D7FE`**. Bu renk, yalnızca ana eylem, canlı veri ve aktif durumlar için korunacaktır.

## Style Decisions

- Her ana ekran, **sol telemetri/oturum rayı + merkezi modüler mühendislik tuvali + ayrı alt komut yuvası** ile bir çalışma istasyonu gibi okunacaktır.
- **Signal Cyan `#28D7FE`** yalnızca canlı, aktif, doğrulanmış durumlar; ana eylemler ve kritik sinyal izleri içindir. İkincil dekorasyon soğuk mavi-gri ile, ihtiyat yalnızca sarı ile, kritik risk yalnızca mercanla anlatılır.
- Tüm ana modüller görünür PCB/ızgara tabakası üzerinde buzlu mavi-gri cam kullanacak; her modülde en az bir kesik veya yönlendirilmiş köşe detayı bulunacaktır.

## Güncel Tema Kararı: Light Blueprint

Sohbet yüzeyi artık koyu laboratuvar görünümü yerine **kırık beyaz teknik çizim masası** hissiyle ilerleyecektir. Ana arka plan; kâğıtsı beyaz, çok düşük kontrastlı mavi ızgara ve ince ölçüm kılavuzlarından oluşur. Lacivert metin bilgi hiyerarşisini kurar; koyu petrol mavisi ana eylemi temsil eder. Sarı ve mercan yalnızca uyarı/risk işaretleri için korunurken, kod bloğu bilinçli bir kontrast olarak koyu terminal yüzeyinde kalır.

## Güncel Tema Kararı: Pastel Signal

Arayüzün duygusu daha sıcak ve yaratıcı bir çalışma masasına taşınır. **Pudra pembe**, sohbet tuvalindeki sakin ana zemindir; **buz mavisi**, sistem/ajan bağlamını ve teknik rapor alanlarını tanımlar; **şeftali turuncusu** ise kullanıcı mesajı ve dikkat gerektiren hafif vurgular için kullanılır. Ana gönderme eylemi, pastel yüzeylerde erişilebilirlik sağlayacak doygunlukta sakin mavi-petrol tonunu korur. Kod editörü ise uzun kod okumalarında kontrastı korumak için koyu terminal yüzeyinde kalır.

### Pastel Signal Stil Kararları

- Ana ajan işareti, iki devre izinden oluşan bölünmüş geometrik **H** sembolüdür; genel uygulama simgesi veya baş harf yerine bu işaret kullanılacaktır.
- Sohbet tuvali, teknik çalışma yüzeyi olarak okunmalıdır: oturum telemetrisi, pin/risk/bellek mikro metrikleri ve ince sinyal izleri dekor değil bilgi bağlamıdır.
- Pudra pembe sohbet zemini, buz mavisi ajan/rapor bağlamı ve şeftali kullanıcı mesajı yüzeylerini taşır. Yapısal metin ve ana eylemler koyu petrol mavisinde kalır.

## Son Düzeltme: Tek Renkli Nötr Zemin

Pudra pembe ve tüm arka plan geçişleri kaldırılmıştır. Sohbet tuvalinin tamamında **tek renkli açık gri-mavi `#F2F5F7`** kullanılacaktır. Buz mavisi yalnızca ajan/rapor bağlamında; şeftali ise sadece kullanıcı mesajı ve hafif dikkat vurgularında korunur. Arka plan, görsel olarak yarışmayacak; konuşma ve teknik rapor içeriği birinci öncelik olacaktır.
