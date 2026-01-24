'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Products from '@/components/Products'
import Features from '@/components/Features'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import Navigation from '@/components/HomeNavigation'
import LoadingScreen from '@/components/LoadingScreen'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-falco-primary">
      <Navigation />
      <Hero />
      <About />
      <Features />
      <Products />
      <Newsletter />
      <Footer />
    </main>
  )
}
