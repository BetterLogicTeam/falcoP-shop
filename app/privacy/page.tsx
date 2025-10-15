'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
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
              PRIVACY POLICY
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
              
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold mb-6">
                FALCO P – Privacy Policy
              </h2>
              
              <p className="text-falco-accent italic mb-8">
                Last Updated: 15/9/25
              </p>

              <p className="text-lg mb-8">
                At FALCO P AB ("FALCO P," "we," "us," or "our"), we are committed to protecting your privacy and your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website falcop.com, use our mobile application, or make a purchase from us.
              </p>

              <p className="text-lg mb-8">
                We process your personal data in accordance with the EU General Data Protection Regulation (GDPR), the Swedish Data Protection Act (2018:218) (Dataskyddslagen), and other applicable Swedish laws.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">1. Data Controller</h3>
              <div className="mb-8">
                <p>The data controller responsible for your personal data is:</p>
                <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                  <p>FALCO P AB</p>
                  <p>vårfrugatan 2</p>
                  <p>Organisationsnummer: 20000222-6173</p>
                  <p>Email: privacy@falcop.com</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">2. What Personal Data We Collect and Why (Legal Basis)</h3>
              <p className="mb-6">
                We collect information that you provide directly to us, as well as data automatically through your use of our services.
              </p>

              {/* Data Collection Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border border-gray-600 rounded-lg">
                  <thead className="bg-falco-accent/20">
                    <tr>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Purpose of Processing</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Categories of Personal Data</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Legal Basis (According to GDPR)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-gray-600 p-3">To process and deliver your order, manage payments, returns, and warranties.</td>
                      <td className="border border-gray-600 p-3">Name, email, phone number, shipping/billing address, payment information, order history.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Necessary for the performance of a contract (Art. 6(1)(b)).</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3">To create and manage your personal account.</td>
                      <td className="border border-gray-600 p-3">Name, email, password, purchase history, product preferences.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Your consent (Art. 6(1)(a)) and/or Necessary for the performance of a contract (Art. 6(1)(b)).</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-3">To send you direct marketing (e.g., newsletters, offers, and news).</td>
                      <td className="border border-gray-600 p-3">Email address, name, product interests.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Your consent (Art. 6(1)(a)) which you can withdraw at any time. For existing customers, legitimate interest (Art. 6(1)(f)) for similar products (soft opt-in).</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3">To provide customer service and answer your inquiries.</td>
                      <td className="border border-gray-600 p-3">Contact information, correspondence history, order number.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Legitimate interest (Art. 6(1)(f)) to provide good service and support.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-3">To analyze and improve our website, products, and services (analytics).</td>
                      <td className="border border-gray-600 p-3">IP address, device information, browser type, browsing behavior (cookies).</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Your consent (Art. 6(1)(a)) for non-essential cookies. Legitimate interest (Art. 6(1)(f)) for essential functionality and basic analytics.</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3">To comply with legal obligations (e.g., accounting laws, consumer law).</td>
                      <td className="border border-gray-600 p-3">Purchase history, payment details, contact information.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Necessary for compliance with a legal obligation (Art. 6(1)(c)) to which we are subject (e.g., the Swedish Accounting Act (Bokföringslagen)).</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">3. How We Collect Your Data</h3>
              <ul className="mb-8 space-y-2">
                <li>• <span className="text-falco-gold font-semibold">Data you provide:</span> When you make a purchase, create an account, contact our customer service, or sign up for our newsletter.</li>
                <li>• <span className="text-falco-gold font-semibold">Data collected automatically:</span> Through cookies and similar technologies when you browse our site. For more details, please see our Cookie Policy.</li>
                <li>• <span className="text-falco-gold font-semibold">Data from third parties:</span> We may receive information from payment processors (e.g., Klarna, Stripe) and delivery services (e.g., Postnord, DHL) to fulfill your order.</li>
              </ul>

              <h3 className="text-xl font-bold text-falco-accent mb-4">4. How We Share Your Data (Data Processors)</h3>
              <p className="mb-4">
                We may share your data with trusted third parties who act as our data processors to provide services on our behalf. These partners are strictly prohibited from using your data for any other purpose:
              </p>
              <ul className="mb-6 space-y-2">
                <li>• <span className="text-falco-gold font-semibold">Payment processors:</span> To securely handle payments.</li>
                <li>• <span className="text-falco-gold font-semibold">Shipping and logistics partners:</span> To deliver your orders.</li>
                <li>• <span className="text-falco-gold font-semibold">Marketing and analytics platforms:</span> (e.g., email service providers, Google Analytics) only after obtaining your consent where required.</li>
                <li>• <span className="text-falco-gold font-semibold">IT service providers:</span> For hosting and maintaining our website.</li>
              </ul>
              <p className="mb-8 text-falco-accent font-semibold">
                We will never sell your personal data to third parties.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">5. International Transfers</h3>
              <p className="mb-8">
                Some of our service providers may be located outside the EU/EEA (e.g., USA). In such cases, we ensure all transfers are based on a valid legal mechanism, such as an Adequacy Decision by the European Commission or Standard Contractual Clauses (SCCs), to ensure your data receives the same level of protection as within the EU.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">6. How Long We Keep Your Data</h3>
              <p className="mb-4">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul className="mb-8 space-y-2">
                <li>• <span className="text-falco-gold font-semibold">Customer data:</span> For the duration of your account lifespan plus a period required by Swedish accounting laws (e.g., 7 years from the end of the financial year).</li>
                <li>• <span className="text-falco-gold font-semibold">Marketing data:</span> Until you withdraw your consent or object to marketing.</li>
                <li>• <span className="text-falco-gold font-semibold">Cookie data:</span> As specified in our Cookie Policy.</li>
              </ul>

              <h3 className="text-xl font-bold text-falco-accent mb-4">7. Your Data Protection Rights</h3>
              <p className="mb-4">
                Under GDPR, you have the following rights. To exercise any of these rights, please contact us at privacy@falcop.com.
              </p>
              <ul className="mb-6 space-y-3">
                <li>• <span className="text-falco-gold font-semibold">Right of Access (Insynsrätt):</span> You have the right to request a copy of the personal data we hold about you.</li>
                <li>• <span className="text-falco-gold font-semibold">Right to Rectification (Rättelse):</span> You have the right to correct inaccurate or incomplete data about yourself.</li>
                <li>• <span className="text-falco-gold font-semibold">Right to Erasure ("Right to be Forgotten"):</span> You have the right to request that we delete your personal data under certain circumstances.</li>
                <li>• <span className="text-falco-gold font-semibold">Right to Restriction of Processing (Begränsning):</span> You have the right to request that we temporarily stop processing your data.</li>
                <li>• <span className="text-falco-gold font-semibold">Right to Data Portability (Dataportabilitet):</span> You have the right to receive your data in a structured, machine-readable format to transfer to another controller.</li>
                <li>• <span className="text-falco-gold font-semibold">Right to Object (Invända):</span> You have the right to object to processing based on our legitimate interest.</li>
                <li>• <span className="text-falco-gold font-semibold">Right to Withdraw Consent (Återkalla samtycke):</span> Where we rely on your consent, you can withdraw it at any time. This does not affect the lawfulness of processing based on consent before its withdrawal.</li>
              </ul>

              <div className="bg-falco-accent/20 rounded-lg p-6 mb-8 border border-falco-accent/30">
                <p className="mb-2">
                  If you believe we are processing your data unlawfully, you have the right to lodge a complaint with the Swedish supervisory authority:
                </p>
                <div className="text-falco-gold">
                  <p><span className="font-semibold">Integritetsskyddsmyndigheten (IMY)</span></p>
                  <p>Box 8114</p>
                  <p>104 20 Stockholm</p>
                  <p>Website: <a href="https://www.imy.se/" className="text-falco-accent hover:text-falco-gold transition-colors">https://www.imy.se/</a></p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">8. Cookies and Similar Technologies</h3>
              <p className="mb-8">
                We use cookies to improve your experience on our site. Some are essential for the site to function, while others help us with analytics and marketing. You can manage your cookie preferences at any time via our cookie banner or your browser settings. For full details, please see our separate Cookie Policy.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">9. Changes to This Privacy Policy</h3>
              <p className="mb-8">
                We may update this policy to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">10. Contact Us</h3>
              <div className="mb-8">
                <p className="mb-4">For any questions regarding this Privacy Policy or your personal data, please contact our Data Protection team at:</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p><span className="text-falco-gold font-semibold">Email:</span> privacy@falcop.com</p>
                  <p><span className="text-falco-gold font-semibold">Post:</span> FALCO P AB, Attn: Data Protection, vårfrugatan 2</p>
                </div>
              </div>

              {/* Key Considerations Section */}
              <div className="bg-gradient-to-br from-falco-accent/20 to-falco-gold/20 rounded-2xl p-8 border border-falco-accent/30 mt-12">
                <h3 className="text-xl font-bold text-falco-gold mb-4">Key Considerations for Swedish Company</h3>
                <div className="space-y-4 text-sm">
                  <p><span className="text-falco-accent font-semibold">IMY is the Supervisory Authority:</span> The Swedish Authority for Privacy Protection (IMY) has replaced the former Data Inspection Authority (Datainspektionen). It is crucial to direct users to the correct authority.</p>
                  
                  <p><span className="text-falco-accent font-semibold">Legal Basis is Paramount:</span> Swedish and EU law require you to be explicit about your legal basis for processing. The table format is a clear and IMY-approved way to present this.</p>
                  
                  <p><span className="text-falco-accent font-semibold">"Soft Opt-In" for Marketing:</span> You can use the "legitimate interest" basis for marketing similar products to existing customers (the "soft opt-in"), but you must always provide an easy opt-out in every communication.</p>
                  
                  <p><span className="text-falco-accent font-semibold">Cookie Law:</span> Sweden follows the ePrivacy Directive. This requires you to obtain prior consent for all non-essential cookies (e.g., marketing, analytics cookies) via a clear cookie banner.</p>
                  
                  <p><span className="text-falco-accent font-semibold">Language:</span> The official policy must be available in Swedish. This English version should be a translation, and it should be stated that the Swedish version prevails in case of any discrepancy.</p>
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
