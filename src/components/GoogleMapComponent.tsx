import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from '@googlemaps/js-api-loader'
import { 
  MapPin, 
  Utensils, 
  Camera, 
  Hotel, 
  Car,
  Star,
  Clock,
  Phone,
  Globe,
  Navigation
} from 'lucide-react'
import { TravelRecommendation } from '../types'
import { mapsService } from '../services/api'

interface GoogleMapComponentProps {
  selectedLocation: { lat: number; lng: number } | null
  recommendations: TravelRecommendation | null
}

interface Place {
  place_id: string
  name: string
  rating?: number
  types: string[]
  vicinity: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

const GoogleMapComponent = ({ selectedLocation, recommendations }: GoogleMapComponentProps) => {
  const { t } = useTranslation()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [placeDetails, setPlaceDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return

      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        })

        const google = await loader.load()
        
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 41.0082, lng: 28.9784 }, // Istanbul default
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        setMapLoaded(true)
      } catch (error) {
        console.error('Failed to load Google Maps:', error)
        setMapLoaded(false)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !selectedLocation) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add main location marker
    const mainMarker = new google.maps.Marker({
      position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      map: mapInstance.current,
      title: recommendations?.city || 'Selected Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#3B82F6"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <circle cx="20" cy="20" r="4" fill="#3B82F6"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
      }
    })

    markersRef.current.push(mainMarker)

    // Add info window for main location
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 5px 0; color: #1F2937;">${recommendations?.city || 'Location'}</h3>
          <p style="margin: 0; color: #6B7280; font-size: 14px;">${recommendations?.country || ''}</p>
        </div>
      `
    })

    mainMarker.addListener('click', () => {
      infoWindow.open(mapInstance.current, mainMarker)
    })

    // Fly to location
    mapInstance.current.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng })
    mapInstance.current.setZoom(14)

    // Load nearby places
    loadNearbyPlaces(selectedLocation.lat, selectedLocation.lng)
  }, [selectedLocation, recommendations])

  const loadNearbyPlaces = async (lat: number, lng: number) => {
    if (!mapInstance.current) return

    setLoading(true)
    try {
      const [restaurants, attractions, hotels] = await Promise.all([
        mapsService.searchNearbyPlaces(lat, lng, 'restaurant', 2000),
        mapsService.searchNearbyPlaces(lat, lng, 'tourist_attraction', 3000),
        mapsService.searchNearbyPlaces(lat, lng, 'lodging', 2000)
      ])

      const allPlaces = [...restaurants, ...attractions, ...hotels].slice(0, 15)
      setNearbyPlaces(allPlaces)

      // Add markers for nearby places
      allPlaces.forEach((place, index) => {
        const isRestaurant = place.types.includes('restaurant')
        const isAttraction = place.types.includes('tourist_attraction')
        const isHotel = place.types.includes('lodging')

        let iconColor = '#10B981' // Default green
        if (isRestaurant) iconColor = '#F59E0B' // Orange
        if (isAttraction) iconColor = '#8B5CF6' // Purple
        if (isHotel) iconColor = '#EF4444' // Red

        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: mapInstance.current,
          title: place.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="${iconColor}"/>
                <circle cx="12" cy="12" r="6" fill="white"/>
                <circle cx="12" cy="12" r="3" fill="${iconColor}"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 24)
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 180px;">
              <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #1F2937;">${place.name}</h4>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">${place.vicinity}</p>
              ${place.rating ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #059669;">⭐ ${place.rating}</p>` : ''}
            </div>
          `
        })

        marker.addListener('click', () => {
          setSelectedPlace(place)
          loadPlaceDetails(place.place_id)
          infoWindow.open(mapInstance.current, marker)
        })

        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error('Failed to load nearby places:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPlaceDetails = async (placeId: string) => {
    try {
      const details = await mapsService.getPlaceDetails(placeId)
      setPlaceDetails(details)
    } catch (error) {
      console.error('Failed to load place details:', error)
    }
  }

  const getPlaceIcon = (types: string[]) => {
    if (types.includes('restaurant')) return <Utensils className="h-4 w-4" />
    if (types.includes('tourist_attraction')) return <Camera className="h-4 w-4" />
    if (types.includes('lodging')) return <Hotel className="h-4 w-4" />
    return <MapPin className="h-4 w-4" />
  }

  if (!mapLoaded) {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t('map.loading')}
          </h3>
          <p className="text-gray-500 text-sm">
            {recommendations ? (
              <>
                <strong>{recommendations.city}, {recommendations.country}</strong>
                <br />
                Koordinatlar: {recommendations.coordinates.lat.toFixed(4)}, {recommendations.coordinates.lng.toFixed(4)}
              </>
            ) : (
              t('map.noLocation')
            )}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full rounded-lg" />
        
        {/* Map Controls Overlay */}
        {recommendations && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h4 className="font-semibold text-gray-900 mb-2">
              {recommendations.city}, {recommendations.country}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('recommendations.daily')}:</span>
                <span className="font-medium">{recommendations.budget.daily}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('recommendations.accommodation')}:</span>
                <span className="font-medium">{recommendations.budget.accommodation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span className="text-sm text-gray-600">{t('common.loading')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar with nearby places */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Yakındaki Yerler</h3>
          <p className="text-sm text-gray-600">Önerilen mekanlar ve turistik yerler</p>
        </div>

        <div className="p-4 space-y-3">
          {nearbyPlaces.map((place) => (
            <div
              key={place.place_id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedPlace?.place_id === place.place_id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedPlace(place)
                loadPlaceDetails(place.place_id)
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="text-primary-600 mt-1">
                  {getPlaceIcon(place.types)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {place.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {place.vicinity}
                  </p>
                  {place.rating && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{place.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Place Details */}
        {selectedPlace && placeDetails && (
          <div className="border-t border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{selectedPlace.name}</h4>
            
            <div className="space-y-3">
              {placeDetails.formatted_address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-600">{placeDetails.formatted_address}</p>
                </div>
              )}
              
              {placeDetails.formatted_phone_number && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`tel:${placeDetails.formatted_phone_number}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {placeDetails.formatted_phone_number}
                  </a>
                </div>
              )}
              
              {placeDetails.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a 
                    href={placeDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
              
              {placeDetails.opening_hours && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {placeDetails.opening_hours.open_now ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
              )}
              
              {placeDetails.rating && (
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {placeDetails.rating} ({placeDetails.user_ratings_total} değerlendirme)
                  </span>
                </div>
              )}
            </div>
            
            {placeDetails.geometry && (
              <button
                onClick={() => {
                  if (mapInstance.current) {
                    mapInstance.current.panTo(placeDetails.geometry.location)
                    mapInstance.current.setZoom(16)
                  }
                }}
                className="mt-4 w-full btn-primary text-sm"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Haritada Göster
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleMapComponent