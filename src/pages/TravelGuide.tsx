import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Send, 
  MapPin, 
  Utensils, 
  Camera, 
  Languages, 
  Hotel,
  Plane,
  Car,
  MessageCircle,
  Map,
  X,
  Loader2,
  Sparkles,
  Globe,
  Mic,
  MicOff,
  Volume2,
  Settings,
  Download,
  Share2
} from 'lucide-react'
import toast from 'react-hot-toast'
import GoogleMapComponent from '../components/GoogleMapComponent'
import ChatMessage from '../components/ChatMessage'
import TranslationWidget from '../components/TranslationWidget'
import { TravelRecommendation, Message } from '../types'
import { geminiService } from '../services/api'

const TravelGuide = () => {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: t('guide.welcome'),
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null)
  const [recommendations, setRecommendations] = useState<TravelRecommendation | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'map'>('chat')
  const [isTranslationOpen, setIsTranslationOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Use Gemini API if available, otherwise fallback to local response
      let aiResponse
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          aiResponse = await geminiService.generateTravelRecommendation(inputMessage, i18n.language)
        } catch (error) {
          console.warn('Gemini API failed, using fallback:', error)
          aiResponse = generateFallbackResponse(inputMessage)
        }
      } else {
        aiResponse = generateFallbackResponse(inputMessage)
      }
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      if (aiResponse.recommendation) {
        setRecommendations(aiResponse.recommendation)
        setSelectedLocation(aiResponse.recommendation.coordinates)
        setActiveTab('map')
      }

      toast.success(t('guide.success'))
    } catch (error) {
      toast.error(t('guide.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userInput: string): { content: string; recommendation?: TravelRecommendation } => {
    const input = userInput.toLowerCase()
    
    // Simple AI logic - in a real app, this would connect to an AI service
    if (input.includes('istanbul') || input.includes('türkiye')) {
      return {
        content: 'İstanbul harika bir seçim! Size şu önerileri sunabilirim:\n\n🏛️ **Gezilecek Yerler:**\n• Ayasofya ve Sultanahmet Camii\n• Topkapı Sarayı\n• Kapalıçarşı\n• Boğaz turu\n\n🍽️ **Yemek Önerileri:**\n• Balık ekmek (Eminönü)\n• İskender kebap\n• Lahmacun\n• Türk kahvesi\n\n💰 **Bütçe:** Günlük 200-400 TL\n\nHaritada detayları görebilirsiniz!',
        recommendation: {
          city: 'İstanbul',
          country: 'Türkiye',
          coordinates: { lat: 41.0082, lng: 28.9784 },
          attractions: [
            { name: 'Ayasofya', type: 'tarihi', rating: 4.8 },
            { name: 'Topkapı Sarayı', type: 'tarihi', rating: 4.6 },
            { name: 'Kapalıçarşı', type: 'alışveriş', rating: 4.4 }
          ],
          restaurants: [
            { name: 'Balık Ekmek Eminönü', cuisine: 'deniz ürünleri', price: 'uygun' },
            { name: 'İskender Kebap', cuisine: 'Türk mutfağı', price: 'orta' },
            { name: 'Lahmacun Dünyası', cuisine: 'Türk mutfağı', price: 'uygun' }
          ],
          budget: { daily: '200-400 TL', accommodation: '300-800 TL' }
        }
      }
    } else if (input.includes('paris') || input.includes('fransa')) {
      return {
        content: 'Paris romantik bir seçim! İşte önerilerim:\n\n🗼 **Gezilecek Yerler:**\n• Eiffel Kulesi\n• Louvre Müzesi\n• Notre-Dame Katedrali\n• Champs-Élysées\n\n🍷 **Yemek Önerileri:**\n• Croissant ve kahve\n• Escargot\n• Coq au Vin\n• Crème brûlée\n\n💰 **Bütçe:** Günlük 150-300€\n\nHaritada detayları görebilirsiniz!',
        recommendation: {
          city: 'Paris',
          country: 'Fransa',
          coordinates: { lat: 48.8566, lng: 2.3522 },
          attractions: [
            { name: 'Eiffel Kulesi', type: 'turistik', rating: 4.7 },
            { name: 'Louvre Müzesi', type: 'müze', rating: 4.8 },
            { name: 'Notre-Dame', type: 'tarihi', rating: 4.6 }
          ],
          restaurants: [
            { name: 'Le Petit Bistrot', cuisine: 'Fransız', price: 'orta' },
            { name: 'Café de Flore', cuisine: 'Fransız', price: 'yüksek' },
            { name: 'Boulangerie', cuisine: 'Fransız', price: 'uygun' }
          ],
          budget: { daily: '150-300€', accommodation: '200-500€' }
        }
      }
    } else if (input.includes('bütçe') || input.includes('ucuz') || input.includes('ekonomik')) {
      return {
        content: 'Ekonomik seyahat için harika önerilerim var:\n\n🌍 **Uygun Fiyatlı Destinasyonlar:**\n• **Budapeşte, Macaristan** - Günlük 50-100€\n• **Prag, Çek Cumhuriyeti** - Günlük 60-120€\n• **Krakow, Polonya** - Günlük 40-80€\n• **Sofya, Bulgaristan** - Günlük 30-60€\n\n💡 **Tasarruf İpuçları:**\n• Hostel konaklama\n• Sokak yemekleri\n• Ücretsiz müzeler\n• Toplu taşıma\n\nHangi şehri detaylı öğrenmek istersiniz?'
      }
    } else {
      return {
        content: 'Harika! Size daha iyi öneriler verebilmem için biraz daha bilgi paylaşabilir misiniz?\n\n• Hangi ülke/kıta ilginizi çekiyor?\n• Bütçeniz nedir? (düşük/orta/yüksek)\n• Ne tür aktiviteler seversiniz? (tarih, doğa, yemek, kültür)\n• Kaç günlük bir seyahat planlıyorsunuz?\n\nBu bilgilerle size mükemmel destinasyonu önerebilirim!'
      }
    }
  }

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = i18n.language === 'tr' ? 'tr-TR' : 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setInputMessage(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast.error('Ses tanıma hatası')
      }
    }
  }, [i18n.language])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Ses tanıma desteklenmiyor')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = i18n.language === 'tr' ? 'tr-TR' : 'en-US'
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('guide.title')}</h1>
              <p className="text-primary-100">{t('guide.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsTranslationOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span>Çeviri</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-300px)]">
        {/* Enhanced Chat Section */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('guide.title')}</h2>
                  <p className="text-sm text-gray-500">{t('guide.subtitle')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab(activeTab === 'chat' ? 'map' : 'chat')}
                  className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {activeTab === 'chat' ? <Map className="h-5 w-5" /> : <X className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 text-gray-500 bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-ping"></div>
                </div>
                <span className="text-sm">{t('guide.loading')}</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="space-y-3">
              <div className="flex space-x-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('guide.input.placeholder')}
                  className="flex-1 input-field resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed p-3"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{inputMessage.length} karakter</span>
                  {isListening && (
                    <span className="text-red-500 animate-pulse">Dinleniyor...</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setInputMessage('')}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Temizle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Map Section */}
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${activeTab === 'map' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('map.title')}</h2>
                {recommendations && (
                  <p className="text-sm text-gray-600">
                    {recommendations.city}, {recommendations.country}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 h-[calc(100%-80px)]">
            <GoogleMapComponent 
              selectedLocation={selectedLocation}
              recommendations={recommendations}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      {recommendations && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('recommendations.attractions')}</h3>
            </div>
            <div className="space-y-3">
              {recommendations.attractions.slice(0, 3).map((attraction, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">{attraction.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    ⭐ {attraction.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Utensils className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('recommendations.restaurants')}</h3>
            </div>
            <div className="space-y-3">
              {recommendations.restaurants.slice(0, 3).map((restaurant, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">{restaurant.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    restaurant.price === 'uygun' ? 'bg-green-100 text-green-800' :
                    restaurant.price === 'orta' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Hotel className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('recommendations.budget')}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                <span className="text-gray-600">{t('recommendations.daily')}:</span>
                <span className="font-semibold text-gray-900">{recommendations.budget.daily}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                <span className="text-gray-600">{t('recommendations.accommodation')}:</span>
                <span className="font-semibold text-gray-900">{recommendations.budget.accommodation}</span>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Languages className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('recommendations.translation')}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600">{t('recommendations.basicPhrases')}:</p>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Merhaba:</span>
                  <span className="font-medium">Hello</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Teşekkürler:</span>
                  <span className="font-medium">Thank you</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Fiyat:</span>
                  <span className="font-medium">Price</span>
                </div>
              </div>
              <button
                onClick={() => setIsTranslationOpen(true)}
                className="w-full mt-3 btn-primary text-sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                Çeviri Asistanını Aç
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Translation Widget */}
      <TranslationWidget 
        isOpen={isTranslationOpen}
        onClose={() => setIsTranslationOpen(false)}
        initialText={recommendations ? `${recommendations.city}, ${recommendations.country}` : ''}
      />
    </div>
  )
}

export default TravelGuide