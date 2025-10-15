'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function useClientTranslation() {
  const [isClient, setIsClient] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setIsClient(true)
    
    // Wait for i18n to be ready
    if (i18n.isInitialized) {
      setIsReady(true)
    } else {
      i18n.on('initialized', () => {
        setIsReady(true)
      })
    }

    // Listen for language changes
    const handleLanguageChanged = () => {
      setIsReady(true)
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('initialized')
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  // Return a safe version of t that works during SSR
  const safeT = (key: string, fallback?: string) => {
    if (!isClient || !isReady) {
      return fallback || key.split('.').pop() || key
    }
    
    try {
      const translation = t(key)
      return translation === key ? (fallback || key.split('.').pop() || key) : translation
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error)
      return fallback || key.split('.').pop() || key
    }
  }

  return {
    t: safeT,
    i18n,
    isClient,
    ready: isClient && isReady
  }
}
