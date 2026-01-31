'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useClientTranslation } from '../../../hooks/useClientTranslation'

export default function FalcoPStory() {
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
              href="/" 
              className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('common.back_to_home', 'Back to Home')}</span>
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
              {t('falco_story.title', 'FALCO PEAK STORY')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Story Content */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none">
              
              {/* Opening Quote */}
              <div className="text-center mb-16">
                <p className="text-xl sm:text-2xl font-light text-falco-accent italic leading-relaxed">
                  The dream did not walk; it swooped.
                </p>
                <p className="text-xl sm:text-2xl font-light text-falco-accent italic leading-relaxed mt-4">
                  And it did so by the grace of God.
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

              {/* Main Story */}
              <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
                <p>
                  It was born not on a factory floor, but in the open heavens, where creation itself bears witness to divine perfection. Watching the <span className="text-falco-accent font-semibold">Falco Peregrinus</span>—the peregrine falcon—we saw more than speed. We saw God&apos;s design in motion: patience rewarded, precision perfected, power released at the exact appointed time. The falcon does not rush. It waits. And when it moves, nothing can stop it.
                </p>

                <p className="text-xl font-bold text-falco-gold text-center">
                  That was the vision behind Falco Peak.
                </p>

                <p>
                  This was never about making shoes. It was about forging wings for the modern athlete, blessed by discipline, sharpened by struggle, and lifted by God&apos;s grace. Falco Peak stands as a reminder that those who endure, who remain patient under pressure, are promised elevation. As Scripture teaches, patience is never wasted—it is rewarded with strength.
                </p>

                <p>
                  Every <span className="text-falco-accent font-semibold">Falco Peak</span> sneaker is a testament to that truth. The lateral side isn&apos;t decorated; it&apos;s <span className="text-falco-gold font-semibold">feathered</span>, layered leather panels shaped like a folded wing—humble at rest, unstoppable in motion. It mirrors the believer, the fighter, the oppressed soul who bows today only to rise tomorrow. This is engineering guided by purpose, built for those who trust the process God set in motion.
                </p>

                <div className="bg-gradient-to-r from-falco-primary/20 to-falco-accent/20 rounded-2xl p-8 my-12 border border-falco-accent/30">
                  <div className="space-y-6">
                    <div className="border-l-4 border-falco-gold pl-6">
                      <h4 className="text-xl font-bold text-falco-gold mb-2">The Basketball Player</h4>
                      <p className="text-gray-300">
                        For the <span className="text-falco-accent font-semibold">basketball player</span> leaping for a rebound, it is the <span className="text-falco-gold font-bold italic">stoop</span>—the divine dive. The dual-density foam compresses at the peak, storing energy like faith under pressure, then releases it explosively, lifting the athlete higher than doubt, higher than fear. The outsole grips the court like talons on stone, granting balance and control so sharp it leaves defenders—and obstacles—behind.
                      </p>
                    </div>

                    <div className="border-l-4 border-falco-accent pl-6">
                      <h4 className="text-xl font-bold text-falco-accent mb-2">The Runner</h4>
                      <p className="text-gray-300">
                        For the runner, it is the sustained chase. The long obedience. The Lycra lining wraps the foot like reassurance, light and unseen, reducing drag and carrying the runner forward mile after mile. The cushioning responds like a heartbeat steady with belief, reminding them that God strengthens those who <span className="text-falco-accent font-bold">#KEEPPUSHING</span> when quitting seems easier.
                      </p>
                    </div>

                    <div className="border-l-4 border-falco-gold pl-6">
                      <h4 className="text-xl font-bold text-falco-gold mb-2">The Community</h4>
                      <p className="text-gray-300">
                        And for the community, Falco Peak becomes the <span className="text-falco-accent font-bold italic">aerial pass</span>—trust made tangible. It is for the teams, the neighborhoods, the overlooked and underestimated across the world. It is stability for the oppressed, traction for those pushing against systems designed to hold them down. Falco is not for the tyrant. Falco is the answer to the tyrant.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  Where oppression presses hardest, Falco rises highest. Where power abuses, Falco dives with justice. This is footwear for the weak made strong, for the patient rewarded, for those who waited while the world doubted. By God&apos;s grace, elevation is inevitable.
                </p>

                <p>
                  From the grind of pursuit to the grace of movement through city streets, <span className="text-falco-accent font-bold">Falco Peak</span> walks with you—and when the moment comes, it lifts you. It is more than footwear; it is a symbol of transformation, a reminder that God sees, God strengthens, and God delivers.
                </p>

                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold text-center my-12">
                  This is Wing Power.
                </p>
                <p className="text-xl font-bold text-falco-accent text-center">
                  This is patience crowned with victory.
                </p>
                <p className="text-xl font-bold text-falco-gold text-center">
                  This is the oppressed rising and the tyrant falling.
                </p>

                <div className="text-center my-16">
                  <p className="text-2xl font-bold text-falco-accent mb-4">
                    Unleash Your Flight. Embrace the Pounce.
                  </p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold">
                    FLY HIGH — HIGH AND HIGHER.
                  </p>
                  <p className="text-xl font-semibold text-falco-gold mt-4">
                    By God&apos;s grace.
                  </p>
                </div>

                {/* Final CTA */}
                <div className="bg-gradient-to-r from-falco-accent to-falco-gold rounded-2xl p-8 text-center mt-16">
                  <h3 className="text-2xl font-black text-falco-primary mb-6">
                    {t('falco_story.available_now', 'The Falco Peak Collection – Available Now.')}
                  </h3>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center space-x-2 bg-falco-primary text-falco-accent px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-primary hover:text-falco-accent hover:shadow-lg hover:shadow-falco-accent/25 hover:scale-105 transition-all duration-300 border-2 border-falco-accent"
                  >
                    <span>{t('falco_story.collection_btn', 'FALCO PEAK Collection')}</span>
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
