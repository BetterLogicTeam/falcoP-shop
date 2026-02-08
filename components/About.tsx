'use client'

import { useState } from 'react'
import { Target, Eye, Zap, Award, Users, Globe } from 'lucide-react'
import { useClientTranslation } from '../hooks/useClientTranslation'

export default function About() {
  const { t } = useClientTranslation()
  const [activeTab, setActiveTab] = useState('mission')

  const tabs = [
    { id: 'mission', label: t('about.mission', 'Mission'), icon: Target },
    { id: 'vision', label: t('about.vision', 'Vision'), icon: Eye },
    { id: 'values', label: t('about.values', 'Values'), icon: Award },
  ]

  const content = {
    mission: {
      title: t('about.mission', 'Our Mission'),
      subtitle: t('about.mission_subtitle', 'Soar Above the Competition'),
      description: t('about.mission_desc', 'At Falco Sportswear, our mission is to soar above the competition and become the best in style and design. Inspired by the majestic falcon, we bring forth innovative environmental solutions and tackle challenges head-on, delivering products that not only elevate performance but also set new standards of excellence in the sportswear industry.'),
      features: [
        t('about.mission_feature_1', 'Innovation-driven design philosophy'),
        t('about.mission_feature_2', 'Environmental sustainability focus'),
        t('about.mission_feature_3', 'Performance excellence standards'),
        t('about.mission_feature_4', 'Athlete empowerment through quality')
      ]
    },
    vision: {
      title: t('about.vision', 'Our Vision'),
      subtitle: t('about.vision_subtitle', 'Revolutionizing Fashion Landscape'),
      description: t('about.vision_desc', 'We envision a future where style and sustainability seamlessly intertwine, where every garment tells a story of innovation and purpose. By harnessing the inherent qualities of the falcon—agility, keen perception, and adaptability—we aspire to be at the forefront of environmental stewardship and problem-solving.'),
      features: [
        t('about.vision_feature_1', 'Sustainable fashion leadership'),
        t('about.vision_feature_2', 'Global brand recognition'),
        t('about.vision_feature_3', 'Innovation in materials and design'),
        t('about.vision_feature_4', 'Community-driven growth')
      ]
    },
    values: {
      title: t('about.values', 'Our Values'),
      subtitle: t('about.values_subtitle', 'Core Principles'),
      description: t('about.values_desc', 'Our values are the foundation of everything we do. We believe in innovation, quality, individuality, integrity, and community. These principles guide our decisions, shape our culture, and drive our commitment to excellence in every aspect of our operations.'),
      features: [
        t('about.values_feature_1', 'Innovation: Pushing boundaries of design'),
        t('about.values_feature_2', 'Quality: Craftsmanship and attention to detail'),
        t('about.values_feature_3', 'Individuality: Celebrating diversity and uniqueness'),
        t('about.values_feature_4', 'Integrity: Honest and transparent business practices'),
        t('about.values_feature_5', 'Community: Supporting athletes worldwide')
      ]
    }
  }

  const stats = [
    { icon: Users, value: '10K+', label: 'Athletes Served' },
    { icon: Globe, value: '50+', label: 'Countries' },
    { icon: Award, value: '100%', label: 'Quality Promise' },
    { icon: Zap, value: '24/7', label: 'Innovation' },
  ]

  return (
    <section id="about" className="section-padding bg-falco-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-0">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                      activeTab === tab.id
                        ? 'bg-falco-accent text-falco-primary'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2 sm:mb-3 lg:mb-4">
                  {content[activeTab as keyof typeof content].title}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-falco-accent font-semibold mb-3 sm:mb-4 lg:mb-6">
                  {content[activeTab as keyof typeof content].subtitle}
                </p>
                <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {content[activeTab as keyof typeof content].description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 sm:space-y-3">
                {content[activeTab as keyof typeof content].features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-falco-accent rounded-full flex-shrink-0"></div>
                    <span className="text-white/80 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative group px-4 sm:px-6 lg:px-0">
            {/* Main Container with Enhanced Styling */}
            <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/10 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-sm">
              {/* Video Container */}
              <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[500px] bg-gradient-to-br from-gray-800 to-black rounded-2xl sm:rounded-3xl overflow-hidden">
                <video
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/falcop.mp4" type="video/mp4" />
                </video>

                {/* Elegant Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-falco-accent/10 via-transparent to-falco-gold/10"></div>

                {/* Brand Badge */}
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-gradient-to-r from-falco-accent to-falco-gold rounded-lg sm:rounded-xl px-2 py-1 sm:px-4 sm:py-2">
                  <span className="text-falco-primary text-xs sm:text-sm font-black tracking-wider">
                    WING P
                  </span>
                </div>
              </div>

              {/* Enhanced Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-falco-accent/30 to-transparent rounded-full animate-pulse blur-sm"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-falco-gold/30 to-transparent rounded-full animate-pulse blur-sm" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-falco-accent/20 to-falco-gold/20 rounded-3xl transform rotate-2 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-falco-gold/10 to-falco-accent/10 rounded-3xl transform -rotate-1 blur-sm"></div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_80px_rgba(34,211,238,0.5)] transition-all duration-500"></div>
          </div>
        </div>

        {/* Small Attractive Stats Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colors = [
              { bg: 'from-pink-500 to-rose-600', accent: 'from-pink-400 to-rose-500', text: 'text-pink-100' },
              { bg: 'from-blue-500 to-cyan-600', accent: 'from-blue-400 to-cyan-500', text: 'text-blue-100' },
              { bg: 'from-emerald-500 to-green-600', accent: 'from-emerald-400 to-green-500', text: 'text-emerald-100' },
              { bg: 'from-purple-500 to-violet-600', accent: 'from-purple-400 to-violet-500', text: 'text-purple-100' }
            ]
            const colorScheme = colors[index % colors.length]
            
            return (
              <div key={index} className="group relative">
                {/* Small Attractive Card */}
                <div className={`relative bg-gradient-to-br ${colorScheme.bg} rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-1 hover:scale-105 overflow-hidden`}>
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full blur-lg"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 bg-white/30 rounded-full blur-md"></div>
                  </div>
                  
                  {/* Small Icon */}
                  <div className="relative z-10 mb-2 sm:mb-3 text-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${colorScheme.accent} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 shadow-md`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm" />
                    </div>
                  </div>
                  
                  {/* Small Stats Content */}
                  <div className="relative z-10 text-center">
                    <div className={`text-lg sm:text-xl lg:text-2xl font-black ${colorScheme.text} mb-1 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm`}>
                      {stat.value}
                    </div>
                    <div className={`text-white/90 text-xs font-medium tracking-wide uppercase group-hover:text-white transition-colors duration-300`}>
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                </div>
                
                {/* Subtle Floating Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                      style={{
                        left: `${35 + (i * 30)}%`,
                        top: `${30 + (i * 20)}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '2s'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
