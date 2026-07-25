import { applyInternalLinks } from "./article-internal-links.mjs";

// GEO/SEO editorial cluster: Thai company setup and corporate bank-account readiness.
//
// This file is the reproducible source of truth for the six published articles.
// It is consumed by scripts/seed-geo-articles.mjs to upsert rows into the
// Supabase `blog_posts` table (on conflict (slug) do update).
//
// Editorial standards applied:
// - Answer-first introductions and descriptive question-style H2/H3 headings.
// - Every changeable claim is tied to a primary/authoritative source in `sources`.
// - Upcoming/future-dated rules are described explicitly as upcoming, never as
//   already universally effective.
// - No guaranteed outcomes, no invented credentials; author/reviewer fields are
//   intentionally left null until the user supplies verified public names.

const REVIEW_DATE = "2026-07-25";
const PUBLISH_BASE = "2026-07-25T09:00:00.000Z";

/** Shared authoritative sources, referenced per-article. */
const S = {
  fba: {
    title: "Foreign Business Act B.E. 2542 (1999) overview",
    publisher: "Thailand Board of Investment (BOI)",
    url: "https://www.boi.go.th/index.php?page=business_setup",
    accessed_at: REVIEW_DATE,
  },
  dbd: {
    title: "Business registration and DBD services",
    publisher: "Department of Business Development (DBD), Ministry of Commerce",
    url: "https://www.dbd.go.th/en",
    accessed_at: REVIEW_DATE,
  },
  boiGuide: {
    title: "A Guide to the Board of Investment / Doing Business in Thailand",
    publisher: "Thailand Board of Investment (BOI)",
    url: "https://www.boi.go.th/index.php?page=guides",
    accessed_at: REVIEW_DATE,
  },
  amloCdd: {
    title: "Ministerial Regulation on Customer Due Diligence B.E. 2563 (2020)",
    publisher: "Anti-Money Laundering Office (AMLO)",
    url: "https://www.amlo.go.th/index.php/en/",
    accessed_at: REVIEW_DATE,
  },
  bot: {
    title: "Financial institutions and consumer information",
    publisher: "Bank of Thailand (BOT)",
    url: "https://www.bot.or.th/en/home.html",
    accessed_at: REVIEW_DATE,
  },
  rd: {
    title: "VAT registration and corporate tax obligations",
    publisher: "The Revenue Department of Thailand",
    url: "https://www.rd.go.th/english/",
    accessed_at: REVIEW_DATE,
  },
};

