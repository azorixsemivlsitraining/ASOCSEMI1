import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import Header from "../components/Header";

import { supabase } from "../lib/supabase";
import { googleSheetsService } from "../services/googleSheets";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        message: formData.message,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("contacts").insert([contactData]);

      if (error) throw error;

      // Sync to Google Sheets in background
      googleSheetsService.syncContact(contactData).catch((err) => {
        console.error("Failed to sync contact to Google Sheets:", err);
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="bg-card-bg border border-border-subtle rounded-xl p-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Thank You!
              </h1>
              <p className="text-foreground/70 text-lg mb-8">
                Your message has been sent successfully. We'll get back to you
                within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Ready to start your project? Let's discuss how we can help bring
              your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-card-bg border border-border-subtle rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-tech-blue/10 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-tech-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <p className="text-foreground/70">contact@asocsemi.com</p>
                      <p className="text-foreground/70">support@asocsemi.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-tech-blue/10 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-tech-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Phone
                      </h3>
                      <p className="text-foreground/70">+91 40-71553446</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-tech-blue/10 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-tech-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Office
                      </h3>
                      <p className="text-foreground/70">
                        ANANTHA SOFTWARE SOLUTIONS Pvt. Ltd., WeWork Rajapushpa
                        Summit Rajapushpa Summit, Financial District, Hyderabad,
                        Telangana 500032.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-bg border border-border-subtle rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Office Hours
                </h2>
                <div className="space-y-2 text-foreground/70">
                  <p>
                    <span className="font-medium">Monday - Friday:</span> 9:00
                    AM - 6:00 PM
                  </p>
                  <p>
                    <span className="font-medium">Saturday:</span> 10:00 AM -
                    4:00 PM
                  </p>
                  <p>
                    <span className="font-medium">Sunday:</span> Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card-bg border border-border-subtle rounded-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="container mx-auto max-w-6xl px-4 mt-16 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Find <span className="text-gradient">Our Office</span>
            </h2>
            <p className="text-foreground/70">
              Visit us at our Hyderabad office in the Financial District
            </p>
          </div>

          <div className="bg-card-bg border border-border-subtle rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3806.765449270925!2d78.3366206!3d17.4230403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8de7c6d9d223%3A0x82e8892a719cbebd!2sANANTHA%20SOFTWARE%20SOLUTIONS%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1755579698564!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ASOCSEMI Office Location"
              className="w-full"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
