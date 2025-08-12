import { useEffect, useRef, useState } from 'react'
import { MapPin, Utensils, Camera } from 'lucide-react'
import { TravelRecommendation } from '../types'

interface MapComponentProps {
  selectedLocation: { lat: number; lng: number } | null
  recommendations: TravelRecommendation | null
}

const MapComponent = ({ selectedLocation, recommendations }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map
    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [28.9784, 41.0082], // Istanbul default
      zoom: 10,
      accessToken: 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' // Replace with actual token
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedLocation) return

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker')
    markers.forEach(marker => marker.remove())

    // Add new marker
    new (window as any).mapboxgl.Marker({
      color: '#3b82f6',
      scale: 1.2
    })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .addTo(map.current)

    // Fly to location
    map.current.flyTo({
      center: [selectedLocation.lng, selectedLocation.lat],
      zoom: 12,
      duration: 2000
    })
  }, [selectedLocation, mapLoaded])

  // Fallback for when Mapbox is not available
  if (typeof window !== 'undefined' && !(window as any).mapboxgl) {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Harita Yükleniyor...
          </h3>
          <p className="text-gray-500 text-sm">
            {recommendations ? (
              <>
                <strong>{recommendations.city}, {recommendations.country}</strong>
                <br />
                Koordinatlar: {recommendations.coordinates.lat.toFixed(4)}, {recommendations.coordinates.lng.toFixed(4)}
              </>
            ) : (
              'Konum seçilmedi'
            )}
          </p>
          
          {recommendations && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Camera className="h-5 w-5 text-primary-600" />
                  <h4 className="font-semibold">Gezilecek Yerler</h4>
                </div>
                <div className="space-y-2">
                  {recommendations.attractions.map((attraction, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{attraction.name}</span>
                      <span className="text-green-600">⭐ {attraction.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Utensils className="h-5 w-5 text-primary-600" />
                  <h4 className="font-semibold">Yemek Önerileri</h4>
                </div>
                <div className="space-y-2">
                  {recommendations.restaurants.map((restaurant, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{restaurant.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
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
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Map Controls Overlay */}
      {recommendations && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-2">
            {recommendations.city}, {recommendations.country}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Günlük Bütçe:</span>
              <span className="font-medium">{recommendations.budget.daily}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Konaklama:</span>
              <span className="font-medium">{recommendations.budget.accommodation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapComponent