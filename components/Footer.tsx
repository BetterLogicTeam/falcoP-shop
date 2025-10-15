'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { 
  FaDiscord, 
  FaTwitter, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok 
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiOpensea } from 'react-icons/si'
import Link from 'next/link'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, SUBSCRIPTION_TEMPLATE_PARAMS } from '../lib/emailjs'
import { useClientTranslation } from '../hooks/useClientTranslation'

export default function Footer() {
  const { t } = useClientTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    
    try {
      // Prepare template parameters for footer subscription
      const templateParams = {
        ...SUBSCRIPTION_TEMPLATE_PARAMS,
        subscriber_email: email,
        subscription_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        source: 'Falco P Website - Footer Subscription',
        message: `New subscriber from footer section interested in:
🎯 Falco P NFT Collections & New Drops
🚀 Exclusive Early Access to Limited Edition Releases  
🎪 Community Events & Discord Announcements
📖 Behind-the-Scenes Content & Brand Stories
💎 Special Offers & VIP Member Benefits
🏆 New Product Launches & Athletic Gear Updates
🦅 Wing P Story Updates & Brand Evolution
⚡ Live Mint Events & Community Competitions

Subscriber joined from the footer section on ${typeof window !== 'undefined' ? window.location.href : 'Falco P Website'}`
      }

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      )

      if (response.status === 200) {
        setStatus('success')
        setMessage('🚀 Subscribed! Welcome to Falco P!')
        setEmail('')
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      setStatus('error')
      setMessage('Something went wrong. Please try again!')
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  const footerLinks = {
    company: [
      { name: t('footer.about_us', 'About Us'), href: '#about' },
      { name: t('footer.wing_p_story', 'Wing P Story'), href: '/story' },
    ],
    products: [
      { name: t('footer.all_products', 'All Products'), href: '/shop' },
      { name: t('footer.men', 'Men'), href: '/shop/men' },
      { name: t('footer.women', 'Women'), href: '/shop/women' },
      { name: t('footer.kids', 'Kids'), href: '/shop/kids' },
      { name: t('footer.nft_collection', 'NFT Collection'), href: 'https://nft.falcop.com/', external: true },
    ],
    support: [
      { name: t('footer.contact', 'Contact'), href: '#contact' },
    ],
    legal: [
      { name: t('footer.terms', 'Terms & Conditions'), href: '/terms' },
      { name: t('footer.privacy', 'Privacy Policy'), href: '/privacy' },
      { name: t('footer.cookies', 'Cookie Policy'), href: '/cookies' },
    ]
  }

  const socialLinks = [
    { name: 'Discord', icon: FaDiscord, href: 'https://discord.gg/T5XsyYjR' },
    { name: 'X (Twitter)', icon: FaXTwitter, href: 'https://x.com/falcoswoop?s=11' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/@falcoswoop?si=zcqc0bhS7V-Qdd2n' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/falcoswoop?igsh=NG1yOTE0ZHR5NGh3' },
    { name: 'TikTok', icon: FaTiktok, href: 'https://www.tiktok.com/@falco.p1?_t=ZN-8zh2w9qxTaY&_r=1' },
    { name: 'OpenSea', icon: SiOpensea, href: 'https://opensea.io/collection/falco-p-sportswear-revolution-373261412' },
  ]

  return (
    <footer id="contact" className="bg-falco-primary border-t border-white/10">
      {/* Main Footer */}
      <div className="container-custom py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/falcop.jpg"
                  alt="Falco P Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl sm:text-2xl font-display font-bold gradient-text">
                FALCO P
              </span>
            </div>
            <p className="text-white/70 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {t('footer.description', 'Empowering athletes worldwide with premium sportswear inspired by the majestic falcon. Unleash your inner maverick with our innovative designs and uncompromising quality.')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3 text-white/70">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-falco-accent" />
                <a href="mailto:Falcoswoop@gmail.com" className="text-sm sm:text-base hover:text-falco-accent transition-colors duration-300">Falcoswoop@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-white/70">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-falco-accent" />
                <a href="tel:+46762467194" className="text-sm sm:text-base hover:text-falco-accent transition-colors duration-300">+46 76 246 71 94</a>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-white/70">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-falco-accent" />
                <a href="https://nft.falcop.com/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:text-falco-accent transition-colors duration-300">nft.falcop.com</a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-falco-accent rounded-full flex items-center justify-center transition-colors duration-300 group"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-falco-primary" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-falco-accent transition-colors duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Products</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-falco-accent transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-falco-accent transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-falco-accent transition-colors duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-0">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 sm:mb-4">
              {t('footer.stay_updated', 'Stay Updated')}
            </h3>
            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
              {t('footer.newsletter_desc', 'Get the latest news, exclusive offers, and product updates delivered to your inbox.')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.email_placeholder', 'Enter your email')}
                className="flex-1 px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-falco-accent text-sm sm:text-base"
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary flex items-center justify-center space-x-2 px-6 py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-falco-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t('footer.subscribe', 'Subscribe')}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </>
                )}
              </button>
            </form>
            
            {/* Status Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-full backdrop-blur-sm ${
                status === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                  : 'bg-red-500/20 border border-red-400/30 text-red-300'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {status === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 py-4 sm:py-6">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 px-4 sm:px-6 lg:px-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <p className="text-white/60 text-xs sm:text-sm">
                © 2024 Falco P. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-6">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-white/60 hover:text-falco-accent text-xs sm:text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white/60 text-xs sm:text-sm">
              <span>Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-falco-accent fill-current" />
              <span>in Sweden</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
