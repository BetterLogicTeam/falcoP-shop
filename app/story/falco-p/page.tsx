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
            <div className="text-falco-accent font-bold text-xl">FALCO P</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold mb-4">
              {t('falco_story.title', 'FALCO P STORY')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Story Content */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none">
              
              {/* Opening Quote */}
              <div className="text-center mb-16">
                <p className="text-xl sm:text-2xl font-light text-falco-accent italic leading-relaxed">
                  {t('falco_story.quote', '"The dream did not walk; it swooped."')}
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
                  The dream did not walk; it swooped. It was born not on a factory floor, but in the sky, watching the <span className="text-falco-accent font-semibold">Falco Peregrinus</span>—the peregrine falcon—become a blur of lethal grace. This was the vision of <span className="text-falco-gold font-bold">Abdu</span>: to capture not just the bird's image, but its very soul in a sneaker. He didn't want to make shoes; he wanted to forge wings for the modern athlete. He named it <span className="text-falco-gold font-bold italic">Falco P</span>.
                </p>

                <p>
                  Every <span className="text-falco-accent font-semibold">Falco P</span> sneaker is a testament to that ambition. The lateral side isn't decorated; it's <span className="text-falco-gold font-semibold">feathered</span>, with layered leather panels that mimic a primary wing, folded tight against the foot, ready to unfold in motion. It's engineered for the athlete who understands that every sport is a form of flight.
                </p>

                <div className="bg-gradient-to-r from-falco-primary/20 to-falco-accent/20 rounded-2xl p-8 my-12 border border-falco-accent/30">
                  <h3 className="text-2xl font-bold text-falco-accent text-center mb-8">
                    {t('falco_story.sports_section', 'FOR EVERY ATHLETE, FOR EVERY FLIGHT')}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-falco-gold pl-6">
                      <h4 className="text-xl font-bold text-falco-gold mb-2">The Basketball Player</h4>
                      <p className="text-gray-300">
                        For the <span className="text-falco-accent font-semibold">basketball player</span> leaping for a rebound, it's the <span className="text-falco-gold font-bold italic">stoop</span>, the bomb dive. The shoe's dual-density foam core compresses like a spring at the apex of the jump, then unleashes that stored energy, propelling them upward with explosive force for the block or the put-back. The feather-traction outsole grips the hardwood like talons on a cliff edge, allowing for a razor-sharp pivot—the mid-air shift in direction that leaves defenders grasping at air.
                      </p>
                    </div>

                    <div className="border-l-4 border-falco-accent pl-6">
                      <h4 className="text-xl font-bold text-falco-accent mb-2">The Runner</h4>
                      <p className="text-gray-300">
                        For the <span className="text-falco-gold font-semibold">runner</span> on the track, it's the <span className="text-falco-accent font-bold italic">sustained chase</span>. The Lycra lining and lightweight construction are the effortless glide on a thermal, a seamless second skin that reduces drag and enhances speed. The responsive cushioning is the constant, powerful beat of wings, offering rebound and support mile after mile, pushing them to hunt down a personal best.
                      </p>
                    </div>

                    <div className="border-l-4 border-falco-gold pl-6">
                      <h4 className="text-xl font-bold text-falco-gold mb-2">The Community</h4>
                      <p className="text-gray-300">
                        And for the <span className="text-falco-accent font-semibold">community, the team</span>, it's the <span className="text-falco-gold font-bold italic">aerial pass</span>—the precise, trusting transfer of momentum. It's the grip that allows a soccer player to stop on a dime and launch a cross, the stability that lets a point guard plant and fire a no-look pass through traffic. It's the shared language of performance and style, the unspoken bond of those who wear the wing and understand the code of high performance.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  From the relentless pursuit of the goal to the graceful, effortless style of moving through urban spaces, <span className="text-falco-accent font-bold">Falco P</span> is there. It's for every step that pounds the ground with purpose and every moment that defies gravity. It is more than footwear; it is a tool for transformation.
                </p>

                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold text-center my-12">
                  {t('falco_story.wing_power', 'This is Wing Power.')}
                </p>

                <p className="text-xl text-center leading-relaxed">
                  This is the promise of the hunt, the confidence of the dive, and the elegance of the glide, all distilled into a single, powerful statement on your feet.
                </p>

                <div className="text-center my-16">
                  <p className="text-2xl font-bold text-falco-accent mb-4">
                    {t('falco_story.unleash', 'Unleash Your Flight. Embrace the Pounce.')}
                  </p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold">
                    FLY HIGH.
                  </p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-accent via-falco-gold to-falco-accent mt-2">
                    HIGH AND HIGHER
                  </p>
                </div>

                {/* Final CTA */}
                <div className="bg-gradient-to-r from-falco-accent to-falco-gold rounded-2xl p-8 text-center mt-16">
                  <h3 className="text-2xl font-black text-falco-primary mb-6">
                    {t('falco_story.available_now', 'The Falco P Collection – Available Now.')}
                  </h3>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center space-x-2 bg-falco-primary text-falco-accent px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-primary hover:text-falco-accent hover:shadow-lg hover:shadow-falco-accent/25 hover:scale-105 transition-all duration-300 border-2 border-falco-accent"
                  >
                    <span>{t('falco_story.collection_btn', 'FALCO P Collection')}</span>
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
