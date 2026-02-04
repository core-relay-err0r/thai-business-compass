import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { BlogCard } from "@/components/blog/BlogCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function BlogIndex() {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <Layout>
      {/* SEO H1 */}
      <h1 className="sr-only">PND50 Knowledge Hub - Thai Accounting & Tax Guides for Foreign Businesses</h1>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Knowledge Hub
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Guides & Insights for{" "}
              <span className="text-primary">Foreign Businesses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert articles on Thai corporate tax, accounting compliance, and business operations. 
              Written for foreign founders and expats.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt || undefined}
                  targetKeyword={post.target_keyword || undefined}
                  publishedAt={post.published_at || undefined}
                  featuredImage={post.featured_image || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No articles published yet.</p>
              <p className="text-sm text-muted-foreground">Check back soon for expert guides on Thai accounting and tax compliance.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need Help with Your Thai Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our interactive tools help you understand exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button size="lg" className="min-h-[44px] w-full sm:w-auto">
                  See what applies to you
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
                  Get in touch
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
