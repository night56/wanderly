import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  MapPin, 
  Globe, 
  Utensils, 
  Camera, 
  Languages, 
  Sparkles,
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Star,
  Users,
  Zap,
  Shield
} from 'lucide-react'

const HomePage = () => {
  const { t } = useTranslation()
  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI Destekli Öneriler",
      description: "Yapay zeka ile kişiselleştirilmiş seyahat önerileri alın"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Harita Entegrasyonu",
      description: "Gerçek zamanlı harita ile rotalarınızı planlayın"
    },
    {
      icon: <Languages className="h-8 w-8" />,
      title: "Çeviri Desteği",
      description: "Yerel dilde iletişim kurun ve menüleri anlayın"
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Yemek Önerileri",
      description: "Uygun fiyatlı ve lezzetli yerel yemekleri keşfedin"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Gezilecek Yerler",
      description: "Turistik ve gizli kalmış yerleri keşfedin"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Kültürel Rehber",
      description: "Yerel kültür ve gelenekler hakkında bilgi edinin"
    }
  ]

  const services = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: "Uçuş Arama",
      description: "En uygun uçuşları bulun"
    },
    {
      icon: <Hotel className="h-6 w-6" />,
      title: "Otel Rezervasyonu",
      description: "Konforlu konaklama seçenekleri"
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Araç Kiralama",
      description: "Özgürce seyahat edin"
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t('home.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t('home.hero.subtitle')}
        </p>
        <Link 
          to="/guide" 
          className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
        >
          <span>{t('home.hero.cta')}</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Neler Sunuyoruz?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Seyahatinizin her anında yanınızdayız. Modern teknoloji ile 
            geleneksel seyahat deneyimini birleştiriyoruz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-primary-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ek Hizmetler
          </h2>
          <p className="text-gray-600">
            Seyahatinizi daha da kolaylaştıracak ek hizmetlerimiz
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="text-primary-600 mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-4">
          Seyahat Maceranızı Başlatın
        </h2>
        <p className="text-xl mb-8 opacity-90">
          AI destekli rehberimiz ile unutulmaz bir deneyim yaşayın
        </p>
        <Link 
          to="/guide" 
          className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <span>Hemen Başla</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.section>
    </div>
  )
}

export default HomePage