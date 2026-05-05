#!/usr/bin/env bash
# Verify Vercel BotID protection on /api/botid-test (and by extension /api/submit).
# Usage:
#   ./scripts/test-botid.sh                                  # uses default published URL
#   ./scripts/test-botid.sh https://your-domain.com          # custom base URL
#   BASE_URL=https://your-domain.com ./scripts/test-botid.sh # via env var

set -u

BASE_URL="${1:-${BASE_URL:-https://scope-guide-thailand.lovable.app}}"
ENDPOINT="${BASE_URL%/}/api/botid-test"

echo "→ POST $ENDPOINT"
echo

RESPONSE_FILE="$(mktemp)"
HTTP_CODE=$(curl -s -o "$RESPONSE_FILE" -w "%{http_code}" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  --max-time 15)
CURL_EXIT=$?

BODY=$(cat "$RESPONSE_FILE")
rm -f "$RESPONSE_FILE"

echo "HTTP $HTTP_CODE"
echo "Body: $BODY"
echo

if [ $CURL_EXIT -ne 0 ]; then
  echo "❌ FAIL — curl error (exit $CURL_EXIT). Network issue or endpoint unreachable."
  exit 1
fi

case "$HTTP_CODE" in
  403)
    echo "✅ PASS — BotID blocked the request as expected. Protection is ACTIVE."
    exit 0
    ;;
  200)
    echo "⚠️  FAIL — Request was allowed (HTTP 200)."
    echo "   BotID may not be enabled in the Vercel dashboard, or the route isn't protected."
    exit 1
    ;;
  404|405)
    echo "❌ FAIL — Endpoint not found ($HTTP_CODE). Has the project been published to Vercel?"
    exit 1
    ;;
  500|502|503)
    echo "❌ FAIL — Server error ($HTTP_CODE). Check Vercel function logs and BotID config."
    exit 1
    ;;
  *)
    echo "❌ FAIL — Unexpected status $HTTP_CODE."
    exit 1
    ;;
esac