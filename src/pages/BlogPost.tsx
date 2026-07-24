import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, ArrowRight, BookOpen, Clock, ExternalLink, ShieldCheck, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/StructuredData";
import { format } from "date-fns";
import { useEffect } from "react";
import { getArticleAuthor, normalizeBlogSources } from "@/lib/blog";

const SITE_URL = "https://pnd50.com";

function toAbsoluteUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Parse inline markdown (bold, italic)
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Match **bold** first (before *italic*)
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Match *italic* (single asterisk)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    if (boldMatch && (!italicMatch || boldMatch.index! <= italicMatch.index!)) {
      // Add text before the bold
      if (boldMatch.index! > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      // Add bold text
      parts.push(<strong key={keyIndex++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
    } else if (italicMatch) {
      // Add text before the italic
      if (italicMatch.index! > 0) {
        parts.push(remaining.slice(0, italicMatch.index));
      }
      // Add italic text
      parts.push(<em key={keyIndex++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch.index! + italicMatch[0].length);
    } else {
      // No more matches, add remaining text
      parts.push(remaining);
      break;
    }
  }

  return parts;
}

// Simple markdown-like content renderer
function renderContent(content: string) {
  // Split by double newlines for paragraphs
  const blocks = content.split(/\n\n+/);
  
  return blocks.map((block, index) => {
    // Check if it's a heading (starts with multiple #)
    if (block.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold mt-8 mb-4">
          {parseInlineMarkdown(block.replace("### ", ""))}
        </h3>
      );
    }
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-bold mt-10 mb-4">
          {parseInlineMarkdown(block.replace("## ", ""))}
        </h2>
      );
    }
    if (block.startsWith("# ")) {
      return (
        <h1 key={index} className="text-3xl font-bold mt-10 mb-4">
          {parseInlineMarkdown(block.replace("# ", ""))}
        </h1>
      );
    }
    
    // Split block into lines and render mixed content (text + lists)
    const lines = block.split("\n");
    const hasUnorderedItems = lines.some(line => line.trim().startsWith("- "));
    const hasOrderedItems = lines.some(line => /^\d+\.\s/.test(line.trim()));

    if (hasUnorderedItems || hasOrderedItems) {
      // Render mixed block: group consecutive list items, render text lines as paragraphs
      const elements: React.ReactNode[] = [];
      let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
      let subKey = 0;

      const flushList = () => {
        if (currentList) {
          const ListTag = currentList.type === "ul" ? "ul" : "ol";
          const listClass = currentList.type === "ul"
            ? "list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4 pl-2"
            : "list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed mb-4 pl-2";
          elements.push(
            <ListTag key={subKey++} className={listClass}>
              {currentList.items.map((item, i) => (
                <li key={i}>{parseInlineMarkdown(item)}</li>
              ))}
            </ListTag>
          );
          currentList = null;
        }
      };

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === "") {
          continue;
        } else if (trimmed.startsWith("- ")) {
          if (currentList && currentList.type !== "ul") flushList();
          if (!currentList) currentList = { type: "ul", items: [] };
          currentList.items.push(trimmed.slice(2));
        } else if (/^\d+\.\s/.test(trimmed)) {
          if (currentList && currentList.type !== "ol") flushList();
          if (!currentList) currentList = { type: "ol", items: [] };
          currentList.items.push(trimmed.replace(/^\d+\.\s/, ""));
        } else {
          flushList();
          elements.push(
            <p key={subKey++} className="text-muted-foreground leading-relaxed mb-2">
              {parseInlineMarkdown(trimmed)}
            </p>
          );
        }
      }
      flushList();

      return <div key={index} className="mb-4">{elements}</div>;
    }

    // Regular paragraph
    return (
      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
        {parseInlineMarkdown(block)}
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
  const sources = normalizeBlogSources(post.sources);
  const author = getArticleAuthor(post);
  const modifiedDate = post.reviewed_at || post.updated_at;

  return (
    <Layout>
      <SEOHead
        title={post.title}
        description={post.meta_description || post.excerpt || `Read about ${post.title} - PND50 Thailand accounting insights`}
        path={`/blog/${post.slug}`}
        keywords={post.target_keyword || undefined}
        ogImage={toAbsoluteUrl(post.featured_image)}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://pnd50.com/" },
          { name: "Blog", url: "https://pnd50.com/blog" },
          { name: post.title, url: `https://pnd50.com/blog/${post.slug}` },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={post.meta_description || post.excerpt || `Read about ${post.title}`}
        url={`https://pnd50.com/blog/${post.slug}`}
        image={toAbsoluteUrl(post.featured_image)}
        datePublished={post.published_at || post.created_at}
        dateModified={modifiedDate}
        author={author}
        reviewer={post.reviewer_name ? { name: post.reviewer_name, role: post.reviewer_role } : undefined}
        citations={sources.map((source) => source.url)}
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
                    Published {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-l-2 border-primary pl-4 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
                <div className="flex items-start gap-2">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p>
                    <span className="text-muted-foreground">Written by </span>
                    <span className="font-medium text-foreground">{author.name}</span>
                    {author.role && <span className="text-muted-foreground"> · {author.role}</span>}
                  </p>
                </div>
                {post.reviewer_name && (
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <p>
                      <span className="text-muted-foreground">Reviewed by </span>
                      <span className="font-medium text-foreground">{post.reviewer_name}</span>
                      {post.reviewer_role && <span className="text-muted-foreground"> · {post.reviewer_role}</span>}
                      {post.reviewed_at && (
                        <span className="text-muted-foreground"> · {format(new Date(post.reviewed_at), "MMMM d, yyyy")}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="container px-4 sm:px-6 pt-8 sm:pt-12 pb-4 sm:pb-6">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                <img
                  src={post.featured_image}
                  alt={`${post.title} - Thai accounting and tax guide by PND50`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {post.key_takeaway && (
          <aside className="container px-4 pt-8 sm:px-6 sm:pt-12" aria-labelledby="key-takeaway-heading">
            <div className="mx-auto max-w-3xl border border-border bg-muted/30 p-5 sm:p-6">
              <p id="key-takeaway-heading" className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Key takeaway
              </p>
              <p className="text-base leading-relaxed text-foreground sm:text-lg">{post.key_takeaway}</p>
            </div>
          </aside>
        )}

        {/* Article Content */}
        <div className="py-8 sm:py-12">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto prose prose-lg">
              {renderContent(post.content)}
            </div>
          </div>
        </div>

        {sources.length > 0 && (
          <section className="border-t border-border py-10 sm:py-12" aria-labelledby="article-sources-heading">
            <div className="container px-4 sm:px-6">
              <div className="mx-auto max-w-3xl">
                <div className="mb-5 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 id="article-sources-heading" className="text-xl font-semibold sm:text-2xl">Sources</h2>
                </div>
                <ol className="flex flex-col gap-3">
                  {sources.map((source, index) => (
                    <li key={`${source.url}-${index}`} className="border-l-2 border-border pl-4 text-sm leading-relaxed">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                      >
                        <span>{source.title}</span>
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                      <p className="mt-1 text-muted-foreground">
                        {source.publisher}
                        {source.published_at && ` · Published ${source.published_at}`}
                        {source.accessed_at && ` · Accessed ${source.accessed_at}`}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

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
