'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useClientTranslation } from '../hooks/useClientTranslation'

export default function Testimonials() {
  const { t } = useClientTranslation()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Professional Athlete',
      sport: 'Track & Field',
      rating: 5,
      text: 'Falco P has completely transformed my performance. The aerodynamic design and premium materials give me that extra edge I need to compete at the highest level.',
      image: '/images/20.jpg',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Fitness Enthusiast',
      sport: 'CrossFit',
      rating: 5,
      text: 'The quality is unmatched. I\'ve been using Falco P gear for over a year now, and it still looks and performs like new. Worth every penny!',
      image: '/images/20.jpg',
      verified: true
    },
    {
      id: 3,
      name: 'Marcus Rodriguez',
      role: 'Basketball Player',
      sport: 'Professional League',
      rating: 5,
      text: 'These shoes are incredible. The grip, comfort, and style are all top-notch. I feel faster and more confident on the court with Falco P.',
      image: '/images/20.jpg',
      verified: true
    },
    {
      id: 4,
      name: 'Emma Thompson',
      role: 'Marathon Runner',
      sport: 'Long Distance',
      rating: 5,
      text: 'I\'ve run 3 marathons in my Falco P shoes. The cushioning and support are perfect for long distances. My feet never felt better!',
      image: '/images/20.jpg',
      verified: true
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'Soccer Player',
      sport: 'Professional Team',
      rating: 5,
      text: 'The cleats are amazing. Great traction, comfortable fit, and they look fantastic. My teammates are all asking where I got them.',
      image: '/images/20.jpg',
      verified: true
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="section-padding bg-falco-primary">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('testimonials.title', 'WHAT OUR')} <span className="gradient-text">{t('testimonials.highlight', 'ATHLETES')}</span> {t('testimonials.say', 'SAY')}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t('testimonials.subtitle', "Don't just take our word for it. Hear from the athletes who trust Falco P to elevate their performance.")}
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
            <div className="flex items-center justify-center mb-8">
              <Quote className="w-12 h-12 text-falco-accent opacity-50" />
            </div>

            <div className="text-center mb-8">
              <div className="flex justify-center items-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-falco-gold fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-falco-accent">
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-falco-accent text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-white/60 text-sm">
                    {testimonials[currentTestimonial].sport}
                  </p>
                  {testimonials[currentTestimonial].verified && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-4 h-4 bg-falco-accent rounded-full flex items-center justify-center">
                        <span className="text-falco-primary text-xs">✓</span>
                      </div>
                      <span className="text-falco-accent text-xs">Verified Purchase</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white/10 hover:bg-falco-accent rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-falco-accent scale-125'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white/10 hover:bg-falco-accent rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">5.0/5</div>
            <div className="text-white/60">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">New</div>
            <div className="text-white/60">Product Launch</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">100%</div>
            <div className="text-white/60">Quality Guaranteed</div>
          </div>
        </div>
      </div>
    </section>
  )
}
