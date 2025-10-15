'use client'

import { useState, useEffect } from 'react'
import { useClientTranslation } from '../hooks/useClientTranslation'
import { ChevronDown, Globe } from 'lucide-react'

const languages = [
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
]

interface LanguageSelectorProps {
  className?: string
  mobile?: boolean
}

export default function LanguageSelector({ className = '', mobile = false }: LanguageSelectorProps) {
  const { i18n, ready } = useClientTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !ready) {
    return null // Prevent hydration mismatch
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode)
      setIsOpen(false)
      // Store the language choice in localStorage
      localStorage.setItem('i18nextLng', langCode)
    } catch (error) {
      console.error('Failed to change language:', error)
      setIsOpen(false)
    }
  }

  if (mobile) {
    return (
      <div className={`${className}`}>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-falco-accent font-bold text-sm mb-3 px-2">Language</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-300 ${
                  i18n.language === lang.code
                    ? 'bg-falco-accent text-falco-primary'
                    : 'text-white/80 hover:text-falco-accent hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 text-white"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:block">{currentLanguage.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors duration-300 ${
                    i18n.language === lang.code
                      ? 'bg-falco-accent text-falco-primary'
                      : 'text-white/80 hover:text-falco-accent hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {i18n.language === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
