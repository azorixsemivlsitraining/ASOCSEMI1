import Header from '../components/Header'
import Footer from '../components/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card-bg border border-border-subtle rounded-xl p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-foreground/70 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">1. Acceptance of Terms</h2>
                <p className="text-foreground/80">
                  By accessing and using ASOCSEMI's website and services, you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, please do not 
                  use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">2. Use License</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>
                    Permission is granted to temporarily download one copy of the materials on ASOCSEMI's website for 
                    personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                  <p>Under this license you may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">3. User Accounts</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
                  <p>You are responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Safeguarding the password and all activities under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring your account information remains accurate and up-to-date</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">4. Prohibited Uses</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>You may not use our service:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">5. Job Applications</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>When submitting job applications through our platform:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All information provided must be accurate and truthful</li>
                    <li>You grant us permission to verify the information provided</li>
                    <li>We reserve the right to reject applications for any reason</li>
                    <li>Application data will be retained according to our Privacy Policy</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">6. Service Availability</h2>
                <p className="text-foreground/80">
                  We strive to maintain service availability but do not guarantee uninterrupted access. We may modify, 
                  suspend, or discontinue services at any time without notice. We are not liable for any interruption 
                  or termination of services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">7. Intellectual Property</h2>
                <p className="text-foreground/80">
                  The service and its original content, features, and functionality are and will remain the exclusive 
                  property of ASOCSEMI and its licensors. The service is protected by copyright, trademark, and other 
                  laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">8. Limitation of Liability</h2>
                <p className="text-foreground/80">
                  In no event shall ASOCSEMI, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                  limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">9. Governing Law</h2>
                <p className="text-foreground/80">
                  These Terms shall be interpreted and governed in accordance with the laws of India, without regard 
                  to its conflict of law provisions. Any disputes will be resolved in the courts of Hyderabad, Telangana.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">10. Contact Information</h2>
                <div className="text-foreground/80">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="mt-4 space-y-2">
                    <p>Email: legal@asocsemi.com</p>
                    <p>Phone: +91 9599544288</p>
                    <p>Address: ASOCSEMI SOLUTIONS PVT LTD, Network Rajupatha Summit, Financial District, Hyderabad, Telangana 500032</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
