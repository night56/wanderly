import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  tr: {
    translation: {
      // Navigation
      'nav.home': 'Ana Sayfa',
      'nav.travelGuide': 'Seyahat Rehberi',
      'nav.about': 'Hakkında',
      'nav.contact': 'İletişim',
      
      // Home Page
      'home.hero.title': 'Nereye Gideceğinizi Bilmiyor musunuz?',
      'home.hero.subtitle': 'AI destekli seyahat rehberimiz ile mükemmel destinasyonu bulun. Harita, çeviri, yemek önerileri ve daha fazlası ile seyahatinizi planlayın.',
      'home.hero.cta': 'Seyahat Rehberini Başlat',
      
      // Features
      'features.title': 'Neler Sunuyoruz?',
      'features.subtitle': 'Seyahatinizin her anında yanınızdayız. Modern teknoloji ile geleneksel seyahat deneyimini birleştiriyoruz.',
      'features.ai.title': 'AI Destekli Öneriler',
      'features.ai.description': 'Yapay zeka ile kişiselleştirilmiş seyahat önerileri alın',
      'features.map.title': 'Harita Entegrasyonu',
      'features.map.description': 'Gerçek zamanlı harita ile rotalarınızı planlayın',
      'features.translate.title': 'Çeviri Desteği',
      'features.translate.description': 'Yerel dilde iletişim kurun ve menüleri anlayın',
      'features.food.title': 'Yemek Önerileri',
      'features.food.description': 'Uygun fiyatlı ve lezzetli yerel yemekleri keşfedin',
      'features.places.title': 'Gezilecek Yerler',
      'features.places.description': 'Turistik ve gizli kalmış yerleri keşfedin',
      'features.culture.title': 'Kültürel Rehber',
      'features.culture.description': 'Yerel kültür ve gelenekler hakkında bilgi edinin',
      
      // Services
      'services.title': 'Ek Hizmetler',
      'services.subtitle': 'Seyahatinizi daha da kolaylaştıracak ek hizmetlerimiz',
      'services.flights.title': 'Uçuş Arama',
      'services.flights.description': 'En uygun uçuşları bulun',
      'services.hotels.title': 'Otel Rezervasyonu',
      'services.hotels.description': 'Konforlu konaklama seçenekleri',
      'services.cars.title': 'Araç Kiralama',
      'services.cars.description': 'Özgürce seyahat edin',
      
      // Travel Guide
      'guide.title': 'AI Seyahat Rehberi',
      'guide.subtitle': 'Size en iyi önerileri sunuyor',
      'guide.welcome': 'Merhaba! Ben AI seyahat rehberiniz. Nereye gitmek istediğiniz bilmiyorsanız, size yardımcı olabilirim. Bütçeniz, tercihleriniz ve ilgi alanlarınızı paylaşın, size mükemmel destinasyonu önereyim!',
      'guide.input.placeholder': 'Nereye gitmek istiyorsunuz? Bütçeniz ve tercihlerinizi paylaşın...',
      'guide.loading': 'AI rehberiniz düşünüyor...',
      'guide.success': 'AI rehberinizden yanıt geldi!',
      'guide.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
      
      // Map
      'map.title': 'Harita ve Öneriler',
      'map.loading': 'Harita Yükleniyor...',
      'map.noLocation': 'Konum seçilmedi',
      
      // Recommendations
      'recommendations.attractions': 'Gezilecek Yerler',
      'recommendations.restaurants': 'Yemek Önerileri',
      'recommendations.budget': 'Bütçe Bilgisi',
      'recommendations.translation': 'Çeviri',
      'recommendations.daily': 'Günlük',
      'recommendations.accommodation': 'Konaklama',
      'recommendations.basicPhrases': 'Yerel dilde temel ifadeler',
      
      // Price levels
      'price.affordable': 'uygun',
      'price.moderate': 'orta',
      'price.expensive': 'yüksek',
      
      // Common
      'common.hello': 'Merhaba',
      'common.thankYou': 'Teşekkürler',
      'common.price': 'Fiyat',
      'common.start': 'Başla',
      'common.learnMore': 'Daha Fazla Bilgi',
      'common.close': 'Kapat',
      'common.loading': 'Yükleniyor...',
      'common.error': 'Hata',
      'common.success': 'Başarılı',
      
      // Language
      'language.tr': 'Türkçe',
      'language.en': 'English',
      'language.switch': 'Dili Değiştir'
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.travelGuide': 'Travel Guide',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      
      // Home Page
      'home.hero.title': 'Don\'t Know Where to Go?',
      'home.hero.subtitle': 'Find the perfect destination with our AI-powered travel guide. Plan your trip with maps, translation, food recommendations and more.',
      'home.hero.cta': 'Start Travel Guide',
      
      // Features
      'features.title': 'What We Offer',
      'features.subtitle': 'We\'re with you at every moment of your journey. We combine modern technology with traditional travel experience.',
      'features.ai.title': 'AI-Powered Recommendations',
      'features.ai.description': 'Get personalized travel recommendations with artificial intelligence',
      'features.map.title': 'Map Integration',
      'features.map.description': 'Plan your routes with real-time maps',
      'features.translate.title': 'Translation Support',
      'features.translate.description': 'Communicate in local language and understand menus',
      'features.food.title': 'Food Recommendations',
      'features.food.description': 'Discover affordable and delicious local foods',
      'features.places.title': 'Places to Visit',
      'features.places.description': 'Discover tourist and hidden places',
      'features.culture.title': 'Cultural Guide',
      'features.culture.description': 'Learn about local culture and traditions',
      
      // Services
      'services.title': 'Additional Services',
      'services.subtitle': 'Additional services that will make your travel even easier',
      'services.flights.title': 'Flight Search',
      'services.flights.description': 'Find the best flights',
      'services.hotels.title': 'Hotel Booking',
      'services.hotels.description': 'Comfortable accommodation options',
      'services.cars.title': 'Car Rental',
      'services.cars.description': 'Travel freely',
      
      // Travel Guide
      'guide.title': 'AI Travel Guide',
      'guide.subtitle': 'Providing you with the best recommendations',
      'guide.welcome': 'Hello! I\'m your AI travel guide. If you don\'t know where to go, I can help you. Share your budget, preferences and interests, and I\'ll suggest the perfect destination for you!',
      'guide.input.placeholder': 'Where do you want to go? Share your budget and preferences...',
      'guide.loading': 'Your AI guide is thinking...',
      'guide.success': 'Response received from your AI guide!',
      'guide.error': 'An error occurred. Please try again.',
      
      // Map
      'map.title': 'Map and Recommendations',
      'map.loading': 'Loading Map...',
      'map.noLocation': 'No location selected',
      
      // Recommendations
      'recommendations.attractions': 'Places to Visit',
      'recommendations.restaurants': 'Food Recommendations',
      'recommendations.budget': 'Budget Information',
      'recommendations.translation': 'Translation',
      'recommendations.daily': 'Daily',
      'recommendations.accommodation': 'Accommodation',
      'recommendations.basicPhrases': 'Basic phrases in local language',
      
      // Price levels
      'price.affordable': 'affordable',
      'price.moderate': 'moderate',
      'price.expensive': 'expensive',
      
      // Common
      'common.hello': 'Hello',
      'common.thankYou': 'Thank you',
      'common.price': 'Price',
      'common.start': 'Start',
      'common.learnMore': 'Learn More',
      'common.close': 'Close',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      
      // Language
      'language.tr': 'Türkçe',
      'language.en': 'English',
      'language.switch': 'Switch Language'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n