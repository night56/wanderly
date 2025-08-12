import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import MapComponent from '../components/MapComponent'
import ChatMessage from '../components/ChatMessage'
import { TravelRecommendation, Message } from '../types'

const TravelGuide = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Merhaba! Ben AI seyahat rehberiniz. Nereye gitmek istediğinizi bilmiyorsanız, size yardımcı olabilirim. Bütçeniz, tercihleriniz ve ilgi alanlarınızı paylaşın, size mükemmel destinasyonu önereyim!',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null)
  const [recommendations, setRecommendations] = useState<TravelRecommendation | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'map'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aiResponse = generateAIResponse(inputMessage)
      
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

      toast.success('AI rehberinizden yanıt geldi!')
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): { content: string; recommendation?: TravelRecommendation } => {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">AI Seyahat Rehberi</h2>
                  <p className="text-sm text-gray-500">Size en iyi önerileri sunuyor</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab(activeTab === 'chat' ? 'map' : 'chat')}
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {activeTab === 'chat' ? <Map className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>AI rehberiniz düşünüyor...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nereye gitmek istiyorsunuz? Bütçeniz ve tercihlerinizi paylaşın..."
                className="flex-1 input-field resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className={`bg-white rounded-2xl shadow-lg ${activeTab === 'map' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Harita ve Öneriler</h2>
            {recommendations && (
              <p className="text-sm text-gray-600">
                {recommendations.city}, {recommendations.country}
              </p>
            )}
          </div>
          
          <div className="flex-1 h-[calc(100%-80px)]">
            <MapComponent 
              selectedLocation={selectedLocation}
              recommendations={recommendations}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {recommendations && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="card">
            <div className="flex items-center space-x-3 mb-3">
              <Camera className="h-6 w-6 text-primary-600" />
              <h3 className="font-semibold">Gezilecek Yerler</h3>
            </div>
            <div className="space-y-2">
              {recommendations.attractions.slice(0, 3).map((attraction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{attraction.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    ⭐ {attraction.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-3">
              <Utensils className="h-6 w-6 text-primary-600" />
              <h3 className="font-semibold">Yemek Önerileri</h3>
            </div>
            <div className="space-y-2">
              {recommendations.restaurants.slice(0, 3).map((restaurant, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{restaurant.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
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

          <div className="card">
            <div className="flex items-center space-x-3 mb-3">
              <Hotel className="h-6 w-6 text-primary-600" />
              <h3 className="font-semibold">Bütçe Bilgisi</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Günlük:</span>
                <span className="font-medium">{recommendations.budget.daily}</span>
              </div>
              <div className="flex justify-between">
                <span>Konaklama:</span>
                <span className="font-medium">{recommendations.budget.accommodation}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-3">
              <Languages className="h-6 w-6 text-primary-600" />
              <h3 className="font-semibold">Çeviri</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p>Yerel dilde temel ifadeler:</p>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <div>Merhaba: Hello</div>
                <div>Teşekkürler: Thank you</div>
                <div>Fiyat: Price</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TravelGuide