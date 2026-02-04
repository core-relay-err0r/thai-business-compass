import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Knowledge Hub
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Estimate reading time (assuming 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Layout>
      {/* SEO H1 */}
      <h1 className="sr-only">{post.title}</h1>

      {/* Article Header */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Knowledge Hub
            </Link>

            {post.target_keyword && (
              <Badge variant="secondary" className="mb-4">
                {post.target_keyword}
              </Badge>
            )}

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {post.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image && (
        <section className="py-8">
          <div className="container px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-primary">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
      </section>

      {/* Related CTAs */}
      <section className="py-12 sm:py-16 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-6 text-center">Related Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/pnd50-tax-filing">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm">PND50 Tax Filing</h4>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/accounting-services-thailand">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm">Accounting Services</h4>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/accountant-for-foreigners-thailand">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm">For Foreigners</h4>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
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
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
