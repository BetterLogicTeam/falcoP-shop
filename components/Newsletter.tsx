'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, SUBSCRIPTION_TEMPLATE_PARAMS } from '../lib/emailjs'
import { useClientTranslation } from '../hooks/useClientTranslation'

const PUBLIC_NEWSLETTER_CODE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_NEWSLETTER_SUBSCRIBER_COUPON_CODE?.trim()) || 'FALCO10'

export default function Newsletter() {
  const { t } = useClientTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [subscriberDiscountCode, setSubscriberDiscountCode] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    setSubscriberDiscountCode(null)
    const subscriberEmail = email.trim()

    try {
      const subRes = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriberEmail }),
      })
      const subJson = await subRes.json().catch(() => ({}))
      if (!subRes.ok) {
        throw new Error(typeof subJson.error === 'string' ? subJson.error : 'Could not save subscription')
      }
      const discountCode =
        typeof subJson.discountCode === 'string' ? subJson.discountCode : PUBLIC_NEWSLETTER_CODE.toUpperCase()

      // Prepare template parameters with the redesigned template structure
      const templateParams = {
        ...SUBSCRIPTION_TEMPLATE_PARAMS,
        subscriber_email: subscriberEmail,
        subscriber_discount_code: discountCode,
        subscription_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        source: 'Falco P Website - Newsletter Section',
        message: `New subscriber interested in:
🎯 Falco P NFT Collections & New Drops
🚀 Exclusive Early Access to Limited Edition Releases  
🎪 Community Events & Discord Announcements
📖 Behind-the-Scenes Content & Brand Stories
💎 Special Offers & VIP Member Benefits
🏆 New Product Launches & Athletic Gear Updates
🦅 Wing P Story Updates & Brand Evolution
⚡ Live Mint Events & Community Competitions

Subscriber discount code: ${discountCode}

Subscriber joined from the main newsletter section on ${window.location.href}`
      }

      let didEmailFail = false
      try {
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        )
        if (response.status !== 200) {
          console.warn('EmailJS returned non-200:', response.status)
          didEmailFail = true
        }
      } catch (emailErr) {
        console.warn('EmailJS notification failed (subscriber still saved):', emailErr)
        didEmailFail = true
      }

      setStatus('success')
      setSubscriberDiscountCode(discountCode)
      const codeLine = t(
        'newsletter.subscriber_code_line',
        'Use code {{code}} at checkout for 10% off (one use per email).'
      ).replace(/\{\{code\}\}/g, discountCode)
      const deliveryLine = didEmailFail
        ? '\n\nNote: We saved your subscription, but the confirmation email could not be delivered right now. Please try again later or contact support.'
        : ''
      setMessage(
        `${t('newsletter.success_message', '🚀 Successfully subscribed! Welcome to the Falco P family.')}\n\n${codeLine}${deliveryLine}`
      )
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscribe error:', error)
      setStatus('error')
      setMessage(t('newsletter.error_message', 'Oops! Something went wrong. Please try again or contact us directly.'))
    }
  }

  return (
    <section className="section-padding bg-gradient-to-br from-falco-accent/10 to-falco-gold/10">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-falco-accent to-falco-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-falco-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {t('newsletter.title', 'STAY IN THE')} <span className="gradient-text">{t('newsletter.title_highlight', 'LOOP')}</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('newsletter.subtitle', 'Get exclusive access to new releases, special offers, and insider updates from the Falco P team.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.email_placeholder', 'Enter your email address')}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-falco-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('newsletter.subscribe', 'Subscribe')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-2xl backdrop-blur-sm ${
                status === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                  : 'bg-red-500/20 border border-red-400/30 text-red-300'
              }`}>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center space-x-2">
                    {status === 'success' ? (
                      <CheckCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-sm font-medium whitespace-pre-line text-left">{message}</span>
                  </div>
                  {status === 'success' && subscriberDiscountCode && (
                    <div className="w-full max-w-sm rounded-xl border border-green-400/40 bg-green-500/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-green-400/90 mb-1">
                        {t('newsletter.your_code_label', 'Your subscriber code')}
                      </p>
                      <p className="font-mono text-lg font-bold tracking-[0.2em] text-green-100">
                        {subscriberDiscountCode}
                      </p>
                    </div>
                  )}
                </div>
                {status === 'success' && (
                  <div className="mt-2 text-xs text-center text-green-400/80">
                    Join our Discord community: discord.gg/T5XsyYjR
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-falco-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-falco-accent font-bold text-lg">%</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Exclusive Discounts</h3>
              <p className="text-white/60 text-sm">
                {t(
                  'newsletter.benefit_discount',
                  'Get 10% off with your personal subscriber code at checkout (one use per email)'
                )}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-falco-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-falco-gold font-bold text-lg">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
              <p className="text-white/60 text-sm">Be the first to know about new releases and limited editions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-falco-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-falco-accent font-bold text-lg">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Special Offers</h3>
              <p className="text-white/60 text-sm">Receive personalized recommendations and birthday surprises</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
