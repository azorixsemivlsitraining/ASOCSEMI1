import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/blogs/${postId}`);
      const result = await response.json();

      if (result.success) {
        setBlogPost(result.data);
      } else {
        setError(result.error || "Blog post not found");
      }
    } catch (error) {
      console.error("Error fetching blog post:", formatErrorMessage(error));
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like parsing for basic formatting
    const paragraphs = content.split("\n\n");

    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-3xl font-bold text-foreground mb-6 mt-8"
          >
            {paragraph.substring(2)}
          </h1>
        );
      } else if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-semibold text-foreground mb-4 mt-6"
          >
            {paragraph.substring(3)}
          </h2>
        );
      } else if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-foreground mb-3 mt-5"
          >
            {paragraph.substring(4)}
          </h3>
        );
      } else if (paragraph.startsWith("- ")) {
        const listItems = paragraph
          .split("\n")
          .filter((line) => line.startsWith("- "));
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="text-muted-foreground">
                {item.substring(2)}
              </li>
            ))}
          </ul>
        );
      } else if (paragraph.trim()) {
        return (
          <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
            {paragraph}
          </p>
        );
      }
      return null;
    });
  };

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

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {error || "Blog Post Not Found"}
            </h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been
              removed.
            </p>
            <Link to="/blogs">
              <Button className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Button>
            </Link>
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
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Featured badge */}
            {blogPost.featured && (
              <div className="mb-6">
                <Badge className="bg-tech-blue text-white">Featured Post</Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {blogPost.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(blogPost.publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            {blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blogPost.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {blogPost.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 p-6 bg-muted/50 rounded-lg border-l-4 border-tech-blue">
                {blogPost.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blogPost.image && (
        <section className="pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden">
                <img
                  src={blogPost.image}
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <div className="text-foreground">
                {renderContent(blogPost.content)}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact our team to learn more about our semiconductor design
              services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
              <Link to="/blogs">
                <Button variant="outline" size="lg">
                  Read More Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
