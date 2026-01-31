'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-falco-primary flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto animate-glow">
            <Image
              src="/images/falcop.jpg"
              alt="Falco Peak Logo"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-display font-bold gradient-text mt-4 animate-fade-in">
            FALCO PEAK
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-falco-secondary rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-falco-accent to-falco-gold transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-white/60 mt-4 text-sm animate-pulse">
          Unleashing your inner maverick...
        </p>

        {/* Falcon Animation */}
        <div className="mt-8">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 border-2 border-falco-accent/30 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-falco-gold/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 border-2 border-falco-accent/20 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
