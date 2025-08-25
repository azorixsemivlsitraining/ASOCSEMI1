import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card-bg border border-border-subtle rounded-xl p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Cookie Policy
            </h1>
            <p className="text-foreground/70 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">What Are Cookies</h2>
                <p className="text-foreground/80">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide a better user experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">How We Use Cookies</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>ASOCSEMI uses cookies for several purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To remember your preferences and settings</li>
                    <li>To enhance security and authenticate users</li>
                    <li>To analyze website traffic and usage patterns</li>
                    <li>To improve our services and user experience</li>
                    <li>To provide personalized content and features</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-background/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-tech-blue mb-2">Essential Cookies</h3>
                    <p className="text-foreground/80">
                      These cookies are necessary for the website to function properly. They enable basic functions 
                      like page navigation, access to secure areas, and authentication.
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-tech-blue mb-2">Performance Cookies</h3>
                    <p className="text-foreground/80">
                      These cookies collect information about how you use our website, such as which pages you visit 
                      most often. This data helps us improve the website's performance and user experience.
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-tech-blue mb-2">Functionality Cookies</h3>
                    <p className="text-foreground/80">
                      These cookies enable the website to remember choices you make and provide enhanced, more personal 
                      features such as remembering your login details or language preferences.
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-tech-blue mb-2">Analytics Cookies</h3>
                    <p className="text-foreground/80">
                      We use analytics cookies to understand how visitors interact with our website by collecting and 
                      reporting information anonymously. This helps us improve our website and services.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">Third-Party Cookies</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>We may also use third-party cookies from trusted partners for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Google Analytics - to analyze website traffic and user behavior</li>
                    <li>Authentication services - for secure login functionality</li>
                    <li>Content delivery networks - to improve website performance</li>
                    <li>Social media integration - for sharing and social features</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">Managing Cookies</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>You can control and manage cookies in several ways:</p>
                  
                  <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Browser Settings</h4>
                    <p>Most browsers allow you to view, manage, and delete cookies through their settings. You can:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Block all cookies</li>
                      <li>Accept only first-party cookies</li>
                      <li>Delete cookies when you close your browser</li>
                      <li>View and delete individual cookies</li>
                    </ul>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Browser-Specific Instructions</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                      <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                      <li>Safari: Preferences → Privacy → Manage Website Data</li>
                      <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">Impact of Disabling Cookies</h2>
                <div className="space-y-4 text-foreground/80">
                  <p>
                    Please note that disabling cookies may affect the functionality of our website. Some features may 
                    not work properly, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>User authentication and login functionality</li>
                    <li>Personalized content and preferences</li>
                    <li>Form submissions and data persistence</li>
                    <li>Website performance and optimization</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">Updates to This Policy</h2>
                <p className="text-foreground/80">
                  We may update this Cookie Policy from time to time to reflect changes in technology, legislation, 
                  or our cookie practices. We will notify you of any significant changes by posting the new policy on 
                  our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-tech-blue">Contact Us</h2>
                <div className="text-foreground/80">
                  <p>If you have any questions about our use of cookies, please contact us:</p>
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
