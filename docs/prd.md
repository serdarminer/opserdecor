# Gereksinim Belgesi

## 1. Uygulama Genel Bakış

### 1.1 Uygulama Adı
OPSERDECOR Kurumsal Web Sitesi

### 1.2 Açıklama
OPSERDECOR markası için mobilya, kapı, süpürgelik, parke, mobilya profili ve MDF panel kaplamalarında kullanılan finish folyo, dekor kağıdı ve PP folyo ürünlerini tanıtan; Türkçe ve İngilizce dil desteğine sahip, tam kapsamlı admin panelli kurumsal web sitesi.

---

## 2. Kullanıcı ve Kullanım Senaryoları

### 2.1 Hedef Kullanıcılar
- Ziyaretçiler: Ürün ve dekor bilgisi arayan potansiyel müşteriler, iş ortakları
- Admin: Site içeriklerini yöneten yetkili kullanıcı

### 2.2 Temel Kullanım Senaryoları
- Ziyaretçi, ürün kategorilerini ve dekor tasarımlarını inceler
- Ziyaretçi, haberler bölümünden güncel içerikleri takip eder
- Ziyaretçi, iletişim formu aracılığıyla şirketle iletişime geçer
- Admin, ürün, dekor, haber ve iletişim içeriklerini yönetir

---

## 3. Sayfa Yapısı ve Temel İşlevler

### 3.1 Sayfa Yapısı Genel Görünümü

```
OPSERDECOR Web Sitesi
├── Ana Sayfa
├── Hakkımızda
├── Ürünler
│   └── Ürün Detay
├── Dekorlar
│   └── Dekor Detay
├── Haberler
│   └── Haber Detay
└── İletişim
```

### 3.2 Ortak Bileşenler

**Header (Üst Menü)**
- Logo: OPSERDECOR marka logosu (sol)
- Navigasyon menüsü: Ana Sayfa, Hakkımızda, Ürünler, Dekorlar, Haberler, İletişim
- Dil seçici: TR / EN (sağ üst köşe)

**Footer (Alt Bilgi)**
- Şirket adı ve kısa açıklama
- Hızlı bağlantılar (menü linkleri)
- İletişim bilgileri:
  - Adres: İkitelli OSB Mah. Hürriyet Bulvarı SS Deparko San. Sit No: 1/38 K3 Başakşehir/İstanbul
  - Telefon: (212) 858 02 58 – 858 09 15
  - E-posta: info@opserltd.com
- Telif hakkı notu

---

### 3.3 Ana Sayfa

**Hero Bölümü**
- Tam ekran görsel/slider ile marka tanıtımı
- Başlık ve kısa açıklama metni
- Ürünlere veya İletişime yönlendiren CTA butonu

**Ürün Kategorileri Özeti**
- Finish Folyo, Dekor Kağıdı, PP Folyo kategorilerinin kart görünümü
- Her kart: kategori görseli, adı ve kısa açıklama
- Ürünler sayfasına yönlendirme linki

**Öne Çıkan Dekorlar**
- Seçili dekor tasarımlarının grid görünümü (renk/desen önizlemesi)
- Dekorlar sayfasına yönlendirme linki

**Son Haberler**
- En son 3 haberin kart görünümü (başlık, tarih, kısa özet, görsel)
- Haberler sayfasına yönlendirme linki

**Hakkımızda Özeti**
- Kısa şirket tanıtım metni
- Hakkımızda sayfasına yönlendirme linki

**İletişim Bilgileri Bandı**
- Adres, telefon ve e-posta bilgilerinin görsel bant içinde gösterimi

---

### 3.4 Hakkımızda Sayfası

- Şirket tarihçesi ve misyon/vizyon metni
- Üretim alanları ve uzmanlık konuları (finish folyo, dekor kağıdı, PP folyo)
- Kullanım alanları: mobilya, kapı, süpürgelik, parke, mobilya profili, MDF panel kaplaması
- Görsel destekli içerik alanı (fabrika, üretim görselleri vb.)

---

### 3.5 Ürünler Sayfası

**Ürün Listesi**
- Ürün kategorileri: Finish Folyo, Dekor Kağıdı, PP Folyo
- Her kategori için kart görünümü: görsel, kategori adı, kısa açıklama
- Kategoriye tıklandığında ilgili ürün detay sayfasına yönlendirme

**Ürün Detay Sayfası**
- Ürün adı ve açıklaması
- Kullanım alanları (mobilya, kapı, parke vb.)
- Teknik özellikler (varsa)
- Ürün görselleri
- İletişime yönlendiren CTA butonu

---

### 3.6 Dekorlar Sayfası

Referans: https://www.schattdecor.com/tr/dekorlar benzeri bir yapı

**Dekor Listeleme**
- Grid/kart görünümü: her dekor için renk/desen önizleme görseli, dekor adı/kodu
- Filtreleme seçenekleri: ürün tipi (Finish Folyo / Dekor Kağıdı / PP Folyo), renk grubu, desen kategorisi
- Arama çubuğu: dekor adı veya kodu ile arama

**Dekor Detay Sayfası**
- Dekor adı ve kodu
- Büyük önizleme görseli
- Renk ve desen bilgileri
- Uyumlu ürün tipi bilgisi
- İletişime yönlendiren CTA butonu

---

### 3.7 Haberler Sayfası

**Haber Listesi**
- Tüm haberlerin kart görünümü: başlık, tarih, kısa özet, kapak görseli
- Sayfalama (pagination)

**Haber Detay Sayfası**
- Haber başlığı, yayın tarihi
- Kapak görseli
- Tam haber içeriği (zengin metin)
- Önceki / Sonraki haber navigasyonu

---

### 3.8 İletişim Sayfası

