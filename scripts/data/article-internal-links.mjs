export const ARTICLE_INTERNAL_LINKS = {
  "corporate-bank-account-thailand-foreign-founders-2026": [
    ["company-registration checklist for foreign founders", "/blog/thailand-company-registration-foreign-founders-checklist-2026"],
    ["KYC and UBO readiness checklist", "/blog/corporate-bank-account-readiness-kyc-ubo-checklist-thailand"],
    ["correct company-to-bank setup sequence", "/blog/company-first-or-bank-account-first-thailand-setup-sequence"],
  ],
  "thailand-company-registration-foreign-founders-checklist-2026": [
    ["foreign-ownership and nominee-risk questions", "/blog/foreign-ownership-thai-company-fba-boi-nominee-questions"],
    ["correct company-to-bank setup sequence", "/blog/company-first-or-bank-account-first-thailand-setup-sequence"],
    ["2026 tax and accounting calendar", "/blog/thailand-tax-accounting-calendar-2026-deadlines"],
    ["VAT registration and the THB 1.8 million threshold", "/blog/vat-registration-thailand-1-8-million-threshold-pp30"],
  ],
  "corporate-bank-account-readiness-kyc-ubo-checklist-thailand": [
    ["corporate bank account guide for foreign founders", "/blog/corporate-bank-account-thailand-foreign-founders-2026"],
    ["bank-application delay prevention guide", "/blog/why-thai-corporate-bank-account-applications-get-delayed"],
    ["monthly bookkeeping workflow", "/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow"],
  ],
  "company-first-or-bank-account-first-thailand-setup-sequence": [
    ["Thailand company-registration checklist", "/blog/thailand-company-registration-foreign-founders-checklist-2026"],
    ["corporate bank account requirements", "/blog/corporate-bank-account-thailand-foreign-founders-2026"],
    ["tax and accounting deadlines after incorporation", "/blog/thailand-tax-accounting-calendar-2026-deadlines"],
  ],
  "foreign-ownership-thai-company-fba-boi-nominee-questions": [
    ["company-registration checklist for foreign founders", "/blog/thailand-company-registration-foreign-founders-checklist-2026"],
    ["KYC and beneficial-owner documentation", "/blog/corporate-bank-account-readiness-kyc-ubo-checklist-thailand"],
    ["common reasons bank applications are delayed", "/blog/why-thai-corporate-bank-account-applications-get-delayed"],
  ],
  "why-thai-corporate-bank-account-applications-get-delayed": [
    ["KYC, UBO and source-of-funds checklist", "/blog/corporate-bank-account-readiness-kyc-ubo-checklist-thailand"],
    ["corporate bank account requirements", "/blog/corporate-bank-account-thailand-foreign-founders-2026"],
    ["foreign-ownership and nominee-risk questions", "/blog/foreign-ownership-thai-company-fba-boi-nominee-questions"],
  ],
  "thailand-tax-accounting-calendar-2026-deadlines": [
    ["VAT registration and monthly PP.30 filing", "/blog/vat-registration-thailand-1-8-million-threshold-pp30"],
    ["PND 50 and PND 51 corporate tax filings", "/blog/pnd50-vs-pnd51-thailand-corporate-income-tax"],
    ["annual audit and financial-statement cycle", "/blog/annual-audit-financial-statements-thailand-limited-company"],
    ["monthly bookkeeping workflow", "/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow"],
  ],
  "vat-registration-thailand-1-8-million-threshold-pp30": [
    ["2026 tax and accounting calendar", "/blog/thailand-tax-accounting-calendar-2026-deadlines"],
    ["Thai withholding-tax forms and deadlines", "/blog/thai-withholding-tax-companies-pnd1-pnd3-pnd53"],
    ["bookkeeping workflow for VAT-ready records", "/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow"],
  ],
  "thai-withholding-tax-companies-pnd1-pnd3-pnd53": [
    ["2026 tax and accounting calendar", "/blog/thailand-tax-accounting-calendar-2026-deadlines"],
    ["monthly bookkeeping workflow", "/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow"],
    ["VAT registration and PP.30 guide", "/blog/vat-registration-thailand-1-8-million-threshold-pp30"],
  ],
  "pnd50-vs-pnd51-thailand-corporate-income-tax": [
    ["annual audit and financial statements", "/blog/annual-audit-financial-statements-thailand-limited-company"],
    ["2026 tax and accounting calendar", "/blog/thailand-tax-accounting-calendar-2026-deadlines"],
    ["bookkeeping workflow that supports tax filings", "/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow"],
  ],
  "annual-audit-financial-statements-thailand-limited-company": [
    ["PND 50 and PND 51 explained", "/blog/pnd50-vs-pnd51-thailand-corporate-income-tax"],
    ["monthly bookkeeping and audit readiness", "/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow"],
    ["company-registration records checklist", "/blog/thailand-company-registration-foreign-founders-checklist-2026"],
  ],
  "bookkeeping-thailand-foreign-owned-company-monthly-workflow": [
    ["2026 tax and accounting calendar", "/blog/thailand-tax-accounting-calendar-2026-deadlines"],
    ["VAT registration and PP.30 filing", "/blog/vat-registration-thailand-1-8-million-threshold-pp30"],
    ["Thai withholding-tax forms", "/blog/thai-withholding-tax-companies-pnd1-pnd3-pnd53"],
    ["annual audit and financial statements", "/blog/annual-audit-financial-statements-thailand-limited-company"],
  ],
};

const RELATED_READING_PATTERN = /\n## Related reading\n(?:- [^\n]+\n?)+/;

export function applyInternalLinks(article) {
  const links = ARTICLE_INTERNAL_LINKS[article.slug] || [];
  const section = `\n## Related reading\n${links.map(([label, href]) => `- [${label}](${href})`).join("\n")}\n`;
  const content = RELATED_READING_PATTERN.test(article.content)
    ? article.content.replace(RELATED_READING_PATTERN, section)
    : article.content.replace(/\n(This article is general information)/, `${section}\n$1`);

  return { ...article, content };
}
