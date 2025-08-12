import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Languages, 
  Mic, 
  MicOff, 
  Volume2, 
  Copy, 
  Check, 
  X,
  ArrowLeftRight,
  Globe,
  BookOpen
} from 'lucide-react'
import { translateService } from '../services/api'
import toast from 'react-hot-toast'

interface TranslationWidgetProps {
  isOpen: boolean
  onClose: () => void
  initialText?: string
}

const TranslationWidget = ({ isOpen, onClose, initialText = '' }: TranslationWidgetProps) => {
  const { t, i18n } = useTranslation()
  const [inputText, setInputText] = useState(initialText)
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState(i18n.language === 'tr' ? 'en' : 'tr')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  useEffect(() => {
    if (initialText) {
      setInputText(initialText)
      handleTranslate(initialText)
    }
  }, [initialText])

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = sourceLanguage === 'auto' ? 'tr-TR' : `${sourceLanguage}-${sourceLanguage.toUpperCase()}`

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setInputText(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast.error('Ses tanıma hatası')
      }
    }
  }, [sourceLanguage])

  const handleTranslate = async (text: string = inputText) => {
    if (!text.trim()) {
      setTranslatedText('')
      return
    }

    setIsTranslating(true)
    try {
      const result = await translateService.translateText(text, targetLanguage, sourceLanguage)
      setTranslatedText(result)
    } catch (error) {
      toast.error('Çeviri hatası')
      console.error('Translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSpeak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Metin kopyalandı')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Kopyalama hatası')
    }
  }

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

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setInputText(translatedText)
    setTranslatedText('')
  }

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Languages className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Çeviri Asistanı</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Language Selection */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="auto">Otomatik Algıla</option>
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={swapLanguages}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </button>

                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Translation Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Text */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {sourceLanguage === 'auto' ? 'Otomatik Algıla' : getLanguageName(sourceLanguage)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleListening}
                        className={`p-2 rounded-lg transition-colors ${
                          isListening 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      {inputText && (
                        <button
                          onClick={() => handleSpeak(inputText, sourceLanguage === 'auto' ? 'tr-TR' : sourceLanguage)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          disabled={isSpeaking}
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Çevirmek istediğiniz metni yazın..."
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyUp={() => handleTranslate()}
                  />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{inputText.length} karakter</span>
                    <button
                      onClick={() => setInputText('')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Temizle
                    </button>
                  </div>
                </div>

                {/* Translated Text */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {getLanguageName(targetLanguage)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {translatedText && (
                        <>
                          <button
                            onClick={() => handleSpeak(translatedText, targetLanguage)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            disabled={isSpeaking}
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleCopy(translatedText)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <span className="ml-3 text-gray-600">Çeviriliyor...</span>
                      </div>
                    ) : (
                      <div className="text-gray-800 whitespace-pre-wrap">
                        {translatedText || 'Çeviri burada görünecek...'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{translatedText.length} karakter</span>
                    {translatedText && (
                      <button
                        onClick={() => setTranslatedText('')}
                        className="text-red-500 hover:text-red-700"
                      >
                        Temizle
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Phrases */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İfadeler</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'Merhaba',
                    'Teşekkürler',
                    'Lütfen',
                    'Özür dilerim',
                    'Nerede?',
                    'Ne kadar?',
                    'Çok güzel',
                    'Anlamıyorum'
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => {
                        setInputText(phrase)
                        handleTranslate(phrase)
                      }}
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TranslationWidget