**İletişim Bilgileri**
- Adres: İkitelli OSB Mah. Hürriyet Bulvarı SS Deparko San. Sit No: 1/38 K3 Başakşehir/İstanbul
- Telefon: (212) 858 02 58 – 858 09 15
- E-posta: info@opserltd.com

**İletişim Formu**
- Alanlar: Ad Soyad, E-posta, Telefon (opsiyonel), Konu, Mesaj
- Gönder butonu
- Başarılı gönderim sonrası onay mesajı

**Harita**
- Google Maps entegrasyonu ile konum gösterimi

---

### 3.9 Admin Paneli

**Giriş**
- Admin kullanıcı adı ve şifre ile giriş
- Kullanıcı kaydı yok; yalnızca admin girişi

**Dashboard (Kontrol Paneli)**
- Özet istatistikler: toplam ürün sayısı, dekor sayısı, haber sayısı, iletişim formu mesaj sayısı

**Ürün Yönetimi**
- Ürün kategorisi ekleme, düzenleme, silme
- Her kategori için: ad (TR/EN), açıklama (TR/EN), görsel yükleme, kullanım alanları, teknik özellikler

**Dekor Yönetimi**
- Dekor ekleme, düzenleme, silme
- Her dekor için: ad/kod, önizleme görseli yükleme, renk grubu, desen kategorisi, uyumlu ürün tipi seçimi (TR/EN açıklama)
- Toplu görsel yükleme desteği

**Haber Yönetimi**
- Haber ekleme, düzenleme, silme
- Her haber için: başlık (TR/EN), içerik (TR/EN, zengin metin editörü), kapak görseli, yayın tarihi
- Yayınla / Taslak durumu

**İletişim Formu Mesajları**
- Gelen mesajların listelenmesi
- Mesaj detayı görüntüleme
- Okundu / Okunmadı durumu
- Mesaj silme

**Site İçerik Yönetimi**
- Ana Sayfa hero bölümü: başlık (TR/EN), açıklama (TR/EN), görsel güncelleme
- Hakkımızda sayfası içeriği: metin (TR/EN), görseller
- Footer iletişim bilgileri güncelleme

---

## 4. İş Kuralları ve Mantığı

### 4.1 Dil Yönetimi
- Tüm içerikler (ürün, dekor, haber, sayfa metinleri) Türkçe ve İngilizce olarak girilir
- Ziyaretçi dil seçiciden TR veya EN seçtiğinde tüm site içeriği seçilen dile geçer
- Dil tercihi oturum boyunca korunur
- Admin panelinde içerik girişleri her iki dil için ayrı ayrı yapılır

### 4.2 Dekor Filtreleme
- Filtreler birlikte uygulanabilir (çoklu filtre)
- Filtre seçimi sonucunda eşleşen dekor bulunamazsa kullanıcıya bilgi mesajı gösterilir

### 4.3 İletişim Formu
- Ad Soyad, E-posta, Konu ve Mesaj alanları zorunludur
- Geçerli e-posta formatı doğrulaması yapılır
- Form gönderimi backend veritabanına kaydedilir ve admin panelinde görüntülenebilir

### 4.4 Haber Yayın Durumu
- Taslak durumdaki haberler yalnızca admin panelinde görünür, ziyaretçilere gösterilmez
- Yayınlanan haberler tarih sırasına göre (en yeni önce) listelenir

---

## 5. Anormallikler ve Sınır Durumlar

| Durum | Beklenen Davranış |
|---|---|
| İletişim formu zorunlu alan boş bırakılırsa | İlgili alan kırmızı kenarlıkla işaretlenir, hata mesajı gösterilir |
| Geçersiz e-posta formatı girilirse | Format hatası mesajı gösterilir, form gönderilmez |
| Dekor filtresinde eşleşme bulunamazsa | Sonuç bulunamadı mesajı gösterilir |
| Admin yanlış şifre girerse | Hata mesajı gösterilir, giriş engellenir |
| Görsel yüklenemezse (admin paneli) | Hata mesajı gösterilir, işlem iptal edilir |
| İki dilli içerik eksik girilirse | Admin paneli uyarı gösterir, eksik dil alanı işaretlenir |

---

## 6. Kabul Kriterleri

- Tüm menü sayfaları (Ana Sayfa, Hakkımızda, Ürünler, Dekorlar, Haberler, İletişim) erişilebilir ve içerik görüntülenebilir olmalıdır
- Dil seçici TR/EN geçişi tüm sayfalarda sorunsuz çalışmalıdır
- Dekorlar sayfasında filtreleme ve arama işlevleri doğru sonuç döndürmelidir
- İletişim formu başarıyla gönderilmeli ve mesaj admin panelinde görünmelidir
- Admin paneline yalnızca yetkili kullanıcı giriş yapabilmelidir
- Admin panelinden eklenen/düzenlenen/silinen içerikler anlık olarak sitede yansımalıdır
- Haberler yayın durumuna göre doğru şekilde görüntülenmeli/gizlenmelidir
- Footer'da iletişim bilgileri doğru şekilde görüntülenmelidir
- Tüm içerikler backend veritabanında kalıcı olarak saklanmalıdır

---

## 7. Bu Sürümde Uygulanmayacak Özellikler

- Kullanıcı kaydı ve kullanıcı girişi
- E-ticaret / ödeme altyapısı
- Sipariş takip sistemi
- Çoklu admin kullanıcı yönetimi ve rol bazlı yetkilendirme
- Sosyal medya entegrasyonu
- Canlı sohbet / chatbot
- Ürün karşılaştırma özelliği
- Dekor favorilere ekleme / kaydetme
- Bülten aboneliği (newsletter)
- SEO yönetim paneli