# AI Seyahat Rehberi

Modern ve akıllı seyahat rehberi uygulaması. Yapay zeka destekli öneriler, harita entegrasyonu, çeviri desteği ve daha fazlası ile seyahatinizi planlayın.

## 🌟 Özellikler

- **🤖 AI Destekli Öneriler**: Yapay zeka ile kişiselleştirilmiş seyahat önerileri
- **🗺️ Harita Entegrasyonu**: Gerçek zamanlı harita ile rota planlama
- **🌍 Çeviri Desteği**: Yerel dilde iletişim kurma yardımı
- **🍽️ Yemek Önerileri**: Uygun fiyatlı ve lezzetli yerel yemekler
- **📸 Gezilecek Yerler**: Turistik ve gizli kalmış yerler
- **💰 Bütçe Planlama**: Seyahat maliyetlerini hesaplama
- **📱 Responsive Tasarım**: Tüm cihazlarda mükemmel deneyim

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

3. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

## 🛠️ Teknolojiler

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Mapbox GL JS
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx      # Navigasyon başlığı
│   ├── ChatMessage.tsx # Sohbet mesajları
│   └── MapComponent.tsx # Harita bileşeni
├── pages/              # Sayfa bileşenleri
│   ├── HomePage.tsx    # Ana sayfa
│   └── TravelGuide.tsx # Seyahat rehberi
├── types/              # TypeScript tip tanımları
│   └── index.ts
├── App.tsx             # Ana uygulama bileşeni
├── main.tsx           # Uygulama giriş noktası
└── index.css          # Global stiller
```

## 🎯 Kullanım

1. **Ana Sayfa**: Uygulamanın özelliklerini keşfedin
2. **Seyahat Rehberi**: AI ile sohbet ederek destinasyon önerileri alın
3. **Harita Görünümü**: Önerilen yerleri haritada görüntüleyin
4. **Detaylı Bilgiler**: Yemek, konaklama ve bütçe bilgilerini inceleyin

## 🔧 Yapılandırma

### Mapbox API Anahtarı

Harita özelliğini kullanmak için Mapbox API anahtarı gerekir:

1. [Mapbox](https://www.mapbox.com/) hesabı oluşturun
2. API anahtarınızı alın
3. `src/components/MapComponent.tsx` dosyasında `accessToken` değerini güncelleyin

## 🎨 Özelleştirme

- **Renkler**: `tailwind.config.js` dosyasında primary renkleri değiştirin
- **Tema**: `src/index.css` dosyasında global stilleri düzenleyin
- **AI Yanıtları**: `src/pages/TravelGuide.tsx` dosyasında `generateAIResponse` fonksiyonunu güncelleyin

## 📱 Responsive Tasarım

Uygulama tüm cihazlarda optimize edilmiştir:
- **Desktop**: Tam özellikli deneyim
- **Tablet**: Uyarlanmış layout
- **Mobile**: Dokunmatik dostu arayüz

## 🔮 Gelecek Özellikler

- [ ] Gerçek AI API entegrasyonu
- [ ] Çoklu dil desteği
- [ ] Sosyal medya entegrasyonu
- [ ] Offline mod desteği
- [ ] Push bildirimleri
- [ ] Seyahat günlüğü

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**AI Seyahat Rehberi** ile unutulmaz seyahat deneyimleri yaşayın! 🌍✈️