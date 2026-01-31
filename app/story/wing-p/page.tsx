'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useClientTranslation } from '../../../hooks/useClientTranslation'

export default function WingPowerStory() {
  const { t } = useClientTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/story" 
              className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('common.back_to_stories', 'Back to Stories')}</span>
            </Link>
            <div className="text-falco-accent font-bold text-xl">FALCO PEAK</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold mb-4">
              {t('story.title', 'WING P STORY')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Story Content */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none">
              
              {/* Opening Quote */}
              <div className="text-center mb-16">
                <p className="text-xl sm:text-2xl font-light text-falco-accent italic leading-relaxed">
                  {t('story.quote', '"You are not just buying a shoe. You are buying a piece of a dream."')}
                </p>
              </div>

              {/* Divider */}
              <div className="flex justify-center mb-16">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-falco-accent rounded-full"></div>
                  <div className="w-2 h-2 bg-falco-gold rounded-full"></div>
                  <div className="w-2 h-2 bg-falco-accent rounded-full"></div>
                </div>
              </div>

              {/* Main Story - All as flowing paragraphs */}
              <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
                
                <p>
                  This dream first took flight in the mind of a visionary . They watched the Peregrine Falcon, nature's ultimate athlete, and saw more than a bird; they saw a blueprint for perfection. they saw power, grace, and untamed speed. For years, they labored to capture that essence, to distill the very soul of the falcon into something you could wear.
                </p>

                <p>
                  they called it <span className="text-falco-gold font-bold italic">Wing Power</span>. This is that dream, realized.
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold text-center my-12">
                  {t('story.intro', 'INTRODUCING THE FALCO PEAK "WING P"')}
                </p>

                <p className="text-xl text-gray-400 italic text-center mb-12">
                  {t('story.tagline', "This isn't just footwear; it's your kinetic potential, unlocked.")}
                </p>

                <p>
                  <span className="text-xl font-bold text-falco-accent">Look at it.</span> The side isn't adorned with a simple print. It's sculpted with a sweeping, layered wing motif crafted from premium leather. This is aerodynamic artistry. This is the silhouette of a predator poised to strike, a statement that you are here to dominate, not just participate. On the heel, the name <span className="text-falco-gold font-semibold">Falco Peak</span> is stamped with authority—a badge of the elite.
                </p>

                <p>
                  <span className="text-xl font-bold text-falco-accent">Now, feel it.</span> The Lycra lining embraces your foot like a second skin. The <span className="text-falco-gold font-semibold">Talon-Lock lacing system</span> doesn't just tie; it engineers a custom, vice-like grip that makes your foot one with the machine. Inside, a dual-density foam core is the falcon's heart: a soft, explosive energy return surrounded by unwavering stability. This is the cushioning that propels you forward, the control that lets you own your landing.
                </p>

                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold text-center my-12">
                  {t('story.magic', 'But the true magic is under your feet.')}
                </p>

                <p>
                  Turn it over. The sole is a masterpiece of traction. Etched with intricate, feather-line treads, it's designed to do one thing: <span className="text-falco-accent font-bold">grip the world and launch you from it.</span> Whether you're cutting on the court, hitting your personal best on the track, or owning the urban jungle, the wavy, multidirectional pattern connects you to the ground with claw-like certainty. This is <span className="text-falco-gold font-bold">Wing Power (WP)</span>. This is the confidence to push harder, move faster, and <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold">FLY HIGH. HIGH AND HIGHER.</span>
                </p>

                <p className="text-xl font-semibold text-center leading-relaxed my-12">
                  This is the shoe that transforms the runner into a sprinter, the player into a legend, the walker into a force of nature.
                </p>

                <p>
                  <span className="text-falco-accent font-semibold">Zara</span>, a top freerunner, felt it the moment she laced up: <span className="italic">"It's like they're not even on. They're just… part of me."</span> Watch her move—a blur of precision where every pivot is silent, every launch is explosive, and every landing is assured. The city is her canyon, and she is the falcon soaring through it.
                </p>

                <p className="text-2xl font-bold text-falco-accent text-center my-8">{t('story.this_can_be_you', 'This can be you.')}</p>

                <p className="text-center">
                  {t('story.waiting_for_you', "The dream is no longer just individual's. It's here. It's real. It's waiting for you.")}
                </p>
                
                <p className="text-xl font-bold text-white text-center">{t('story.own_it', 'Stop moving through the world. Start owning it.')}</p>
                
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold text-center">
                  {t('story.cta_line', 'Get Your Wings. Unleash the Power.')}
                </p>

                {/* Final CTA */}
                <div className="bg-gradient-to-r from-falco-accent to-falco-gold rounded-2xl p-8 text-center mt-16">
                  <h3 className="text-2xl font-black text-falco-primary mb-6">
                    {t('story.available_now', 'The Falco Peak "Wing P" – Available Now.')}
                  </h3>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center space-x-2 bg-falco-primary text-falco-accent px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-primary hover:text-falco-accent hover:shadow-lg hover:shadow-falco-accent/25 hover:scale-105 transition-all duration-300 border-2 border-falco-accent"
                  >
                    <span>{t('story.collection_btn', 'FALCO PEAK Collection')}</span>
                    <Zap className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
