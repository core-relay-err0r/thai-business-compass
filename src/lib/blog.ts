import type { Json, Tables } from "@/integrations/supabase/types";

export interface BlogSource {
  title: string;
  publisher: string;
  url: string;
  published_at?: string;
  accessed_at?: string;
}

export type BlogPost = Tables<"blog_posts">;

function isRecord(value: Json): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: Json | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function normalizeBlogSources(value: Json): BlogSource[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];

    const title = optionalString(entry.title);
    const publisher = optionalString(entry.publisher);
    const url = optionalString(entry.url);

    if (!title || !publisher || !url) return [];

    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") return [];
    } catch {
      return [];
    }

    return [{
      title,
      publisher,
      url,
      published_at: optionalString(entry.published_at),
      accessed_at: optionalString(entry.accessed_at),
    }];
  });
}

export function getArticleAuthor(post: BlogPost): {
  type: "Person" | "Organization";
  name: string;
  role?: string | null;
} {
  if (post.author_name) {
    return { type: "Person" as const, name: post.author_name, role: post.author_role };
  }

  return { type: "Organization" as const, name: "PND50 Editorial Team" };
}
