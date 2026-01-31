'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CookiePolicy() {
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
            <div className="text-falco-accent font-bold text-xl">FALCO PEAK</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold mb-4">
              COOKIE POLICY
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Cookie Policy Content */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
              
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold mb-6">
                FALCO PEAK – Cookie Policy
              </h2>
              
              <p className="text-falco-accent italic mb-8">
                Last Updated: 15/9/25
              </p>

              <p className="text-lg mb-8">
                This Cookie Policy explains how <span className="text-falco-accent font-semibold">FALCO PEAK</span> ("we," "us," or "our") uses cookies and similar tracking technologies on our website falcop.com and related services (collectively, the "Service"). This policy should be read alongside our <Link href="/privacy" className="text-falco-accent hover:text-falco-gold transition-colors">Privacy Policy</Link>.
              </p>

              <p className="text-lg mb-8">
                By managing your preferences in our cookie consent banner, you can control which cookies are set. You can change your preferences at any time.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">1. What Are Cookies and Similar Technologies?</h3>
              <ul className="mb-8 space-y-3">
                <li>• <span className="text-falco-gold font-semibold">Cookies:</span> A small text file stored on your device (computer, tablet, or mobile) when you access our website. They are widely used to make websites work efficiently and provide information to the site owners.</li>
                <li>• <span className="text-falco-gold font-semibold">Local Storage:</span> Similar to cookies, this technology allows a website to store information on your device to enhance your user experience (e.g., remembering shopping cart contents).</li>
                <li>• <span className="text-falco-gold font-semibold">Pixels/Tags:</span> Small, invisible pieces of code on a web page that allow us to track activity, such as whether you have viewed a page.</li>
              </ul>
              <p className="mb-8">
                We refer to all these technologies collectively as "cookies."
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">2. Why Do We Use Cookies?</h3>
              <p className="mb-6">We use cookies for the following purposes:</p>

              {/* Cookie Categories Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border border-gray-600 rounded-lg">
                  <thead className="bg-falco-accent/20">
                    <tr>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Category</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Purpose</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-gray-600 p-3 text-falco-gold font-semibold">Strictly Necessary</td>
                      <td className="border border-gray-600 p-3">These are essential for the website to function and cannot be switched off. They are usually only set in response to actions you take, such as logging in or adding items to a shopping cart. They do not store personally identifiable information.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Legitimate Interest (GDPR Art. 6(1)(f))</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3 text-falco-gold font-semibold">Performance / Analytics</td>
                      <td className="border border-gray-600 p-3">These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular. All information these cookies collect is aggregated and anonymous.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Your Consent (GDPR Art. 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-3 text-falco-gold font-semibold">Functional</td>
                      <td className="border border-gray-600 p-3">These enable the website to provide enhanced functionality and personalization, such as remembering your language preference or login details. They may be set by us or by third-party providers whose services we have added to our pages.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Your Consent (GDPR Art. 6(1)(a))</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3 text-falco-gold font-semibold">Targeting / Advertising</td>
                      <td className="border border-gray-600 p-3">These are set by us and our advertising partners to build a profile of your interests and show you relevant ads on other sites. They work by uniquely identifying your browser and device. They are also used to limit the number of times you see an ad and to measure the effectiveness of advertising campaigns.</td>
                      <td className="border border-gray-600 p-3 text-falco-gold">Your Consent (GDPR Art. 6(1)(a))</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">3. Specific Cookies We Use</h3>
              <p className="mb-6">
                The table below lists some of the cookies we use. The specific third-party services (e.g., Google Analytics, Facebook Pixel) may change.
              </p>

              {/* Specific Cookies Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border border-gray-600 rounded-lg">
                  <thead className="bg-falco-accent/20">
                    <tr>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Cookie Name</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Provider</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Purpose & Category</th>
                      <th className="border border-gray-600 p-3 text-left text-falco-accent font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-gray-600 p-3 font-mono">session_id</td>
                      <td className="border border-gray-600 p-3">FALCO PEAK</td>
                      <td className="border border-gray-600 p-3">Strictly necessary. Used to keep your session active as you navigate the site.</td>
                      <td className="border border-gray-600 p-3">Session</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3 font-mono">cart_id</td>
                      <td className="border border-gray-600 p-3">FALCO PEAK</td>
                      <td className="border border-gray-600 p-3">Strictly necessary. Remembers the items in your shopping cart.</td>
                      <td className="border border-gray-600 p-3">1 day</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-3 font-mono">_ga</td>
                      <td className="border border-gray-600 p-3">Google Analytics</td>
                      <td className="border border-gray-600 p-3">Performance. Used to distinguish unique users.</td>
                      <td className="border border-gray-600 p-3">2 years</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3 font-mono">_gid</td>
                      <td className="border border-gray-600 p-3">Google Analytics</td>
                      <td className="border border-gray-600 p-3">Performance. Used to distinguish unique users.</td>
                      <td className="border border-gray-600 p-3">24 hours</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-3 font-mono">_gat</td>
                      <td className="border border-gray-600 p-3">Google Analytics</td>
                      <td className="border border-gray-600 p-3">Performance. Used to throttle request rate.</td>
                      <td className="border border-gray-600 p-3">1 minute</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="border border-gray-600 p-3 font-mono">fr</td>
                      <td className="border border-gray-600 p-3">Meta (Facebook) Pixel</td>
                      <td className="border border-gray-600 p-3">Targeting. Used to deliver, measure, and analyze the effectiveness of ads.</td>
                      <td className="border border-gray-600 p-3">3 months</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-3 font-mono">NID</td>
                      <td className="border border-gray-600 p-3">Google Maps</td>
                      <td className="border border-gray-600 p-3">Functional. Remembers preferences for viewing maps.</td>
                      <td className="border border-gray-600 p-3">6 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">4. How You Can Manage Your Cookie Preferences</h3>
              <p className="mb-4">
                When you first visit our website, a <span className="text-falco-gold font-semibold">cookie consent banner</span> will appear. Here, you can choose to accept or reject categories of cookies that are not "Strictly Necessary."
              </p>
              
              <div className="bg-falco-accent/20 rounded-lg p-6 mb-6 border border-falco-accent/30">
                <p className="text-falco-gold font-semibold mb-3">You can change your mind and manage your preferences at any time by:</p>
                <ol className="space-y-2">
                  <li>1. Clicking on the "Cookie Settings" or "Manage Consent" link, which is always available in the footer of our website.</li>
                  <li>2. Managing your settings directly in your web browser. Most browsers allow you to:
                    <ul className="mt-2 ml-4 space-y-1">
                      <li>• See what cookies are stored and delete them.</li>
                      <li>• Block third-party cookies.</li>
                      <li>• Block cookies from specific sites.</li>
                      <li>• Block all cookies.</li>
                      <li>• Clear all cookies when you close the browser.</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <p className="mb-6 text-yellow-400">
                Please note that <span className="font-semibold">blocking or deleting cookies may impact your user experience.</span> Parts of the website may not function correctly, and you may need to re-enter your preferences each time you visit.
              </p>

              <div className="mb-8">
                <p className="mb-4 text-falco-gold font-semibold">Links to guides for managing cookies in popular browsers:</p>
                <ul className="space-y-2">
                  <li>• <a href="https://support.google.com/chrome/answer/95647" className="text-falco-accent hover:text-falco-gold transition-colors">Google Chrome</a></li>
                  <li>• <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-falco-accent hover:text-falco-gold transition-colors">Mozilla Firefox</a></li>
                  <li>• <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-falco-accent hover:text-falco-gold transition-colors">Apple Safari</a></li>
                  <li>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-falco-accent hover:text-falco-gold transition-colors">Microsoft Edge</a></li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-falco-accent mb-4">5. International Transfers</h3>
              <p className="mb-8">
                Some of our third-party partners, like Google and Meta, are based outside the EU/EEA. When we transfer your data to them, we ensure the transfer is protected by appropriate safeguards, such as the European Commission's Standard Contractual Clauses (SCCs), to ensure your data is treated with the same level of protection as within the EU.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">6. Changes to This Cookie Policy</h3>
              <p className="mb-8">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>

              <h3 className="text-xl font-bold text-falco-accent mb-4">7. Contact Us</h3>
              <div className="mb-8">
                <p className="mb-4">If you have any questions about our use of cookies, please contact us at:</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p><span className="text-falco-gold font-semibold">FALCO PEAK</span></p>
                  <p>vårfrugatan 2</p>
                  <p>Organisationsnummer: 200011024494</p>
                  <p><span className="text-falco-gold font-semibold">Email:</span> privacy@falcop.com</p>
                </div>
              </div>

              {/* Key Implementation Notes Section */}
              <div className="bg-gradient-to-br from-falco-accent/20 to-falco-gold/20 rounded-2xl p-8 border border-falco-accent/30 mt-12">
                <h3 className="text-xl font-bold text-falco-gold mb-4">Key Implementation Notes for Swedish Company</h3>
                <div className="space-y-4 text-sm">
                  <p><span className="text-falco-accent font-semibold">1. Prior Consent is Mandatory:</span> The most critical rule under the ePrivacy Directive is that you must obtain user consent before setting any non-essential cookies (Analytics, Functional, Targeting). Your website must have a cookie banner that blocks these scripts until the user clicks "Accept."</p>
                  
                  <p><span className="text-falco-accent font-semibold">2. Granular Choice:</span> Your cookie banner should, ideally, allow users to accept or reject each category of cookies (Performance, Functional, Targeting) individually. A simple "Accept All" / "Reject All" is the minimum requirement, but granularity is considered best practice.</p>
                  
                  <p><span className="text-falco-accent font-semibold">3. Easy Withdrawal of Consent:</span> Users must be able to change their mind as easily as they gave consent. The "Cookie Settings" link in the footer is the standard and required way to do this.</p>
                  
                  <p><span className="text-falco-accent font-semibold">4. Swedish Language:</span> The official version of this policy and the cookie banner interface must be available in Swedish. This English version can be provided for convenience, but it should be clear that the Swedish version is the legally binding one.</p>
                  
                  <p><span className="text-falco-accent font-semibold">5. Documentation:</span> You must be able to document the consent given by each user (what they consented to and when). This requires a Consent Management Platform (CMP) that logs user choices.</p>
                </div>
              </div>

              {/* Cookie Settings Button */}
              <div className="text-center mt-12">
                <button className="inline-flex items-center space-x-2 bg-falco-accent text-falco-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-gold hover:scale-105 transition-all duration-300 mr-4">
                  <span>Cookie Settings</span>
                </button>
                <Link 
                  href="/shop" 
                  className="inline-flex items-center space-x-2 bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-600 hover:scale-105 transition-all duration-300"
                >
                  <span>Shop FALCO PEAK Collection</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
