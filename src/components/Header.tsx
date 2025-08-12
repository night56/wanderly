import { Link, useLocation } from 'react-router-dom'
import { MapPin, Globe, Compass } from 'lucide-react'

const Header = () => {
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">AI Seyahat Rehberi</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Globe className="h-5 w-5" />
              <span>Ana Sayfa</span>
            </Link>
            <Link 
              to="/guide" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/guide' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>Seyahat Rehberi</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header