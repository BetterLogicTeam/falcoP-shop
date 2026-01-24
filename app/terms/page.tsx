'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsAndConditions() {
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
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="text-falco-accent font-bold text-xl">FALCO P</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold mb-4">
              TERMS & CONDITIONS
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Terms Content */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
              
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold mb-6">
                FALCO P – Terms and Conditions of Sale and Use
              </h2>
              
              <p className="text-falco-accent italic mb-8">
                Last Updated: 15/9/25
              </p>

              <p className="text-lg mb-8">
                These Terms and Conditions ("Terms") govern your access to and use of the FALCO P website (falcop.com), related applications (e.g., a member app), and any services provided by FALCO P ("FALCO P," "we," "us," or "our"), including your purchase of products through our platforms. Please read these Terms carefully before using our services.
              </p>

              <p className="text-lg mb-8">
                By accessing our website, using our app, or placing an order, you confirm that you agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access our website or use our services.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">1. Company Information</h3>
              <div className="mb-8">
                <p>FALCO P</p>
                <p>vårfrugatan 2</p>
                <p>Organisationsnummer: 200011024494</p>
                <p>Email: falcoswoop@gmail.com</p>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">2. Eligibility</h3>
              <p className="mb-6">To use our services and make a purchase, you must:</p>
              <ul className="mb-8 space-y-2">
                <li>• Be at least 18 years of age, or have the consent of a parent or guardian.</li>
                <li>• Be capable of entering into a legally binding contract.</li>
                <li>• Provide accurate and complete information when creating an account or making a purchase.</li>
              </ul>

              <h3 className="text-xl font-bold text-falco-accent mb-4">3. Account Creation and Security</h3>
              <p className="mb-8">
                You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">4. Orders and Purchases</h3>
              <div className="mb-8 space-y-4">
                <p><span className="text-falco-gold font-semibold">Product Information:</span> We strive to display accurate product information, including colors, specifications, and prices. However, errors may occur. We reserve the right to correct any errors and to update information at any time without prior notice.</p>
                
                <p><span className="text-falco-gold font-semibold">Order Acceptance:</span> Your order is an offer to purchase our products. We accept your offer only when we send you a formal order confirmation email. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in the product or price description, or suspected fraudulent activity.</p>
                
                <p><span className="text-falco-gold font-semibold">Pricing and Payment:</span> All prices are listed in Swedish Krona (SEK) and include Swedish VAT (moms). Prices are subject to change without notice. Payment is processed securely through our third-party payment partners.</p>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">5. Shipping, Delivery, and Returns</h3>
              <p className="mb-6">Our policies on shipping, delivery, returns, and warranties are governed by:</p>
              <ul className="mb-8 space-y-2">
                <li>• These Terms.</li>
                <li>• Our separate Return and Refund Policy.</li>
                <li>• <span className="text-falco-gold font-semibold">Mandatory Swedish and EU consumer law.</span> Your statutory rights under the Swedish Consumer Sales Act (konsumentköplagen) are always paramount and cannot be limited by these Terms.</li>
              </ul>

              <h3 className="text-xl font-bold text-falco-accent mb-4">6. Intellectual Property Rights</h3>
              <p className="mb-8">
                All content available on our services, including designs, text, graphics, images, logos, and software, is the property of FALCO P or our licensors and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content without our prior written permission.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">7. User-Generated Content</h3>
              <p className="mb-8">
                If you submit any content to us (e.g., product reviews, photos, contest entries, or ideas), you grant FALCO P a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and display that content for any purpose in connection with our business. You represent that you own the content you submit.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">8. Disclaimer and Limitation of Liability</h3>
              <div className="mb-8 space-y-4">
                <p><span className="text-falco-gold font-semibold">Products "As Is":</span> Our products are sold "as is." We disclaim all warranties to the fullest extent permitted by applicable law, except for the warranties explicitly stated in our warranty policy and those mandated by Swedish consumer law.</p>
                
                <p><span className="text-falco-gold font-semibold">Limited Liability:</span> FALCO P shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services or products. Our total liability to you for any claim shall be limited to the purchase price of the product(s) you purchased from us. <span className="text-falco-gold italic">This limitation does not apply in cases of wilful misconduct, gross negligence, or personal injury, and it does not infringe upon your mandatory rights under Swedish consumer law.</span></p>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">9. Dispute Resolution and Governing Law</h3>
              <div className="mb-8 space-y-4">
                <p><span className="text-falco-gold font-semibold">Governing Law:</span> These Terms and any disputes arising from them shall be governed by and construed in accordance with the laws of Sweden, without regard to its conflict of law principles.</p>
                
                <p><span className="text-falco-gold font-semibold">Amicable Settlement:</span> We aim to resolve any complaints amicably. Please contact our customer service first at falcoswoop@gmail.com.</p>
                
                <p><span className="text-falco-gold font-semibold">Swedish National Board for Consumer Disputes (ARN):</span> If we cannot resolve a complaint, you can submit it to the Allmänna reklamationsnämnden (ARN) for dispute resolution. Their decisions are not legally binding but are generally followed by reputable companies.</p>
                
                <p><span className="text-falco-gold font-semibold">European Commission's ODR Platform:</span> As an EU consumer, you can also use the European Commission's Online Dispute Resolution (ODR) platform to resolve disputes (<a href="http://ec.europa.eu/odr" className="text-falco-accent hover:text-falco-gold transition-colors">http://ec.europa.eu/odr</a>).</p>
                
                <p><span className="text-falco-gold font-semibold">Court Proceedings:</span> Any disputes not resolved through the above methods may be brought before the general courts of Sweden, with the Stockholm District Court (Stockholms tingsrätt) as the first instance, unless mandatory law dictates another venue.</p>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">10. Changes to Terms</h3>
              <p className="mb-8">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes your acceptance of the new Terms.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">11. Contact Us</h3>
              <div className="mb-8">
                <p>For questions about these Terms, please contact us at:</p>
                <p className="mt-4">
                  FALCO P<br />
                  vårfrugatan 2<br />
                  Email: falcoswoop@gmail.com
                </p>
              </div>

              {/* Key Considerations Section */}
              <div className="bg-gradient-to-br from-falco-accent/20 to-falco-gold/20 rounded-2xl p-8 border border-falco-accent/30 mt-12">
                <h3 className="text-xl font-bold text-falco-gold mb-4">Key Considerations for Swedish Company</h3>
                <div className="space-y-4 text-sm">
                  <p><span className="text-falco-accent font-semibold">1. Mandatory Consumer Law (Konsumentköplagen):</span> Swedish consumer law is very strong and favors the consumer. Your terms cannot override a consumer's statutory rights, such as the right to a 3-year warranty against defects and the right to complain within a reasonable time.</p>
                  
                  <p><span className="text-falco-accent font-semibold">2. Dispute Resolution:</span> Unlike the US model of mandatory arbitration, the preferred and standard method for consumer disputes in Sweden is through the National Board for Consumer Disputes (Allmänna reklamationsnämnden, ARN).</p>
                  
                  <p><span className="text-falco-accent font-semibold">3. Company Information:</span> EU law requires you to provide clear and easily accessible company information, including your legal business name, registration number, and physical address.</p>
                  
                  <p><span className="text-falco-accent font-semibold">4. Language:</span> The official terms must be provided in Swedish to be enforceable against Swedish consumers. This English version should be considered a courtesy translation.</p>
                  
                  <p><span className="text-falco-accent font-semibold">5. Returns & Right of Withdrawal (Ångerrätt):</span> For distance selling, consumers in the EU have a mandatory 14-day "right of withdrawal" to return products for any reason. This must be clearly stated in a separate Returns Policy.</p>
                </div>
              </div>

              {/* Back to Shop CTA */}
              <div className="text-center mt-16">
                <Link 
                  href="/shop" 
                  className="inline-flex items-center space-x-2 bg-falco-accent text-falco-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-gold hover:scale-105 transition-all duration-300"
                >
                  <span>Shop FALCO P Collection</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
