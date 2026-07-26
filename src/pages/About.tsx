import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import { InternalPageHeader, InternalSectionLabel } from "@/components/layout/InternalPageHeader";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema, OrganizationSchema } from "@/components/seo/StructuredData";
import teamAtWork from "@/assets/team-at-work.jpg";

const principles = [
  ["Clear communication", "Plain-English answers about your numbers, obligations, and next steps."],
  ["Proactive compliance", "Deadlines and regulatory requirements managed before they become problems."],
  ["Practical advice", "Recommendations grounded in the realities of operating a company in Thailand."],
];

export default function About() {
  return (
    <Layout>
      <SEOHead
        title="About PND50 | Bangkok Accounting Firm for Foreign Companies"
        description="PND50 is a Bangkok-based accounting firm helping foreign-owned businesses navigate Thai accounting, corporate tax, and compliance with an English-speaking team."
        path="/about"
        keywords="PND50 about, Bangkok accounting firm, English speaking accountant Thailand, accountant for foreigners Thailand, Thai accounting company"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://www.pnd50.com/" }, { name: "About", url: "https://www.pnd50.com/about" }]} />
      <OrganizationSchema />

      <InternalPageHeader
        eyebrow="About PND50"
        meta="Bangkok · Thailand"
        title={<>You do not need more paperwork.<br /><span className="text-primary">You need control.</span></>}
        description="We help foreign-owned businesses see what matters, meet Thai obligations, and make defensible decisions without hiding behind jargon or unnecessary complexity."
      />


      <section className="py-14 sm:py-20">
        <div className="container px-4 sm:px-6">
          <InternalSectionLabel index="01">Our role</InternalSectionLabel>
          <div className="grid gap-10 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <h2 className="max-w-xl text-balance font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Good accounting does not record confusion. It removes it.
            </h2>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {principles.map(([title, description], index) => (
                <article key={title} className="bg-background p-6 sm:p-7">
                  <p className="text-xs font-semibold text-primary">0{index + 1}</p>
                  <h3 className="mt-8 font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="container px-4 sm:px-6">
          <div className="grid lg:grid-cols-2">
            <div className="py-12 sm:py-16 lg:pr-14">
              <InternalSectionLabel index="02">How we work</InternalSectionLabel>
              <h2 className="mt-8 text-balance font-serif text-3xl font-medium tracking-tight sm:text-4xl">Senior attention where mistakes become expensive.</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                Your questions are handled by people who understand both Thai requirements and international business expectations. We combine human judgement with reliable systems so you always know where things stand.
              </p>
              <ul className="mt-8 grid gap-4">
                {["English-speaking specialists", "One accountable point of contact", "Transparent scope and next steps"].map((item) => (
                  <li key={item} className="flex items-center gap-3 border-t border-border pt-4 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border lg:border-l lg:border-t-0 lg:pl-14">
              <img src={teamAtWork} alt="PND50 accounting team meeting in Bangkok" className="h-full min-h-80 w-full object-cover" width="1200" height="900" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-8 border-y border-border py-9 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Next step</p>
              <h2 className="mt-3 text-balance font-serif text-3xl font-medium tracking-tight">Make Thai compliance simpler.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="https://calculator.pnd50.com"><Button size="lg" className="w-full sm:w-auto">Open cost calculator <ArrowRight className="ml-2 h-4 w-4" /></Button></a>
              <Link to="/contact"><Button variant="outline" size="lg" className="w-full sm:w-auto">Talk to our team</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
