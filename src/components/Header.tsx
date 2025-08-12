import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Globe, Compass, Languages, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setIsLanguageOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Compass className="h-8 w-8 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              AI Seyahat Rehberi
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-primary-100 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <Globe className="h-5 w-5" />
              <span>{t('nav.home')}</span>
            </Link>
            <Link 
              to="/guide" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/guide' 
                  ? 'bg-primary-100 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>{t('nav.travelGuide')}</span>
            </Link>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
              >
                <Languages className="h-5 w-5" />
                <span>{i18n.language === 'tr' ? 'TR' : 'EN'}</span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => toggleLanguage('tr')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      i18n.language === 'tr' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                    }`}
                  >
                    🇹🇷 Türkçe
                  </button>
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      i18n.language === 'en' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Globe className="h-5 w-5" />
                <span>{t('nav.home')}</span>
              </Link>
              <Link 
                to="/guide" 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/guide' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>{t('nav.travelGuide')}</span>
              </Link>
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Languages className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{t('language.switch')}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleLanguage('tr')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      i18n.language === 'tr' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    🇹🇷 Türkçe
                  </button>
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      i18n.language === 'en' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header