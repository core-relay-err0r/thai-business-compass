import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { format } from "date-fns";
import { useEffect } from "react";

// Simple markdown-like content renderer
function renderContent(content: string) {
  // Split by double newlines for paragraphs
  const blocks = content.split(/\n\n+/);
  
  return blocks.map((block, index) => {
    // Check if it's a heading (starts with multiple #)
    if (block.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold mt-8 mb-4">
          {block.replace("### ", "")}
        </h3>
      );
    }
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-bold mt-10 mb-4">
          {block.replace("## ", "")}
        </h2>
      );
    }
    if (block.startsWith("# ")) {
      return (
        <h1 key={index} className="text-3xl font-bold mt-10 mb-4">
          {block.replace("# ", "")}
        </h1>
      );
    }
    
    // Regular paragraph
    return (
      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
        {block}
      </p>
    );
  });
}

// Estimate reading time
function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Redirect to 404 if post not found
  useEffect(() => {
    if (error) {
      navigate("/not-found", { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 sm:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-4 w-32 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return null;
  }

  const readingTime = getReadingTime(post.content);

  return (
    <Layout>
      <SEOHead
        title={post.title}
        description={post.meta_description || post.excerpt || `Read about ${post.title} - PND50 Thailand accounting insights`}
        path={`/blog/${post.slug}`}
        keywords={post.target_keyword || undefined}
        ogImage={post.featured_image || undefined}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://pnd50.com/" },
          { name: "Blog", url: "https://pnd50.com/blog" },
          { name: post.title, url: `https://pnd50.com/blog/${post.slug}` },
        ]}
      />

      {/* Article Header */}
      <article>
        <header className="py-12 sm:py-16 md:py-20 border-b border-border bg-muted/20">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              {/* Back link */}
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Category/Keyword */}
              {post.target_keyword && (
                <Badge variant="secondary" className="mb-4">
                  {post.target_keyword}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.published_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="container px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="py-8 sm:py-12">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto prose prose-lg">
              {renderContent(post.content)}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <footer className="py-12 sm:py-16 bg-muted/30 border-t border-border">
          <div className="container px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Need help with your Thai taxes?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our English-speaking team specializes in helping foreign businesses navigate Thai accounting and compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/services">
                  <Button size="lg" className="min-h-[44px] w-full sm:w-auto">
                    View Our Services
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </Layout>
  );
}
