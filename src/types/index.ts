export interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export interface Attraction {
  name: string
  type: string
  rating: number
}

export interface Restaurant {
  name: string
  cuisine: string
  price: 'uygun' | 'orta' | 'yüksek'
}

export interface Budget {
  daily: string
  accommodation: string
}

export interface TravelRecommendation {
  city: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
  attractions: Attraction[]
  restaurants: Restaurant[]
  budget: Budget
}

export interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  type: 'attraction' | 'restaurant' | 'hotel'
  description?: string
}