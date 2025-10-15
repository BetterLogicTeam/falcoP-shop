import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation files
import translationEN from '../locales/en.json'
import translationSV from '../locales/sv.json'
import translationES from '../locales/es.json'
import translationAM from '../locales/am.json'

// For now, we'll use English as fallback for additional languages
// You can create specific translation files later
const resources = {
  sv: {
    translation: translationSV,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  am: {
    translation: translationAM,
  },
  fr: {
    translation: translationEN, // Fallback to English
  },
  de: {
    translation: translationEN, // Fallback to English
  },
  it: {
    translation: translationEN, // Fallback to English
  },
  pt: {
    translation: translationEN, // Fallback to English
  },
  ru: {
    translation: translationEN, // Fallback to English
  },
  zh: {
    translation: translationEN, // Fallback to English
  },
  ja: {
    translation: translationEN, // Fallback to English
  },
  ko: {
    translation: translationEN, // Fallback to English
  },
  ar: {
    translation: translationEN, // Fallback to English
  },
  hi: {
    translation: translationEN, // Fallback to English
  },
  tr: {
    translation: translationEN, // Fallback to English
  },
  nl: {
    translation: translationEN, // Fallback to English
  },
  pl: {
    translation: translationEN, // Fallback to English
  },
}

// Supported languages whitelist
const supportedLanguages = Object.keys(resources)

// Don't set a default lng, let the detector work
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages, // Use supportedLngs instead of whitelist
    debug: false, // Set to true for debugging
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },
    react: {
      useSuspense: false, // Important for SSR
    },
    // If no language is detected, default to English
    load: 'languageOnly', // Load only the language part (e.g., 'en' instead of 'en-US')
  })

// Set default language to English if no language is detected
// Only run on client side
if (typeof window !== 'undefined') {
  const storedLang = localStorage.getItem('i18nextLng')
  if (!storedLang || !supportedLanguages.includes(storedLang)) {
    i18n.changeLanguage('en')
  }
}

export default i18n