const GEO_ARTICLE_SOURCE = [
  // 1 ---------------------------------------------------------------------------
  {
    slug: "corporate-bank-account-thailand-foreign-founders-2026",
    title:
      "Opening a Corporate Bank Account in Thailand: What Foreign Founders Need in 2026",
    target_keyword: "corporate bank account thailand foreign company",
    excerpt:
      "A practical, source-based guide to preparing a Thai corporate bank account application as a foreign founder: documents, sequence, in-person attendance, and what the bank ultimately decides.",
    meta_description:
      "Open a Thai corporate bank account in 2026: documents, KYC and UBO checks, in-person attendance, preparation steps, and approval boundaries.",
    key_takeaway:
      "You can fully prepare a Thai corporate bank account application in advance, but the account is opened and approved by the bank at its own discretion after in-person verification. Preparation reduces delays; it does not guarantee approval.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime()).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.dbd, S.amloCdd, S.bot, S.fba],
    content: `A corporate bank account in Thailand is opened directly by the bank, not by any advisor or agent. What you can control is readiness: complete, consistent, recent documents and a clear business story. That is the difference between "bank & compliance readiness" support and the bank's own onboarding decision.

## What is the difference between bank-readiness support and opening the account?
Bank-readiness support means preparing your documents, ownership chart, and business explanation so the application meets the bank's known requirements. Opening the account is a separate step: the bank runs its own Know Your Customer (KYC) and beneficial-owner checks, may ask follow-up questions, and approves or declines at its discretion. No advisor can guarantee approval, and any promise of a guaranteed account should be treated as a red flag.

## Do you need the company registered first?
In almost all cases, yes. Thai banks open a corporate account for a legal entity that already exists, so you generally need the company incorporated and its registration documents issued before applying. Preparation work (ownership chart, business plan, expected activity) can be done in parallel, but the application itself follows incorporation.

## Which documents do Thai banks typically require?
Requirements vary by bank and branch, so always confirm with the specific bank. A typical corporate account request includes:

- Company registration certificate / affidavit, usually issued recently (banks commonly ask for documents issued within roughly the last 1–6 months).
- Memorandum of Association and Articles of Association.
- Shareholder list (for example, the BorOrJor.5 / list of shareholders).
- Minutes of a board meeting authorizing the account opening and naming the authorized signatories.
- Identification for directors and authorized signatories (Thai ID, or passport and, where applicable, work permit for foreigners).
- Company seal, if your company registered one.
- For companies incorporated abroad, documents typically must be notarized and legalized by a Royal Thai Embassy or Consulate.

## What do banks check beyond the paperwork?
Under Thailand's customer due diligence rules, banks must identify the ultimate beneficial owner (UBO) — broadly, the natural person who ultimately owns or controls the company. In practice banks look at the ownership structure, who controls the company, the nature of the business, expected transaction activity, and the source of funds. Being able to explain your business clearly and consistently matters as much as the documents.

## Is in-person attendance required?
Frequently, yes. Many Thai banks require authorized directors or signatories to attend a branch in person to open a corporate account and complete verification. Remote-only opening is often not available. Confirm the attendance requirement with your chosen bank before scheduling travel.

## What most often causes delays?
- Documents that are out of date by the bank's standard.
- Ownership information that does not match across registration, tax, and bank forms.
- An unclear business purpose or vague description of expected activity.
- Missing board authority or the wrong signatories present.
- Enhanced due diligence for higher-risk profiles, which can extend timelines.

## How should foreign founders prepare?
Sequence the work: incorporate the company, assemble corporate records, prepare a clean ownership chart and a plain-language business description, confirm the specific bank's current document list and attendance rules, then apply. Keep every document consistent with your registration and tax records.

This article is general information for planning, not legal, tax, immigration, or banking advice, and it is not a determination of eligibility. Bank requirements change and are applied case by case. Confirm the current requirements with your chosen bank and qualified professionals.`,
  },

  // 2 ---------------------------------------------------------------------------
  {
    slug: "thailand-company-registration-foreign-founders-checklist-2026",
    title:
      "Thailand Company Registration for Foreign Founders: A Practical 2026 Checklist",
    target_keyword: "thailand company registration foreign founders",
    excerpt:
      "Entity choice, ownership questions, registered office, capital evidence, the registration sequence, and the obligations that begin the day your Thai company exists.",
    meta_description:
      "Register a company in Thailand in 2026: entity choice, foreign ownership limits, registered office, capital evidence, and post-registration duties.",
    key_takeaway:
      "Most foreign founders register a Thai private limited company through the DBD. The two decisions that shape everything else are your ownership structure and whether your activity is restricted under the Foreign Business Act.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 60000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.dbd, S.fba, S.boiGuide, S.rd],
    content: `Foreign founders most commonly set up a Thai private limited company, registered with the Department of Business Development (DBD). Before you file, settle two questions: how the company will be owned, and whether your business activity is restricted for foreigners under the Foreign Business Act (FBA). Everything else follows from those answers.

## Which entity type should a foreign founder choose?
The private limited company (Co., Ltd.) is the usual choice for operating businesses. Branch offices, representative offices, and BOI-promoted companies exist for specific situations. Choose the structure that matches how you will actually operate, hire, and invoice — not just the fastest one to register.

## How does foreign ownership work?
Under the FBA, a company is generally treated as "foreign" when 50% or more of its shares are held by non-Thai nationals, and foreign participation in many activities is capped at 49%. Routes to higher or full foreign ownership include BOI promotion (a Foreign Business Certificate in eligible activities), a Foreign Business License for certain restricted activities, and the US–Thailand Treaty of Amity for qualifying US investors. Using nominee shareholders to disguise foreign control is illegal and carries serious penalties — it is never a shortcut.

## What is the typical registration sequence?
1. Reserve the company name with the DBD.
2. Prepare the Memorandum of Association (company details, capital, promoters).
3. Hold the statutory meeting and adopt the Articles of Association.
4. Register the company with the DBD (now handled through the DBD's online registration platform).
5. Obtain the tax ID and register for VAT if required.

## What do you need for a registered office?
A registered office address in Thailand is required for incorporation and is used for official correspondence and VAT registration. The address must be a real, usable location, and you should have permission to use it.

## What capital and evidence are expected?
Capital requirements depend on your activity, ownership route, and whether foreign staff need work permits. Increasingly, registrations involving foreign participation attract closer scrutiny of how share capital was actually paid — so keep clear evidence of capital contributions. Note that Thailand's DBD has been strengthening anti-nominee documentation requirements, and some enhanced evidence rules apply to registrations from mid-2026 onward; confirm the current requirements with the DBD or a qualified professional before filing.

## What obligations start once the company exists?
- Corporate income tax filing and an annual audit (mandatory for Thai limited companies).
- VAT registration once revenue exceeds the statutory threshold (1.8 million THB per year), or earlier if required for your activity.
- Bookkeeping, payroll and social security once you hire staff, and proper corporate records.

## What is the practical first move?
Lock in your ownership route and confirm whether your activity is restricted before you file anything. Those two decisions determine your capital, licensing, and banking path.

This article is general information for planning, not legal, tax, or immigration advice, and it is not a determination of eligibility. Rules change and are applied case by case. Confirm current requirements with the DBD and qualified professionals.`,
  },

  // 3 ---------------------------------------------------------------------------
  {
    slug: "corporate-bank-account-readiness-kyc-ubo-checklist-thailand",
    title:
      "Corporate Bank Account Readiness in Thailand: KYC, UBO and Source-of-Funds Checklist",
    target_keyword: "thailand corporate bank account kyc ubo requirements",
    excerpt:
      "The ownership chart, controllers, business substance, expected activity, and source-of-funds evidence Thai banks expect — and why consistency across your records decides the outcome.",
    meta_description:
      "KYC, UBO and source-of-funds checklist for a Thai corporate bank account, based on customer due diligence rules and common bank practice.",
    key_takeaway:
      "Thai banks must identify anyone who ultimately owns or controls your company (commonly 25%+ ownership or effective control). A clean ownership chart plus consistent, verifiable business and funding evidence is what makes onboarding smooth.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 120000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.amloCdd, S.bot, S.dbd],
    content: `Thai banks are required to perform customer due diligence and identify the ultimate beneficial owner (UBO) of a company before opening an account. Readiness means giving the bank a clear, consistent picture of who owns and controls the company, what the business does, and where the money comes from — with evidence that matches your registration and tax records.

## Who counts as a beneficial owner?
Under Thailand's customer due diligence regulation, the beneficial owner is the natural person who ultimately owns or controls the customer, or on whose behalf a transaction is conducted. For companies, banks commonly focus on individuals holding 25% or more of shares or exercising effective control; where no such person is identifiable, they may look to the senior managing official. Layered ownership through holding companies does not remove this requirement — it just means the chart must show every layer.

## What ownership documentation should you prepare?
- An ownership structure chart showing each entity and person up to the natural-person UBOs.
- The shareholder list and share percentages that match your DBD records.
- Identification and, where applicable, proof of address for directors, signatories, and UBOs.
- Board minutes authorizing the account and naming signatories.

## How do you demonstrate business substance?
Banks want evidence that the company is a real, operating business. Useful items include contracts or letters of intent, invoices or a pipeline, a plain-language description of the business model, your main customers and suppliers, and the countries you will transact with. A vague or generic description invites more questions.

## What is expected on source of funds and expected activity?
Be ready to explain where the initial capital comes from and what normal account activity will look like — expected monthly turnover, typical transaction sizes, and whether transfers are domestic or international. Consistency between what you state and what your documents show is critical; mismatches are a leading cause of delays and enhanced due diligence.

## Why does consistency across records matter so much?
KYC is a cross-check. If your ownership percentages, director names, business description, or addresses differ between your registration, tax filings, and bank forms, the bank must reconcile them before proceeding. Aligning every document before you apply removes the most common friction.

## Readiness checklist
1. Ownership chart to natural-person UBOs, matching DBD records.
2. Recent, consistent registration and corporate documents.
3. Board authority and correct signatories.
4. Business-substance evidence (contracts, invoices, model).
5. Source-of-funds and expected-activity explanation.
6. Confirmation of the specific bank's current document list and attendance rules.

This article is general information for planning, not legal, tax, or banking advice, and it is not a determination of eligibility. Bank and regulatory requirements change and are applied case by case. Confirm current requirements with your bank and qualified professionals.`,
  },

  // 4 ---------------------------------------------------------------------------
  {
    slug: "company-first-or-bank-account-first-thailand-setup-sequence",
    title:
      "Company First or Bank Account First in Thailand? The Correct Setup Sequence",
    target_keyword: "thailand company or bank account first setup order",
    excerpt:
      "Why the company almost always comes first, the readiness steps in between, and the case-dependent exceptions worth checking before you commit to a timeline.",
    meta_description:
      "Company or bank account first in Thailand? Follow the correct setup order: incorporate, prepare corporate records, then apply to the bank.",
    key_takeaway:
      "In almost all cases the company is registered first, because Thai banks open corporate accounts for entities that already exist. Bank preparation runs in parallel, but the application comes after incorporation.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 180000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.dbd, S.amloCdd, S.bot],
    content: `Founders often hit an apparent chicken-and-egg problem: you feel you need a bank account to run the company, but the bank wants a registered company to open the account. The practical answer is clear — register the company first, then apply for the corporate account — while preparing the banking pack in parallel so there is no dead time.

## Why does the company come first?
Thai banks open a corporate account for an existing legal entity. Until the company is incorporated and its registration documents are issued, there is nothing for the bank to onboard. So incorporation is the gating step for the corporate account.

## What is the recommended sequence?
1. Incorporate the company with the DBD (name reservation, MoA, statutory meeting, registration).
2. Assemble corporate records: registration certificate/affidavit, MoA/AoA, shareholder list, board minutes, company seal if used.
3. Reach tax and operational readiness: tax ID, VAT registration if required, a clear business description and expected activity.
4. Apply to the bank: confirm the specific bank's current document list and in-person attendance rules, then submit and attend.

## Can any banking preparation happen before incorporation?
Yes — and it should. You can build the ownership chart to natural-person UBOs, draft the business description and source-of-funds explanation, choose a target bank, and confirm its current requirements. This preparation is where readiness support adds value, so that the moment the company exists you can apply with a complete pack.

## Are there exceptions?
Some situations change the details rather than the order — for example, BOI-promoted structures, branch or representative offices, or specific bank programs may have their own document sets and timing. Foreign-led companies sometimes face timing considerations around work permits and signatory presence. These are case-dependent; confirm them with the bank and a qualified professional rather than assuming a universal rule.

## What is the realistic expectation on timing?
Incorporation and bank onboarding are separate processes with their own timelines, and the account is approved at the bank's discretion after its checks. Preparing thoroughly shortens the bank stage but does not remove the bank's decision.

This article is general information for planning, not legal, tax, immigration, or banking advice, and it is not a determination of eligibility. Requirements change and are applied case by case. Confirm current requirements with the DBD, your bank, and qualified professionals.`,
  },

  // 5 ---------------------------------------------------------------------------
  {
    slug: "foreign-ownership-thai-company-fba-boi-nominee-questions",
    title:
      "Foreign Ownership in a Thai Company: FBA, BOI and Nominee-Risk Questions to Resolve Before Incorporation",
    target_keyword: "foreign ownership thai company fba boi nominee",
    excerpt:
      "The decision points foreign founders must resolve before incorporating: restricted activities, ownership routes, and why nominee arrangements are a legal risk, not a workaround.",
    meta_description:
      "Foreign ownership of a Thai company: FBA limits, BOI and Treaty of Amity routes, restricted activities, and nominee-shareholder risks.",
    key_takeaway:
      "Resolve two questions before incorporating: is your activity restricted for foreigners, and which lawful route (49% Thai-majority, BOI, FBL, or Treaty of Amity) fits your plan? Nominee arrangements to bypass the limits are illegal.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 240000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.fba, S.boiGuide, S.dbd],
    content: `Before you incorporate in Thailand, resolve how the company will be owned and whether your activity is restricted for foreigners. These decisions drive your capital, licensing, and banking path — and getting them wrong is expensive to fix later. This article frames the questions to work through with a qualified adviser; it does not give a legal conclusion for your specific case.

## Is your business activity restricted for foreigners?
The Foreign Business Act (FBA) restricts foreign participation in many activities, with certain sectors reserved or requiring approval. The first question is whether your intended activity falls into a restricted category. If it does, you cannot simply take majority foreign ownership without a lawful route.

## What are the lawful routes to foreign ownership?
- Thai-majority company: foreign holding kept below the FBA threshold (commonly up to 49% foreign).
- BOI promotion: in eligible activities, this can allow up to 100% foreign ownership and replaces the need for a Foreign Business License with a Foreign Business Certificate.
- Foreign Business License (FBL): a formal DBD application for certain restricted activities.
- US–Thailand Treaty of Amity: for qualifying US citizens and US-incorporated companies.

Which route fits depends on your activity, investment, and plans — evaluate them before filing, not after.

## Why are nominee shareholders a serious risk, not a shortcut?
Using Thai nominee shareholders to hold shares on behalf of foreigners in order to bypass FBA limits is illegal. Penalties can include criminal liability and asset consequences, and Thai authorities have been strengthening detection of such arrangements. Ownership should reflect genuine economic reality. If a structure only "works" through nominees, it does not work.

## What ownership evidence is increasingly expected?
Registrations involving foreign participation attract closer scrutiny of how capital was actually contributed. Enhanced documentation requirements for certain foreign-involved registrations apply from mid-2026 onward, so keep clear evidence of who paid what, and when. Confirm the current requirements with the DBD or a qualified professional before filing.

## How does this connect to banking?
Your ownership route and structure flow directly into bank KYC and beneficial-owner checks. A clean, lawful, well-documented ownership chart is the same asset that later smooths your corporate bank account application.

## Questions to resolve before incorporation
1. Is the activity restricted under the FBA?
2. Which ownership route is lawful and practical for the plan?
3. Can capital contributions be clearly evidenced?
4. Does the structure reflect genuine ownership, with no reliance on nominees?

This article is general information for planning, not legal advice, and it is not a determination of eligibility or a legal conclusion. Rules change and are applied case by case. Confirm current requirements and obtain advice from qualified Thai legal professionals.`,
  },

  // 6 ---------------------------------------------------------------------------
  {
    slug: "why-thai-corporate-bank-account-applications-get-delayed",
    title:
      "Why Thai Corporate Bank Account Applications Get Delayed — and How to Prepare Better",
    target_keyword: "thai corporate bank account application delays",
    excerpt:
      "The recurring reasons corporate account applications stall in Thailand — stale documents, inconsistent ownership data, unclear purpose, missing authority — and how to pre-empt each one.",
    meta_description:
      "Why Thai corporate bank account applications get delayed: stale documents, ownership mismatches, unclear purpose, missing authority, and better fixes.",
    key_takeaway:
      "Most delays come from avoidable readiness gaps: documents that are too old, ownership data that does not match across records, an unclear business purpose, or missing board authority and signatories. Fix these before you apply.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 300000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.amloCdd, S.bot, S.dbd],
    content: `Most corporate bank account delays in Thailand are not caused by the bank being difficult — they are caused by avoidable readiness gaps. When documents are current, ownership is consistent, and the business purpose is clear, onboarding is far smoother. Here are the recurring causes and how to pre-empt each one.

## Are your documents too old for the bank's standard?
Banks commonly require registration and corporate documents issued within a recent window. Documents that were fine for incorporation can be "stale" by the time you apply. Fix: confirm the bank's freshness requirement and re-issue any document that falls outside it before your appointment.

## Does your ownership data match across every record?
If shareholder names, percentages, or director details differ between your DBD registration, tax records, and the bank's forms, the bank must reconcile them before proceeding. Fix: reconcile all records to a single, correct ownership chart to natural-person beneficial owners before you apply.

## Is your business purpose clear and specific?
A vague description ("general trading," "consulting") invites follow-up questions. Fix: prepare a plain-language explanation of what the company does, its customers and suppliers, expected transaction activity, and the countries involved.

## Do you have the right board authority and signatories?
Missing or incorrect board minutes, or the wrong people attending, stops an application. Fix: prepare board minutes that authorize the account and name the correct authorized signatories, and make sure those signatories are the ones who attend.

## Are the required people attending in person?
Many Thai banks require authorized directors or signatories to attend a branch in person. Fix: confirm the attendance rule for your specific bank and branch, and schedule the right people — this is especially important for foreign-led companies with signatories abroad.

## Could enhanced due diligence apply to you?
Higher-risk profiles — complex ownership, certain activities, or large cross-border flows — can trigger enhanced due diligence and longer timelines. Fix: over-prepare the ownership chart, source-of-funds explanation, and business-substance evidence so questions are answered before they are asked.

## What is a realistic expectation?
Even a perfectly prepared application is approved at the bank's discretion after its checks; preparation shortens the process and reduces friction, but the decision remains the bank's. Treat any promise of a guaranteed or instant account with caution.

## Pre-application checklist
1. Confirm and meet the bank's document-freshness window.
2. Reconcile ownership data across DBD, tax, and bank forms.
3. Write a clear, specific business-purpose statement.
4. Prepare board authority and confirm the correct signatories.
5. Confirm in-person attendance requirements.
6. Pre-empt enhanced due diligence with strong source-of-funds evidence.

This article is general information for planning, not legal, tax, or banking advice, and it is not a determination of eligibility. Bank requirements change and are applied case by case. Confirm current requirements with your bank and qualified professionals.`,
  },
];

export const GEO_ARTICLES = GEO_ARTICLE_SOURCE.map(applyInternalLinks);
