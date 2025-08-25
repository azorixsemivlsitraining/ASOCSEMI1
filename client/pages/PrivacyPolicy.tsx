import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card-bg border border-border-subtle rounded-xl p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-foreground/70 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">1. Information We Collect</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>
                    At ASOCSEMI, we collect information you provide directly to us, such as when you create an account, 
                    apply for positions, submit contact forms, or communicate with us.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Professional information (resume, cover letter, work experience)</li>
                    <li>Technical information (IP address, browser type, device information)</li>
                    <li>Usage data (how you interact with our services)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">2. How We Use Your Information</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide and improve our services</li>
                    <li>Process job applications and recruitment activities</li>
                    <li>Communicate with you about our services</li>
                    <li>Ensure security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">3. Information Sharing</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share your 
                    information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements</li>
                    <li>To protect our rights and safety</li>
                    <li>With trusted service providers who assist in our operations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">4. Data Security</h2>
                <p className="text-foreground/80">
                  We implement appropriate security measures to protect your personal information against unauthorized 
                  access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular 
                  security assessments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">5. Your Rights</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Data portability</li>
                    <li>Lodge a complaint with regulatory authorities</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">6. Cookies and Tracking</h2>
                <p className="text-foreground/80">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and 
                  improve our services. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">7. Data Retention</h2>
                <p className="text-foreground/80">
                  We retain your information for as long as necessary to provide our services, comply with legal 
                  obligations, and resolve disputes. Job application data is typically retained for 2 years unless 
                  otherwise required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">8. Contact Us</h2>
                <div className="text-foreground/80">
                  <p>If you have any questions about this Privacy Policy, please contact us:</p>
                  <div className="mt-4 space-y-2">
                    <p>Email: privacy@asocsemi.com</p>
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
