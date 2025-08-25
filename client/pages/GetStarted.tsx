import { useEffect, useState, useRef } from "react";
import { ChevronRight, Rocket, Send } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { googleSheetsService } from "../services/googleSheets";
import Swal from "sweetalert2";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

function Section({ children, className = "" }: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function GetStarted() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    jobTitle: "",
    message: "",
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setIsVisible(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show loading
    Swal.fire({
      title: "Sending...",
      text: "Please wait while we process your request",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const requestData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        job_title: formData.jobTitle,
        message: formData.message,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("get_started_requests")
        .insert([requestData]);

      if (error) throw error;

      // Sync to Google Sheets in background
      googleSheetsService.syncGetStartedRequest(requestData).catch((err) => {
        console.error(
          "Failed to sync get started request to Google Sheets:",
          err,
        );
      });

      Swal.fire({
        title: "Success!",
        text: "Thank you for your interest! We'll get back to you within 24 hours.",
        icon: "success",
        confirmButtonText: "Got it!",
        confirmButtonColor: "#FF6B5A",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        jobTitle: "",
        message: "",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-dark-bg via-background to-card-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Rocket className="w-16 h-16 text-tech-blue mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Integrated <span className="text-gradient">Technology</span>
                <br />
                Solutions
              </h1>
              <p className="text-xl text-muted-foreground">
                Empower your business with our cutting-edge technology and
                engineering services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Content */}
                <div className="lg:sticky lg:top-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Get in <span className="text-gradient">Touch</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    At ASOCSEMI, we are committed to delivering innovative
                    solutions that drive your business forward. Our team
                    combines expertise in various technologies to create
                    seamless, custom solutions for the semiconductor, AI/ML, and
                    IoT industries across diverse domains such as consumer
                    durables, storage, automotive, wireless, and data center.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-tech-blue rounded-full mt-2"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Custom Solutions
                        </h3>
                        <p className="text-muted-foreground">
                          Tailored technology solutions designed specifically
                          for your business needs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-coral rounded-full mt-2"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Expert Team
                        </h3>
                        <p className="text-muted-foreground">
                          Experienced professionals with deep expertise across
                          multiple domains
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-tech-blue rounded-full mt-2"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          24/7 Support
                        </h3>
                        <p className="text-muted-foreground">
                          Round-the-clock support to ensure your solutions run
                          smoothly
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Form */}
                <div className="bg-card border border-border-subtle rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Start Your Project
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-foreground mb-2 text-sm font-medium">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-foreground mb-2 text-sm font-medium">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-foreground mb-2 text-sm font-medium">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-foreground mb-2 text-sm font-medium">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-foreground mb-2 text-sm font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground mb-2 text-sm font-medium">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-foreground mb-2 text-sm font-medium">
                        Project Description
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your project requirements..."
                        className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg text-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      <Send className="w-5 h-5" />
                      Get in Touch
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Section>

      <Footer />
    </div>
  );
}
