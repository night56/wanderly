import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'

// Gemini AI Service
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

export const geminiService = {
  async generateTravelRecommendation(prompt: string, language: string = 'tr') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const enhancedPrompt = `
        Sen bir seyahat rehberisin. Aşağıdaki kullanıcı isteğine göre detaylı seyahat önerileri ver:
        
        Kullanıcı İsteği: ${prompt}
        
        Yanıtını şu formatta ver (JSON formatında):
        {
          "content": "Kullanıcıya verilecek detaylı açıklama",
          "recommendation": {
            "city": "Şehir adı",
            "country": "Ülke adı",
            "coordinates": {"lat": 0.0, "lng": 0.0},
            "attractions": [
              {"name": "Yer adı", "type": "tür", "rating": 4.5}
            ],
            "restaurants": [
              {"name": "Restoran adı", "cuisine": "mutfak türü", "price": "uygun/orta/yüksek"}
            ],
            "budget": {"daily": "günlük bütçe", "accommodation": "konaklama bütçesi"}
          }
        }
        
        Yanıtı ${language} dilinde ver.
      `
      
      const result = await model.generateContent(enhancedPrompt)
      const response = await result.response
      const text = response.text()
      
      // Try to parse JSON from response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.warn('Failed to parse JSON from Gemini response:', e)
      }
      
      // Fallback to simple response
      return {
        content: text,
        recommendation: null
      }
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new Error('AI servisi şu anda kullanılamıyor')
    }
  }
}

// Google Translate Service
export const translateService = {
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto') {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          target: targetLanguage,
          source: sourceLanguage
        }
      )
      
      return response.data.data.translations[0].translatedText
    } catch (error) {
      console.error('Translation API Error:', error)
      // Fallback to simple translation mapping
      return this.fallbackTranslate(text, targetLanguage)
    }
  },
  
  fallbackTranslate(text: string, targetLanguage: string): string {
    const translations: Record<string, Record<string, string>> = {
      'hello': {
        'tr': 'Merhaba',
        'en': 'Hello'
      },
      'thank you': {
        'tr': 'Teşekkürler',
        'en': 'Thank you'
      },
      'price': {
        'tr': 'Fiyat',
        'en': 'Price'
      },
      'where is': {
        'tr': 'Nerede',
        'en': 'Where is'
      },
      'how much': {
        'tr': 'Ne kadar',
        'en': 'How much'
      }
    }
    
    const lowerText = text.toLowerCase()
    for (const [key, values] of Object.entries(translations)) {
      if (lowerText.includes(key) && values[targetLanguage]) {
        return values[targetLanguage]
      }
    }
    
    return text // Return original if no translation found
  }
}

// Google Maps Service
export const mapsService = {
  async getPlaceDetails(placeId: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      )
      
      return response.data.result
    } catch (error) {
      console.error('Maps API Error:', error)
      throw new Error('Harita servisi şu anda kullanılamıyor')
    }
  },
  
  async searchNearbyPlaces(lat: number, lng: number, type: string, radius: number = 5000) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      )
      
      return response.data.results
    } catch (error) {
      console.error('Maps API Error:', error)
      throw new Error('Harita servisi şu anda kullanılamıyor')
    }
  }
}

// Weather Service (Bonus feature)
export const weatherService = {
  async getWeather(lat: number, lng: number) {
    try {
      // Using OpenWeatherMap as fallback (free tier)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=YOUR_OPENWEATHER_API_KEY&units=metric`
      )
      
      return response.data
    } catch (error) {
      console.error('Weather API Error:', error)
      return null
    }
  }
}