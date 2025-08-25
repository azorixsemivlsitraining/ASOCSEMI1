import { useEffect, useRef, useState } from "react";
import {
  Code,
  Database,
  Globe,
  Smartphone,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

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

export default function ContentSections() {
  return (
    <div className="py-20 bg-background">
      {/* Services Section */}
      <Section>
        <section id="services" className="container mx-auto px-4 lg:px-8 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Leading the future of semiconductor design with cutting-edge VLSI solutions and advanced digital innovations that power the next generation of technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: "VLSI Design",
                description: "Advanced semiconductor design and verification solutions for next-gen chips",
                delay: "delay-0",
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "DFT Engineering",
                description: "Design for test methodologies ensuring reliable semiconductor manufacturing",
                delay: "delay-200",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "SoC Integration",
                description: "Complete system-on-chip design and integration services",
                delay: "delay-400",
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Digital Innovation",
                description: "Cutting-edge digital solutions powered by advanced semiconductor technology",
                delay: "delay-600",
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`card-hover bg-card border border-border-subtle rounded-lg p-6 text-center group ${service.delay}`}
              >
                <div className="text-tech-blue mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </Section>

      {/* Feature Grid Section */}
      <Section>
        <section className="container mx-auto px-4 lg:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Experience the Power of{" "}
                <span className="text-gradient">Technological Innovation</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We pioneer breakthrough semiconductor technologies that shape the future of digital innovation.
                From advanced VLSI designs to complex SoC solutions, we transform ideas into reality through
                precision engineering and cutting-edge methodologies that drive technological excellence.
              </p>
              <Link
                to="/services"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 group w-fit"
              >
                Learn More
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Visual Grid */}
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 max-w-md mx-auto lg:max-w-none">
              <div className="bg-card border border-border-subtle rounded-lg p-6 card-hover h-full flex flex-col">
                <BarChart3 className="w-8 h-8 text-tech-blue mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Performance
                </h4>
                <p className="text-muted-foreground text-sm flex-1">
                  High-performance semiconductor solutions with optimized power efficiency
                </p>
              </div>
              <div className="bg-card border border-border-subtle rounded-lg p-6 card-hover h-full flex flex-col">
                <Database className="w-8 h-8 text-coral mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Integration
                </h4>
                <p className="text-muted-foreground text-sm flex-1">
                  Seamless SoC and IP integration with advanced verification
                </p>
              </div>
              <div className="bg-card border border-border-subtle rounded-lg p-6 card-hover h-full flex flex-col">
                <Globe className="w-8 h-8 text-tech-blue mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Innovation
                </h4>
                <p className="text-muted-foreground text-sm flex-1">
                  Next-generation semiconductor technologies and design methodologies
                </p>
              </div>
              <div className="bg-card border border-border-subtle rounded-lg p-6 card-hover h-full flex flex-col">
                <Code className="w-8 h-8 text-coral mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Precision
                </h4>
                <p className="text-muted-foreground text-sm flex-1">
                  Expert VLSI design with uncompromising accuracy and quality
                </p>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Statistics Section */}
      <Section>
        <section className="container mx-auto px-4 lg:px-8 mb-32">
          <div className="bg-card border border-border-subtle rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Numbers That Matter
              </h2>
              <p className="text-lg text-muted-foreground">
                Our track record speaks for itself
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "4", label: "Years Experience", suffix: "+" },
                { number: "50+", label: "Team Members", suffix: "" },
                { number: "99", label: "Success Rate", suffix: "%" },
                { number: "24", label: "Support Hours", suffix: "/7" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-6xl font-bold text-gradient mb-2">
                    {stat.number}
                    <span className="text-2xl lg:text-4xl">{stat.suffix}</span>
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Section>

      {/* About Section */}
     
    </div>
  );
}
