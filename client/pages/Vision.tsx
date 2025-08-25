import { useEffect, useState, useRef } from "react";
import { Target, Eye, Lightbulb, Users, Globe, Zap } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

export default function Vision() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setIsVisible(true);
  }, []);

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description:
        "Driving technological advancement through creative solutions and cutting-edge research.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description:
        "Working together with clients and partners to achieve shared goals and mutual success.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Impact",
      description:
        "Creating solutions that make a positive difference across industries and communities worldwide.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Excellence",
      description:
        "Delivering the highest quality in everything we do, from design to implementation.",
    },
  ];

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
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Our <span className="text-gradient">Mission</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Empowering the future through innovative semiconductor and
                technology solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-card border border-border-subtle rounded-2xl p-8 lg:p-12 mb-16">
                <div className="text-center mb-8">
                  <Target className="w-16 h-16 text-tech-blue mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  At ASOCSEMI, we specialize in developing integrated hardware
                  and software solutions that support the semiconductor, AI/ML,
                  and IoT industries across many domains such as consumer
                  durables, storage, automotive, wireless, and data center. Our
                  mission is to provide cutting-edge technological solutions
                  that drive innovation and empower businesses to achieve their
                  goals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Vision Section */}
      <Section>
        <section className="py-20 bg-card-bg">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                  <Eye className="w-16 h-16 text-coral mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Our Vision
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    To be the global leader in semiconductor and integrated
                    technology solutions, setting new standards for innovation,
                    quality, and reliability in every project we undertake.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-tech-blue rounded-full mt-2"></div>
                      <p className="text-muted-foreground">
                        Revolutionizing technology landscapes through
                        groundbreaking innovations
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-coral rounded-full mt-2"></div>
                      <p className="text-muted-foreground">
                        Delivering unmatched quality and reliability in every
                        solution
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-tech-blue rounded-full mt-2"></div>
                      <p className="text-muted-foreground">
                        Building lasting partnerships that drive mutual success
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Visual */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-tech-blue/20 to-coral/20 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-gradient mb-4">
                        2030
                      </div>
                      <p className="text-foreground font-semibold mb-2">
                        Vision Timeline
                      </p>
                      <p className="text-muted-foreground">
                        Leading the next decade of technological advancement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Our Story */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our <span className="text-gradient">Story</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  A journey of innovation and technological excellence
                </p>
              </div>

              <div className="bg-card border border-border-subtle rounded-2xl p-8 lg:p-12">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  ASOCSEMI was founded with the vision of revolutionizing the
                  technology and engineering landscape. Our journey began with a
                  passion for creating impactful solutions that redefine
                  industry standards. Today, we stand proud of our achievements,
                  having evolved into a leading provider of integrated
                  technology solutions.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are led by a team of experienced professionals who bring a
                  wealth of knowledge and expertise to the table. Our leadership
                  is committed to driving the company's mission, vision, and
                  values through strategic thinking, innovation, collaboration,
                  and customer satisfaction. Together, we strive to shape the
                  future of technology and engineering services, setting new
                  benchmarks for excellence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Values */}
      <Section>
        <section className="py-20 bg-card-bg">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our <span className="text-gradient">Values</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  The principles that guide everything we do
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border-subtle rounded-xl p-6 text-center card-hover group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-tech-blue mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Section>

      <Footer />
    </div>
  );
}
