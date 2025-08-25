import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Only log actual 404s, not external URL attempts
    if (
      location.pathname &&
      !location.pathname.includes("www.") &&
      !location.pathname.includes("http")
    ) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname,
      );
    }
  }, [location.pathname]);

  // Check if the path looks like an external URL
  const isExternalUrl =
    location.pathname?.includes("www.") || location.pathname?.includes("http");
  const isAzorixUrl = location.pathname?.includes("azorixvlsi.com");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {isExternalUrl ? "External Link Detected" : "Page Not Found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isExternalUrl
                ? `It looks like you're trying to access an external website (${location.pathname.replace("/", "")}). This appears to be a different website than ours.`
                : "Sorry, the page you're looking for doesn't exist or has been moved."}
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>

            {isAzorixUrl && (
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Looking for Azorix VLSI?</strong>
                <br />
                You might want to visit their website directly by typing the URL
                in your browser's address bar.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link to="/about">
                <Button variant="outline" className="w-full sm:w-auto">
                  About Us
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-card rounded-lg border border-border-subtle">
            <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/services"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                to="/careers"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Careers
              </Link>
              <Link
                to="/vision"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Vision
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
