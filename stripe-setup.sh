#!/usr/bin/env bash
# Just Good Grips — Stripe Subscription Setup
# Run this locally: bash stripe-setup.sh
# Requires: curl, jq
#
# Creates:
#   1 product  → Just Good Grips 12-Pack White
#   9 prices   → 3 qtys (12/24/36 grips) × 3 frequencies (2/4/12 weeks)
#   9 payment links

set -euo pipefail

# Paste your Stripe restricted API key here (or export STRIPE_API_KEY before running)
API_KEY="${STRIPE_API_KEY:-YOUR_STRIPE_RESTRICTED_KEY_HERE}"
BASE="https://api.stripe.com/v1"

stripe() {
  local method="$1"; local endpoint="$2"; shift 2
  curl -s -X "$method" "$BASE/$endpoint" \
    -u "$API_KEY:" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    "$@"
}

echo "==> Creating product..."
PRODUCT=$(stripe POST products \
  -d "name=Just Good Grips 12-Pack White" \
  -d "description=Premium tennis overgrip — 12-pack, white")
PRODUCT_ID=$(echo "$PRODUCT" | jq -r '.id')
echo "    Product ID: $PRODUCT_ID"

# Price in AUD cents (10% discount off one-time price of $29.99/12 = $2.4992/grip)
# 12 grips: $2.4992 × 12 = $29.99 × 0.90 = $26.99  → 2699 cents
# 24 grips: $29.99 × 2 × 0.90 = $53.98              → 5398 cents
# 36 grips: $29.99 × 3 × 0.90 = $80.97              → 8097 cents

declare -A PRICES=(
  ["12-2"]=2699   # 12 grips, every 2 weeks
  ["12-4"]=2699   # 12 grips, every 4 weeks
  ["12-12"]=2699  # 12 grips, every 12 weeks
  ["24-2"]=5398
  ["24-4"]=5398
  ["24-12"]=5398
  ["36-2"]=8097
  ["36-4"]=8097
  ["36-12"]=8097
)

declare -A PRICE_IDS
declare -A LINK_URLS

echo ""
echo "==> Creating prices..."
for KEY in "${!PRICES[@]}"; do
  GRIPS="${KEY%-*}"
  WEEKS="${KEY#*-}"
  AMOUNT="${PRICES[$KEY]}"

  PRICE=$(stripe POST prices \
    -d "product=$PRODUCT_ID" \
    -d "unit_amount=$AMOUNT" \
    -d "currency=aud" \
    -d "recurring[interval]=week" \
    -d "recurring[interval_count]=$WEEKS" \
    -d "nickname=${GRIPS} grips every ${WEEKS} weeks")
  PRICE_ID=$(echo "$PRICE" | jq -r '.id')
  PRICE_IDS["$KEY"]="$PRICE_ID"
  echo "    [$KEY] Price ID: $PRICE_ID  (AUD \$$((AMOUNT/100)).$((AMOUNT%100)) / ${WEEKS}w)"
done

echo ""
echo "==> Creating payment links..."
for KEY in "${!PRICE_IDS[@]}"; do
  PRICE_ID="${PRICE_IDS[$KEY]}"

  LINK=$(stripe POST payment_links \
    -d "line_items[0][price]=$PRICE_ID" \
    -d "line_items[0][quantity]=1")
  LINK_URL=$(echo "$LINK" | jq -r '.url')
  LINK_URLS["$KEY"]="$LINK_URL"
  echo "    [$KEY] $LINK_URL"
done

echo ""
echo "============================================================"
echo "Copy the SUB_LINKS object below into subscription.html:"
echo "============================================================"
echo ""
echo "const SUB_LINKS = {"
for KEY in "12-2" "12-4" "12-12" "24-2" "24-4" "24-12" "36-2" "36-4" "36-12"; do
  URL="${LINK_URLS[$KEY]:-#}"
  # Pad for readability
  printf "  %-8s '%s',\n" "'$KEY':" "$URL"
done
echo "};"
echo ""
echo "============================================================"
echo "Done! Paste the SUB_LINKS block back to Claude."
echo "============================================================"
