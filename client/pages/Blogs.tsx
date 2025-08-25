import { useState, useEffect } from "react";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { supabase } from "../lib/supabase";
import { formatErrorMessage } from "../lib/error";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  useEffect(() => {
    // Fetch blog posts from API
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/blogs?published=true");
      const result = await response.json();

      if (result.success) {
        setBlogPosts(result.data);
      } else {
        console.error("Error fetching blog posts:", result.error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog posts:", formatErrorMessage(error));
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: newsletterEmail }]);

      if (error) {
        // Log the full error object for debugging
        console.error("Supabase error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        if (
          error.message.includes("duplicate") ||
          error.message.includes("unique") ||
          error.code === "23505"
        ) {
          setSubscriptionMessage(
            "You are already subscribed to our newsletter!",
          );
        } else {
          throw error;
        }
      } else {
        setSubscriptionMessage(
          "Successfully subscribed! Thank you for joining our newsletter.",
        );
        setNewsletterEmail("");
      }
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again later.";
      let logMessage = "Unknown error";

      if (error instanceof Error) {
        logMessage = error.message;
        if (
          error.message.includes(
            'relation "public.newsletter_subscribers" does not exist',
          )
        ) {
          errorMessage =
            "Newsletter feature not yet set up. Please contact admin.";
        } else if (
          error.message.includes("permission denied") ||
          error.message.includes("RLS")
        ) {
          errorMessage =
            "Database permissions not configured. Please contact admin.";
        } else if (
          error.message.includes("duplicate") ||
          error.message.includes("unique")
        ) {
          errorMessage = "You are already subscribed to our newsletter!";
        } else {
          errorMessage = `Subscription failed: ${error.message}`;
        }
      } else if (typeof error === "object" && error !== null) {
        logMessage = JSON.stringify(error);
        if (error.code === "42P01") {
          errorMessage =
            "Newsletter feature not yet set up. Please contact admin.";
        } else if (error.code === "42501") {
          errorMessage =
            "Database permissions not configured. Please contact admin.";
        }
      } else {
        logMessage = formatErrorMessage(error);
      }

      console.error("Newsletter subscription error:", logMessage);
      setSubscriptionMessage(errorMessage);
    } finally {
      setIsSubscribing(false);
    }
  };

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-32">
          
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-blue"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background to-sage-light">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest insights, innovations, and trends in
              semiconductor technology and VLSI design.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Featured Post
            </h2>
            <Card className="overflow-hidden card-hover">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-tech-blue text-white">Featured</Badge>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link to={`/blog/${featuredPost.id}`}>
                    <Button className="group">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden card-hover group">
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-tech-blue transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="group">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-card-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to get the latest insights and updates
              from the world of semiconductor technology.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={isSubscribing}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue disabled:opacity-50"
              />
              <Button type="submit" className="px-8" disabled={isSubscribing}>
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {subscriptionMessage && (
              <p
                className={`mt-4 text-sm ${
                  subscriptionMessage.includes("Successfully") ||
                  subscriptionMessage.includes("already subscribed")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {subscriptionMessage}
              </p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
