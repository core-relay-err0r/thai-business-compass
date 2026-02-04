import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  targetKeyword?: string;
  publishedAt?: string;
  featuredImage?: string;
}

export function BlogCard({ slug, title, excerpt, targetKeyword, publishedAt, featuredImage }: BlogCardProps) {
  return (
    <Link to={`/blog/${slug}`} className="group">
      <Card className="h-full hover:shadow-lg transition-shadow border-border/50 overflow-hidden">
        {featuredImage && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={featuredImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="p-6">
          {targetKeyword && (
            <Badge variant="secondary" className="mb-3 text-xs">
              {targetKeyword}
            </Badge>
          )}
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            {publishedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(publishedAt), "MMM d, yyyy")}
              </span>
            )}
            <span className="text-sm text-primary flex items-center gap-1">
              Read more
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
