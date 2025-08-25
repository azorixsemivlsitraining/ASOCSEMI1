import { useEffect, useState, useRef } from "react";
import {
  Award,
  Users,
  Lightbulb,
  Target,
  ChevronRight,
  ChevronLeft,
  RotateCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Company {
  name: string;
  logo: string;
  alt: string;
}

function CompaniesShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () => {
      try {
        setSelectedIndex(carouselApi.selectedScrollSnap());
      } catch {}
    };
    handleSelect();
    carouselApi.on("select", handleSelect);
    return () => {
      try {
        carouselApi.off("select", handleSelect);
      } catch {}
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      try {
        if (carouselApi.canScrollNext()) {
          carouselApi.scrollNext();
        } else {
          carouselApi.scrollTo(0);
        }
      } catch {}
    }, 1500);
    return () => clearInterval(id);
  }, [carouselApi]);

  const companies: Company[] = [
    {
      name: "CAPGEMINI",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2F2d35dd03a3f844f2ba426f2ad62e0a45?format=webp&width=800",
      alt: "Capgemini Logo",
    },
    {
      name: "HCL TECH",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2Fef9ffb8d7c444356935a1e6086b9f687?format=webp&width=800",
      alt: "HCL Technologies Logo",
    },
    {
      name: "TRUECHIP",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2Fd86fec28aed74d9487c8f3fedfb5583c?format=webp&width=800",
      alt: "TrueChip Logo",
    },
    {
      name: "AEVA",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2F6c35a40cb5734f22987ae85316e89e8a?format=webp&width=800",
      alt: "Aeva Logo",
    },
    {
      name: "SMARTSOC",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2F118af7902fdc4533a8fa22f1be9f1c84?format=webp&width=800",
      alt: "SmartSoc Logo",
    },
    
    
    {
      name: "ANALOG DEVICES",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2F04f39ce5525a452fa3da09ebe38378b2?format=webp&width=800",
      alt: "Analog Devices Logo",
    },
    
    {
      name: "L&T",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2F924c0adb9e904533919e88dee2dafc42?format=webp&width=800",
      alt: "L&T Logo",
    },
    {
      name: "AXIADO",
      logo: "https://cdn.builder.io/api/v1/image/assets%2F07ba826074254d3191a55ee32e800a58%2F6878d40817ef4be1ab94e11684555747?format=webp&width=800",
      alt: "Axiado Logo",
    },
  ];

  return (
    <Section>
      <section className="py-20 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card-bg to-background opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_hsla(var(--primary),0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsla(var(--accent),0.05)_0%,_transparent_50%)]"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 animate-fade-in-up">
              Companies We Work With
            </h2>
            <p
              className="text-lg text-black leading-relaxed mb-16 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Our graduates work at leading technology companies and our
              training programs are trusted by industry leaders worldwide.
            </p>

            {/* Companies Carousel with one-by-one motion */}
            <div className="relative">
              <Carousel
                opts={{ align: "start", loop: true, slidesToScroll: 1 }}
                setApi={(api) => setCarouselApi(api)}
                className="animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <CarouselContent>
                  {companies.map((company, index) => (
                    <CarouselItem
                      key={company.name}
                      className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className={`group flex flex-col items-center justify-center p-6 rounded-xl border border-border-subtle bg-card/60 hover:bg-card transition-colors duration-200 overflow-hidden`}>
                        <div className="h-28 md:h-32 lg:h-36 w-full max-w-[220px] mx-auto flex items-center justify-center">
                          <img
                            src={company.logo}
                            alt={company.alt}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p
                          className={`mt-3 text-sm md:text-base font-semibold text-center ${
                            selectedIndex === index ? "text-primary" : "text-black"
                          }`}
                        >
                          {company.name}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {/* Dots navigation tied to carousel */}
              <div className="flex justify-center space-x-3 mt-6">
                {companies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? "bg-primary scale-125"
                        : "bg-primary/30 hover:bg-primary/60"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Section>
  );
}

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

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setIsVisible(true);
  }, []);

  const expertise = [
    {
      title: "EXPERTISE",
      description:
        "Our team consists of experienced software developers and designers who have worked on a variety of projects. We have expertise in a range of technologies and tools, including cloud computing, machine learning, and blockchain technology.",
    },
    {
      title: "QUALITY",
      description:
        "We are committed to delivering high-quality software solutions to our clients. Our team follows best practices in software development and testing to ensure that our clients receive a reliable and bug-free product.",
    },
  ];

  const achievements = [
    {
      number: "500+",
      label: "Projects Completed",
      icon: <Target className="w-8 h-8" />,
    },
    {
      number: "50+",
      label: "Happy Clients",
      icon: <Users className="w-8 h-8" />,
    },
    {
      number: "15+",
      label: "Years Experience",
      icon: <Award className="w-8 h-8" />,
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Lightbulb className="w-8 h-8" />,
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
                About <span className="text-gradient">Us</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Finding Inspiration in Every Turn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                ASOCSEMI was founded in 2021 by a group of VLSI DV Engineers &
                software developers with a passion for creating innovative
                solutions. Over the years, we have grown into a leading
                VLSI-SOC&IP service providers and software development company,
                serving clients in a wide range of industries.
              </p>
            </div>
          </div>
        </section>
      </Section>

      {/* Expertise & Quality */}
      <Section>
        <section className="py-20 bg-card-bg">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {expertise.map((item, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border-subtle rounded-xl p-8"
                  >
                    <h2 className="text-2xl font-bold text-gradient mb-6 text-center">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Statistics */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our <span className="text-gradient">Achievements</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Numbers that reflect our commitment to excellence
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border-subtle rounded-xl p-6 text-center card-hover group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-tech-blue mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {achievement.icon}
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Companies We Work With - 3D Microinteractions */}
      <CompaniesShowcase />

      {/* Training Section */}
      <Section>
        <section className="py-20 bg-card-bg">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Training the <span className="text-gradient">Best</span>
              </h2>

              <div className="bg-card border border-border-subtle rounded-xl p-8 mb-8">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Training candidates on domains like VLSI, AI, and supporting
                  hardware and software is a strategic investment for any
                  technology-focused organization. It equips the workforce with
                  specialized skills, enabling them to work on complex projects
                  and remain at the forefront of innovation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Providing in-house training offers several benefits, including
                  customization to fit company-specific needs and fostering a
                  culture of continuous learning. It also allows for
                  cross-functional collaboration, encouraging employees to share
                  knowledge across teams.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Keeping trained candidates "on the bench" — ready to be
                  deployed when needed — ensures flexibility in resource
                  management. This approach can reduce project downtime and
                  provide a pool of skilled talent for new or unexpected
                  projects, ultimately contributing to a more agile and
                  adaptable organization.
                </p>
              </div>

              <Link
                to="https://www.azorixvlsi.com/"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group mx-auto"
              >
                Learn About Our Training Programs
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </Section>

      <Footer />
    </div>
  );
}
