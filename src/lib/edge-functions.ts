// Supabase Edge Functions live on the project defined in supabase/config.toml
// (vrvwketvspgatfdqmrha), while the database/content project may differ.
// supabase-js derives the functions URL from the database project URL, which
// broke every form in production. This helper always targets the functions host.

const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
  "https://vrvwketvspgatfdqmrha.supabase.co";

export type EdgeFunctionResult<T> = { data: T | null; error: Error | null };

export async function invokeEdgeFunction<T = unknown>(
  name: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<EdgeFunctionResult<T>> {
  const { method = "POST", body } = options;
  try {
    const localRoutes: Record<string, string> = {
      "send-contact": "/api/contact",
      "send-feedback-email": "/api/feedback",
    };
    const endpoint = localRoutes[name] || `${FUNCTIONS_BASE_URL}/functions/v1/${name}`;
    const res = await fetch(endpoint, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data: T | null = null;
    try {
      data = text ? (JSON.parse(text) as T) : null;
    } catch {
      data = null;
    }
    if (!res.ok) {
      const message =
        (data as { error?: string } | null)?.error || `Request failed (${res.status})`;
      return { data: null, error: new Error(message) };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Network error") };
  }
}
