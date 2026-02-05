import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/seo/SEOHead";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, target_keyword")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <SEOHead
        title="Blog | Thai Accounting & Tax Insights | PND50"
        description="Expert insights on Thai accounting, corporate tax filing, PND50 compliance, and business advisory for foreign companies operating in Thailand."
        path="/blog"
        keywords="Thailand accounting blog, PND50 tax filing guide, Thai corporate tax, foreign business Thailand, accounting tips Thailand"
      />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1.5" />
              Insights
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Thai Accounting & Tax Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert guidance on corporate tax filing, compliance, and business operations 
              for foreign companies in Thailand.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow group overflow-hidden">
                    <CardContent className="p-0">
                      {post.featured_image ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="p-5 sm:p-6">
                        {post.target_keyword && (
                          <Badge variant="outline" className="mb-3 text-xs">
                            {post.target_keyword}
                          </Badge>
                        )}
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {post.published_at && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(post.published_at), "MMM d, yyyy")}
                            </div>
                          )}
                          <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                            Read more
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground">
                Check back soon for insights on Thai accounting and tax compliance.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need help with your Thai taxes?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our English-speaking team is ready to help you navigate Thai accounting and compliance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                See what applies to you
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
