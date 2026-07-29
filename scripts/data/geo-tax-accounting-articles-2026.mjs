import { applyInternalLinks } from "./article-internal-links.mjs";

// GEO/SEO editorial cluster: Thai tax and accounting compliance for companies.
//
// This file is the reproducible source of truth for the six published tax/accounting
// articles. It is consumed by scripts/seed-tax-accounting-articles.mjs to upsert rows
// into the Supabase `blog_posts` table (on conflict (slug) do update).
//
// Editorial standards applied:
// - Answer-first introductions and descriptive question-style H2/H3 headings.
// - Statutory deadlines stated first; electronic-filing extensions only noted as
//   conditional, never as permanent or universal.
// - Rates/thresholds that vary by payment type or treaty are described as variable,
//   never asserted as a single guaranteed figure.
// - No individualized tax conclusions, no invented credentials; author/reviewer
//   fields are intentionally left null until verified public names are supplied.

const REVIEW_DATE = "2026-07-25";
// Publish just after the company/banking cluster so ordering stays coherent.
const PUBLISH_BASE = "2026-07-25T10:00:00.000Z";

/** Shared authoritative sources, referenced per-article. */
const S = {
  rdEnglish: {
    title: "The Revenue Department of Thailand (English portal)",
    publisher: "The Revenue Department of Thailand",
    url: "https://www.rd.go.th/english/",
    accessed_at: REVIEW_DATE,
  },
  rdVat: {
    title: "Value Added Tax (VAT) — registration and filing",
    publisher: "The Revenue Department of Thailand",
    url: "https://www.rd.go.th/english/6043.html",
    accessed_at: REVIEW_DATE,
  },
  rdCit: {
    title: "Corporate Income Tax",
    publisher: "The Revenue Department of Thailand",
    url: "https://www.rd.go.th/english/6044.html",
    accessed_at: REVIEW_DATE,
  },
  rdWht: {
    title: "Withholding Tax",
    publisher: "The Revenue Department of Thailand",
    url: "https://www.rd.go.th/english/6045.html",
    accessed_at: REVIEW_DATE,
  },
  dbd: {
    title: "Financial statement submission and DBD e-Filing",
    publisher: "Department of Business Development (DBD), Ministry of Commerce",
    url: "https://www.dbd.go.th/en",
    accessed_at: REVIEW_DATE,
  },
  fap: {
    title: "Accounting and auditing standards guidance",
    publisher: "Federation of Accounting Professions (TFAC)",
    url: "https://www.tfac.or.th/en/",
    accessed_at: REVIEW_DATE,
  },
};

