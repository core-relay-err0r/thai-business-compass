export const SITE_URL = "https://www.pnd50.com";
export const SITE_NAME = "PND50";
export const LEGAL_NAME = "PND50 Co., Ltd.";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const ACCOUNTING_SERVICE_ID = `${SITE_URL}/#accounting-service`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function absoluteSiteUrl(path = "") {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
