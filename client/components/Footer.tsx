import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Safely get auth context with fallback
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.warn("Auth context not available in Footer:", error);
  }

  const companyLinks = [
    { name: "About Us", href: "/about" },

    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "#" },
    { name: "Contact Support", href: "/contact" },
    { name: "System", href: "/admin-dashboard" },
  ];

  const footerSections = [
    {
      title: "Company",
      links: companyLinks,
    },

    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Cookie Policy", href: "/cookie-policy" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/company/anantha-software/",
      label: "LinkedIn",
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com/wix",
      label: "Facebook",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://x.com/wix",
      label: "Twitter",
    },
  ];

  return (
    <footer id="contact" className="bg-card-bg border-t border-border-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Fe656648968d84393a26405208e9b2be2?format=webp&width=2000"
                  alt="ASCOSEMI Logo"
                  className="h-20 sm:h-24 lg:h-28 w-auto"
                />
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Leading provider of integrated technology solutions for
                semiconductor and engineering industries. Driving innovation
                through advanced technical expertise.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-tech-blue" />
                  <span>contact@asocsemi.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-tech-blue" />
                  <span> +91 40-71553446</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-[29px] text-tech-blue" />
                  <span>
                    ANANTHA SOFTWARE SOLUTIONS Pvt. Ltd., WeWork Rajapushpa
                    Summit Rajapushpa Summit, Financial District, Hyderabad,
                    Telangana 500032.
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-card border border-border-subtle rounded-lg flex items-center justify-center text-muted-foreground hover:text-tech-blue hover:border-tech-blue transition-all duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {footerSections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-foreground font-semibold mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.href.startsWith("/") ? (
                          <Link
                            to={link.href}
                            className="text-muted-foreground hover:text-tech-blue transition-colors duration-200"
                          >
                            {link.name}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className="text-muted-foreground hover:text-tech-blue transition-colors duration-200"
                          >
                            {link.name}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border-subtle py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © {currentYear} ASOCSEMI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