const TAX_ACCOUNTING_ARTICLE_SOURCE = [
  // 1 ---------------------------------------------------------------------------
  {
    slug: "thailand-tax-accounting-calendar-2026-deadlines",
    title:
      "Thailand Tax and Accounting Calendar 2026: Monthly, Mid-Year and Annual Deadlines",
    target_keyword: "thailand tax accounting calendar 2026",
    excerpt:
      "A single reference for the recurring bookkeeping, VAT, withholding, half-year and annual filings a Thai limited company must keep on schedule through 2026.",
    meta_description:
      "Thailand 2026 tax calendar: monthly VAT and withholding, half-year PND 51, annual PND 50, audit, and DBD financial-statement deadlines.",
    key_takeaway:
      "A Thai company runs on three cycles: monthly (withholding by the 7th, VAT by the 15th), half-year (PND 51 within two months of the first six months), and annual (audited accounts, shareholder approval, PND 50 within 150 days, and DBD filing). Missing any one triggers penalties.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime()).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.rdEnglish, S.rdVat, S.dbd],
    content: `Running a Thai limited company means keeping several filing cycles on schedule at once. This calendar summarizes the recurring statutory deadlines for 2026 so nothing is missed. Exact dates shift when a deadline falls on a weekend or public holiday, and electronic filing may qualify for a short extension for some forms and periods — always confirm the current date for your specific filing.

## What are the monthly deadlines?
- **Withholding tax (PND 1, PND 3, PND 53):** file and remit by the **7th of the following month**. PND 1 covers tax withheld from employees, PND 3 covers payments to individuals, and PND 53 covers payments to companies and juristic partnerships.
- **VAT (PP.30):** VAT-registered businesses file and pay by the **15th of the following month**, even in months with no sales.
- **Bookkeeping:** entries, invoices, receipts, and bank reconciliations should be captured monthly so the tax filings above are accurate.

## What are the mid-year and half-year deadlines?
- **PND 51 (half-year corporate income tax):** file and pay within **two months after the end of the first six months** of the accounting period. It is a prepayment based on estimated annual net profit, so under-estimating can create a surcharge.

## What are the annual deadlines?
For a company whose accounting period ends **31 December 2025**, the 2026 annual cycle typically runs:
- **Hold the shareholders' meeting to approve the audited financial statements** within **four months** of year-end.
- **PND 50 (annual corporate income tax):** file and pay within **150 days** of the accounting-period close.
- **Submit the audited financial statements to the DBD** via **DBD e-Filing** after shareholder approval, within the DBD's stated window.

Companies with a non-calendar accounting period apply the same intervals to their own year-end.

## Why does the exact date sometimes move?
Statutory deadlines can shift for weekends and public holidays, and the Revenue Department has at times allowed additional days for electronic filing of certain returns. Treat the statutory date as the anchor and verify any extension for the specific form and period before relying on it.

## Related reading
- VAT registration and the THB 1.8 million threshold.
- PND 50 vs PND 51 explained.
- Annual audit and financial statements.

This article is general information for planning, not tax advice, and it is not a determination of your obligations. Deadlines change and depend on your accounting period. Confirm the current dates with the Revenue Department, the DBD, and a qualified accountant.`,
  },

  // 2 ---------------------------------------------------------------------------
  {
    slug: "vat-registration-thailand-1-8-million-threshold-pp30",
    title:
      "VAT Registration in Thailand: The THB 1.8 Million Threshold and PP.30 Explained",
    target_keyword: "vat registration thailand threshold pp30",
    excerpt:
      "When VAT registration becomes mandatory in Thailand, how the 30-day window works, and what monthly PP.30 filing involves for a company.",
    meta_description:
      "Thailand VAT: the THB 1.8M threshold, the 30-day registration window, monthly PP.30 filing, tax invoices, and input vs output VAT.",
    key_takeaway:
      "VAT registration is mandatory once annual turnover exceeds THB 1.8 million; you must register within 30 days of crossing it. Registered businesses file PP.30 monthly by the 15th, even with no sales, and must issue compliant tax invoices.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 60000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.rdVat, S.rdEnglish, S.dbd],
    content: `Value Added Tax (VAT) is one of the first tax obligations a growing Thai company encounters. This article explains when registration becomes mandatory, the deadline to register, and what ongoing monthly filing involves.

## When is VAT registration mandatory?
VAT registration is **mandatory once a business's annual turnover exceeds THB 1.8 million**. Once you reach that threshold, you must apply to register — using the VAT registration form — **within 30 days** of the income reaching it. Some businesses also register **voluntarily** below the threshold to reclaim input VAT, though that adds monthly filing obligations.

## What does monthly PP.30 filing involve?
Once registered, you file a **monthly VAT return (PP.30)** and pay any VAT due by the **15th of the following month**. This applies **even in months with no sales** — a nil return is still required. Filing can generally be done electronically through the Revenue Department's system.

## How do output VAT and input VAT work?
- **Output VAT** is the VAT you charge customers on taxable sales (standard rate applies to most goods and services; confirm the current rate).
- **Input VAT** is the VAT you pay suppliers on business purchases.
- You generally remit the difference (output minus deductible input). Keeping valid **tax invoices** is what allows you to claim input VAT.

## Why are tax invoices so important?
A compliant **tax invoice** is required both to charge VAT correctly and to support input-VAT claims. Missing or defective invoices are a common reason input VAT is disallowed, so invoice discipline directly affects how much VAT you actually pay.

## What about multiple branches?
Where a company has more than one branch, each branch generally files separately **unless** the business obtains official approval for centralized filing. Confirm the current rule if you operate across locations.

## Practical checklist
1. Monitor turnover against the THB 1.8 million threshold continuously.
2. Register within 30 days of crossing it.
3. File PP.30 monthly by the 15th, including nil months.
4. Issue and retain compliant tax invoices for output and input VAT.
5. Confirm branch-filing arrangements if applicable.

## Related reading
- Thailand tax and accounting calendar 2026.
- Withholding tax forms PND 1, 3 and 53.

This article is general information for planning, not tax advice. VAT rates, thresholds, and procedures can change. Confirm current requirements with the Revenue Department and a qualified accountant.`,
  },

  // 3 ---------------------------------------------------------------------------
  {
    slug: "thai-withholding-tax-companies-pnd1-pnd3-pnd53",
    title:
      "Thai Withholding Tax for Companies: PND 1, PND 3 and PND 53 in Plain English",
    target_keyword: "thai withholding tax pnd1 pnd3 pnd53",
    excerpt:
      "Which withholding tax form applies to which payment, when to remit, and why the rate always depends on the payment type and the recipient.",
    meta_description:
      "Thai withholding tax explained: PND 1 for employees, PND 3 for individuals, PND 53 for companies, remitted by the 7th of the next month.",
    key_takeaway:
      "When your company pays certain income, you must withhold tax and remit it by the 7th of the following month using the right form: PND 1 for employees, PND 3 for individuals, and PND 53 for juristic persons. Rates depend on the payment type and any tax treaty.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 120000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.rdWht, S.rdEnglish, S.dbd],
    content: `Withholding tax catches many new companies by surprise: when you pay certain kinds of income, you are responsible for deducting tax at source and remitting it to the Revenue Department. This article explains which form applies and when it is due.

## Who has to withhold?
The **payer** of the income withholds. If your company pays salaries, service fees, rent, professional fees, or similar payments, you generally must deduct the applicable withholding tax and remit it — issuing a **withholding tax certificate** to the recipient.

## Which form maps to which payment?
- **PND 1** — tax withheld from **employees'** salaries (personal income tax).
- **PND 3** — tax withheld on payments to **individuals** (non-employees, such as freelancers).
- **PND 53** — tax withheld on payments to **companies and juristic partnerships**.

Using the correct form for each recipient type matters; the recipient category, not the service, drives the choice between PND 3 and PND 53.

## When must it be remitted?
Withholding tax returns and payment are generally due by the **7th of the month following** the payment. As with other filings, the date can move for weekends and holidays, and electronic filing may allow a few extra days for some periods — verify before relying on it.

## Why can't I just quote one rate?
Withholding rates **vary by the type of payment** (for example, services, rent, and professional fees can differ) and can be affected by a **double-tax treaty** where the recipient is a foreign entity. Because of this, you should confirm the correct rate for each payment type rather than apply a single blanket figure.

## What if I forget to withhold?
Failing to withhold or remit does **not** remove the underlying tax liability and can create penalties and surcharges. It can also disturb the recipient's records. Build withholding into your payment workflow so it happens automatically.

## Practical checklist
1. Identify which payments require withholding.
2. Match each recipient to PND 1, PND 3, or PND 53.
3. Confirm the correct rate by payment type (and treaty, if foreign).
4. Issue withholding certificates to recipients.
5. Remit by the 7th of the following month.

## Related reading
- Thailand tax and accounting calendar 2026.
- Bookkeeping workflow for foreign-owned companies.

This article is general information for planning, not tax advice, and it does not state a rate for your specific payments. Rates and rules change. Confirm current obligations with the Revenue Department and a qualified accountant.`,
  },

  // 4 ---------------------------------------------------------------------------
  {
    slug: "pnd50-vs-pnd51-thailand-corporate-income-tax",
    title: "PND 50 vs PND 51: Thailand Corporate Income Tax Filings Explained",
    target_keyword: "pnd50 vs pnd51 corporate income tax thailand",
    excerpt:
      "The difference between Thailand's annual and half-year corporate income tax returns, their deadlines, and the estimation risk built into PND 51.",
    meta_description:
      "PND 50 vs PND 51 in Thailand: annual vs half-year corporate income tax returns, deadlines, estimated-profit risk, and how they reconcile.",
    key_takeaway:
      "PND 51 is the half-year prepayment based on estimated annual profit, due within two months of the first six months. PND 50 is the annual return, due within 150 days of year-end and reconciled to your audited accounts. Under-estimating on PND 51 can trigger a surcharge.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 180000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.rdCit, S.rdEnglish, S.dbd],
    content: `Thai companies file corporate income tax twice in each accounting period: once at the half-year and once annually. Confusing the two — or under-estimating on the half-year return — is a common and costly mistake. Here is how they differ.

## What is PND 51 (the half-year return)?
**PND 51** is a **half-year corporate income tax return** used to **prepay** tax based on the company's **estimated annual net profit**. It must be filed and paid within **two months after the end of the first six months** of the accounting period. Because it relies on an estimate, the accuracy of your forecast matters.

## What is PND 50 (the annual return)?
**PND 50** is the **annual corporate income tax return**, filed and paid within **150 days** of the accounting-period close. It reports actual results for the full year and is reconciled against your **audited financial statements**. Any half-year prepayment already made via PND 51 is credited against the annual liability.

## Why is the PND 51 estimate risky?
If your estimated profit on PND 51 is **materially lower** than the actual result, a **surcharge** can apply to the shortfall. This makes a realistic mid-year forecast important — especially for fast-growing companies whose second half outperforms the first.

## What rate applies?
The **standard corporate income tax rate is 20%**, but **reduced rates or brackets can apply to qualifying small companies (SMEs)** that meet the conditions. Because eligibility depends on paid-up capital and income, confirm which treatment applies to your company rather than assuming a single rate.

## How do these connect to the audit?
PND 50 is built from the same numbers as your **audited accounts**, so the audit and the annual tax return should be prepared together. If bookkeeping is behind, both the audit and PND 50 are delayed — and the 150-day deadline does not move.

## Practical checklist
1. Diarize the half-year deadline (two months after the first six months).
2. Prepare a realistic mid-year profit estimate for PND 51.
3. Keep bookkeeping current so the audit and PND 50 stay on schedule.
4. Confirm whether SME rates apply to your company.
5. File PND 50 within 150 days and reconcile it to audited accounts.

## Related reading
- Annual audit and financial statements in Thailand.
- Thailand tax and accounting calendar 2026.

This article is general information for planning, not tax advice, and it is not a determination of your rate or liability. Rates and rules change. Confirm current obligations with the Revenue Department and a qualified accountant.`,
  },

  // 5 ---------------------------------------------------------------------------
  {
    slug: "annual-audit-financial-statements-thailand-limited-company",
    title:
      "Annual Audit and Financial Statements in Thailand: What Every Limited Company Must File",
    target_keyword: "annual audit financial statements thailand company",
    excerpt:
      "Why Thai limited companies generally need an independent annual audit — even when inactive — and how shareholder approval and DBD filing fit together.",
    meta_description:
      "Thailand annual audit: limited companies generally need audited financial statements, shareholder approval within four months, and DBD e-Filing.",
    key_takeaway:
      "A Thai limited company generally must have its annual financial statements independently audited, approved by shareholders within four months of year-end, and submitted to the DBD via e-Filing. This obligation usually applies even if the company was inactive.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 240000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.dbd, S.fap, S.rdCit],
    content: `Many founders are surprised that a Thai limited company must be audited every year — even a dormant one. This article explains the annual financial-statement obligation and how audit, shareholder approval, and DBD filing connect.

## Does my company really need an audit if it was inactive?
Generally, **yes**. A Thai limited company is normally required to have its **annual financial statements audited by a licensed auditor**, and this obligation typically applies **even if the company had little or no activity**. Assuming an inactive company is exempt is a frequent and costly error.

## What is the annual sequence?
1. **Close the books** for the accounting period and prepare financial statements.
2. Have the statements **audited** by a licensed independent auditor.
3. **Hold a shareholders' meeting to approve** the audited statements — generally within **four months** of the year-end.
4. **Submit the approved statements to the DBD** through **DBD e-Filing** within the DBD's stated window.
5. File **PND 50** with the Revenue Department within **150 days** of year-end, reconciled to the audited accounts.

## Who can perform the audit?
The audit must be carried out by a **licensed auditor**. Auditing and accounting standards in Thailand are overseen by the profession's governing body, and the auditor's independence is part of what gives the statements their standing with the DBD and the Revenue Department.

## What happens if I don't file?
Late or missing filings attract **penalties**, and **failing to submit financial statements for several consecutive periods** can lead to the company being treated as **dormant and struck from the register**. Keeping the annual cycle on time protects the company's good standing.

## How do I prepare for a smooth year-end?
The audit is only as fast as your bookkeeping. If records, bank reconciliations, and supporting documents are current, the audit and PND 50 proceed on schedule; if they are behind, everything compresses against fixed deadlines.

## Practical checklist
1. Assume an annual audit is required unless a professional confirms otherwise.
2. Keep bookkeeping current throughout the year.
3. Schedule the audit early enough for shareholder approval within four months.
4. File audited statements with the DBD via e-Filing.
5. Reconcile PND 50 to the audited accounts and file within 150 days.

## Related reading
- PND 50 vs PND 51 explained.
- Bookkeeping workflow for foreign-owned companies.

This article is general information for planning, not accounting, audit, or legal advice, and it is not a determination of your filing obligations. Requirements change and are applied case by case. Confirm current obligations with the DBD and a qualified auditor or accountant.`,
  },

  // 6 ---------------------------------------------------------------------------
  {
    slug: "bookkeeping-thailand-foreign-owned-company-monthly-workflow",
    title:
      "Bookkeeping in Thailand for Foreign-Owned Companies: Records, Documents and Monthly Workflow",
    target_keyword: "bookkeeping thailand foreign owned company",
    excerpt:
      "An operational monthly bookkeeping checklist for foreign-owned Thai companies, and why clean records make VAT, withholding, and the annual audit far easier.",
    meta_description:
      "Bookkeeping in Thailand: a monthly workflow for foreign-owned companies covering records, documents, reconciliations, retention, and audit readiness.",
    key_takeaway:
      "Good bookkeeping is a monthly discipline: capture every invoice, receipt, and bank transaction, reconcile accounts, and keep documents retained and consistent. Clean records are what make VAT, withholding, PND 50, and the annual audit straightforward.",
    published_at: new Date(new Date(PUBLISH_BASE).getTime() + 300000).toISOString(),
    reviewed_at: REVIEW_DATE,
    sources: [S.dbd, S.fap, S.rdEnglish],
    content: `For a foreign-owned Thai company, bookkeeping is not just record-keeping — it is the foundation that every tax filing and the annual audit are built on. This article gives a practical monthly workflow and explains why staying current matters.

## Why does bookkeeping quality matter so much?
Your VAT returns, withholding filings, PND 51, PND 50, and the annual audit all draw from the same underlying records. If bookkeeping is accurate and current, those filings are routine. If it is behind, errors and delays cascade into every deadline — and catch-up work is more expensive than staying current.

## What records must a company keep?
A Thai company must maintain proper accounting records and supporting documents, including:
- Sales and purchase invoices, and compliant **tax invoices** for VAT.
- Receipts and expense documentation.
- **Bank statements** for every company account.
- Payroll records and withholding tax certificates.
- Contracts and other supporting evidence.

Records must generally be **retained** for the period required by law, so a reliable document-storage system is part of compliance, not an optional extra.

## What does a healthy monthly workflow look like?
1. **Collect** all invoices, receipts, and expense documents for the month.
2. **Record** transactions in the accounts.
3. **Reconcile** every bank account against statements.
4. **Prepare and file** VAT (PP.30) and withholding (PND 1/3/53) on time.
5. **Review** for missing documents or unusual items while they are still fresh.

## Why is consistency across records critical for foreign-owned companies?
Ownership and director details, tax records, and bank information should all tell the **same story**. Inconsistencies between your bookkeeping, DBD registration, and bank records create friction — for example, during a corporate bank account review or enhanced due diligence. Consistent records are the same asset that supports banking and audit.

## What are the risks of falling behind?
- Late VAT or withholding filings and associated penalties.
- A rushed, more expensive year-end audit.
- A delayed PND 50 against a fixed 150-day deadline.
- Reconciliation problems that surface at the worst time — during a bank or authority review.

## Monthly checklist
1. Gather and file all source documents.
2. Book every transaction and reconcile all bank accounts.
3. File VAT and withholding on schedule.
4. Keep ownership, tax, and bank records consistent.
5. Retain documents for the legally required period.

## Related reading
- Thailand tax and accounting calendar 2026.
- Annual audit and financial statements.

This article is general information for planning, not accounting or tax advice. Record-keeping and retention rules change. Confirm current requirements with the DBD, the Revenue Department, and a qualified accountant.`,
  },
];

export const TAX_ACCOUNTING_ARTICLES = TAX_ACCOUNTING_ARTICLE_SOURCE.map(applyInternalLinks);
