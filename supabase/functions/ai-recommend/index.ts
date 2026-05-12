import { generateText, Output } from "npm:ai";
import { z } from "npm:zod";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const InputSchema = z.object({
  businessStage: z.enum(["new", "existing", "planning"]),
  foreignOwned: z.enum(["yes", "no", "partial"]),
  revenueRange: z.enum(["0-5k", "5k-50k", "50k-100k", "100k-1m", "1m+"]),
  employeeCount: z.number().int().min(0).max(500),
  vatRegistered: z.enum(["yes", "no", "not-sure"]),
  goal: z.string().trim().min(3).max(800),
});

const CORPORATE_CATALOG = [
  { id: "incorporation", name: "Company Incorporation", price: 2000, when: "Setting up a new Thai Co., Ltd." },
  { id: "registered-office", name: "Registered Office", price: 2000, when: "Required to register/operate; per year." },
  { id: "company-review", name: "Company Review / Cleanup", price: 1000, when: "Existing company needs status review." },
  { id: "structural-change", name: "Structural Change", price: 800, when: "Changing directors, shareholders, ownership." },
  { id: "corporate-documents", name: "Corporate Documents", price: 300, when: "Need official documents for banks/authorities." },
  { id: "tax-residency", name: "Tax Residency Certificate", price: 400, when: "Need certificate for treaty benefits." },
];

const CONSULTING_CATALOG = [
  { id: "reduce-costs", name: "Reduce Costs", price: 2000, isFrom: true, timeline: "5–10 working days" },
  { id: "new-market", name: "Enter a New Market", price: 5000, isFrom: false, timeline: "7–14 working days" },
  { id: "due-diligence", name: "Due Diligence / Risk Check", price: 2000, isFrom: true, timeline: "5–30 working days" },
  { id: "structure-strategy", name: "Business Structure Strategy", price: 3000, isFrom: false, timeline: "3–7 working days" },
  { id: "bank-compliance", name: "Bank & Compliance Readiness", price: 500, isFrom: false, timeline: "1 working day" },
];

const RecommendationSchema = z.object({
  summary: z.string().min(10).max(800),
  corporateServiceIds: z.array(z.string()),
  accountingInputs: z.object({
    accountingIntent: z.enum(["full", "year-end-only"]).optional(),
    revenueRange: z.enum(["0-5k", "5k-50k", "50k-100k", "100k-1m", "1m+"]).optional(),
    vatRegistered: z.enum(["yes", "no", "not-sure"]).optional(),
    employeeCount: z.number().int().min(0).max(500).optional(),
    payrollNeeded: z.boolean().optional(),
    transactionVolume: z.enum(["low", "medium", "high"]).optional(),
    recurringWHT: z.enum(["yes", "no", "not-sure"]).optional(),
    yearEndStatements: z.enum(["yes", "no", "not-sure"]).optional(),
    auditRequired: z.enum(["yes", "no", "not-sure"]).optional(),
  }).nullable(),
  consultingServiceIds: z.array(z.string()),
  notes: z.array(z.string()).max(6),
  confidence: z.enum(["high", "medium", "low"]),
});

const SYSTEM_PROMPT = `You are PND50's friendly Thailand corporate-services advisor.
PND50 helps foreign-owned businesses in Thailand with corporate setup, accounting, tax, payroll, and consulting.

Your job: based on the user's situation, recommend which services from PND50's catalog fit, and suggest sensible defaults for the accounting calculator. Keep tone simple, non-salesy, and practical. Never quote final prices, never give legal advice. When unsure, surface it as a note suggesting the user "Get in touch" with PND50.

CATALOG — Corporate (one-time):
${CORPORATE_CATALOG.map(s => `- ${s.id}: ${s.name} — ${s.when}`).join("\n")}

CATALOG — Consulting:
${CONSULTING_CATALOG.map(s => `- ${s.id}: ${s.name} (${s.timeline})`).join("\n")}

ACCOUNTING INPUTS guidance:
- accountingIntent: "full" for operating companies; "year-end-only" only when there is no real activity.
- payrollNeeded: true if employeeCount > 0 and they actually run payroll (not just visa-only).
- vatRegistered: VAT registration is mandatory in Thailand if revenue > ~฿1.8M/year (~$50K). For "50k-100k", "100k-1m", "1m+" suggest "yes". For "5k-50k" suggest "not-sure" unless user is clearly small. For "0-5k" "no" unless user states they registered.
- transactionVolume: "low" (<50/mo), "medium" (50–200/mo), "high" (>200/mo, custom quote).
- yearEndStatements: "yes" for any active Thai company.
- auditRequired: Thai companies generally require an annual audit. Default "yes".
- recurringWHT: "yes" if they pay rent, professional fees, or salaries regularly; otherwise "not-sure".

Rules:
- Only return service IDs from the catalogs above. Do not invent IDs.
- For new companies (businessStage = "new" or "planning"): include "incorporation" and "registered-office".
- For existing companies, recommend "company-review" only if their goal mentions cleanup/restructuring/uncertainty.
- Keep notes brief (max 6), each one actionable.
- summary is 2–3 plain-English sentences explaining their situation and what's recommended. No marketing fluff.
- confidence: "high" if catalog clearly fits, "medium" if some assumptions, "low" if user goal is unclear or out-of-scope.`;

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

const RATE: Map<string, { count: number; resetAt: number }> = (globalThis as any).__aiRecRate ??= new Map();
const RATE_MAX = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRate(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || entry.resetAt < now) {
    RATE.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = getClientIp(req);
  const rate = checkRate(ip);
  if (!rate.ok) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(rate.retryAfter ?? 60) },
    });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "AI service is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userPrompt = `User situation:
- Business stage: ${parsed.data.businessStage}
- Foreign-owned: ${parsed.data.foreignOwned}
- Monthly revenue range (USD): ${parsed.data.revenueRange}
- Employees: ${parsed.data.employeeCount}
- VAT registered: ${parsed.data.vatRegistered}
- Goal: ${parsed.data.goal}

Return your recommendation following the schema.`;

  try {
    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const { experimental_output: output } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      experimental_output: Output.object({ schema: RecommendationSchema }),
    });

    // Map IDs to full service objects
    const corporateServices = output.corporateServiceIds
      .map((id) => CORPORATE_CATALOG.find((s) => s.id === id))
      .filter((s): s is typeof CORPORATE_CATALOG[number] => !!s)
      .map((s) => ({ id: s.id, name: s.name, price: s.price }));

    const consultingServices = output.consultingServiceIds
      .map((id) => CONSULTING_CATALOG.find((s) => s.id === id))
      .filter((s): s is typeof CONSULTING_CATALOG[number] => !!s)
      .map((s) => ({ id: s.id, name: s.name, price: s.price, isFrom: s.isFrom, timeline: s.timeline }));

    return new Response(
      JSON.stringify({
        summary: output.summary,
        corporateServices,
        consultingServices,
        accountingInputs: output.accountingInputs,
        notes: output.notes,
        confidence: output.confidence,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const lower = msg.toLowerCase();
    if (lower.includes("429") || lower.includes("rate")) {
      return new Response(JSON.stringify({ error: "AI is busy right now. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (lower.includes("402") || lower.includes("credit")) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please get in touch with us directly." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.error("ai-recommend error:", msg);
    return new Response(JSON.stringify({ error: "AI request failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});