# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brand Context

All conversations in this repository are in the context of **Just Good Grips**, an Australian tennis overgrip brand. When making decisions about copy, tone, design, or product details, refer to the brand's public presence:

- Website: https://www.justgoodgrips.com/about
- Instagram: https://www.instagram.com/justgoodgrips/
- Facebook: https://www.facebook.com/justgoodgrips

Founder: Scott Pearse, Adelaide, SA. Brand story: high-quality tennis grips at an affordable price. Competitor overgrips retail at $4–$7 each; JGG retails at ~$2 each.

## Project Overview

Just Good Grips is a static single-page e-commerce site for an Australian tennis overgrip brand. No build tools, no frameworks, no package manager — it's plain HTML, CSS, and vanilla JS served directly in a browser.

## Development

Open `index.html` directly in a browser — no server or build step required. For local development with live reload, any static file server works (e.g. `npx serve .` or VS Code's Live Server extension).

## Two Repos — Important

| Repo | Remote alias | Purpose |
|------|-------------|---------|
| `github.com/pearses/just-good-grips` | `origin` | **Production** — live site at justgoodgrips.com |
| `github.com/pearses/jgg-dev` | `dev` | Dev/test — push here first, then apply to production |

**Always push production changes to `origin` (just-good-grips), not `dev`.** Because the two repos have diverged git histories, never attempt a plain `git pull` or `git merge` between them — apply changes manually or via a `prod-update` branch off `origin/main`.

## Architecture

The site spans multiple files/pages:

- **`index.html`** — Main single-page layout: Header → Hero → Products → Features → Testimonials → About → Stores → Club → Footer
- **`membership/index.html`** — JGG Club membership page (quiz + tier selection). Accessible at `/membership`
- **`contact/index.html`** — Stockist/retailer enquiry form. Accessible at `/contact`
- **`poster.html`** — Print price list poster (internal use)
- **`style.css`** — All styles shared across pages. CSS custom properties (tokens) are defined at the top in `:root`. The design is Wilson-inspired, minimal, black/white with tennis-ball green (`#c8e617`) as the accent.
- **`script.js`** — Vanilla JS: sticky header shadow on scroll, mobile nav toggle, smooth-scroll, product modal gallery, review carousel.

**Clean URL structure** (GitHub Pages folder trick — each page is a `folder/index.html`):
- `/` → `index.html`
- `/membership` → `membership/index.html`
- `/contact` → `contact/index.html`

Asset paths inside `membership/` and `contact/` use `../` prefix (e.g. `../style.css`, `../images/`).

## Page Section Order

The announcement bar has been **removed** from all pages. Free shipping is included by default and is no longer highlighted as a promotion.

The header is sticky at `top: 0` with no offset needed.

## Products

Four product cards in a responsive grid (`repeat(3, 1fr)` → `repeat(2, 1fr)` at ≤960px → `1fr` at ≤640px):

| Card | Colour | Status | Stripe link |
|------|--------|--------|-------------|
| 12 Pack | White | **Available** | `https://buy.stripe.com/...` (real link in HTML) |
| 12 Pack | Light Blue | Coming Soon | — |
| 12 Pack | Light Pink | Coming Soon | — |
| 60 Pack | White | Coming Soon | — |

- Cards use `.product-card` with `.product-card--featured` for the available white card (green top border via `::before`).
- Coming soon cards use `.product-card--coming-soon` (reduced opacity) and `.btn-coming-soon` (disabled).
- Each card has a `.colour-dot` with modifier `--white`, `--blue`, or `--pink`.
- The white 12-pack card has two modal triggers: `#openProductModal` (View Details button) and `#openProductModalImg` (clicking the product image).

## Header Logo

The logo in the header is a `<div class="logo">` (not an `<a>`) — **no hyperlink**. This was deliberate.

```html
<div class="logo">
  <img src="images/logo-black.svg" alt="Just Good Grips" class="logo-img">
</div>
```

## Product Modal Gallery

A full-screen modal (`#productModal`) opens when the user clicks "View Details" or the product image on the white 12-pack card.

**HTML structure:**
```
#productModal
  #modalBackdrop
  .modal-panel
    .modal-gallery-pane
      .modal-main-wrap      ← position: relative; aspect-ratio set
        #modalMainImg       ← position: absolute; inset: 0; object-fit: contain
        #modalMainPlaceholder
      #modalThumbs          ← strip of .modal-thumb buttons
    .modal-info-pane        ← product details, features, buy button
  #modalClose
```

**Key CSS insight:** `object-fit: contain` / `object-position: center` only work correctly when the `<img>` has pixel-resolved dimensions. Using `position: absolute; inset: 0; width: 100%; height: 100%` on the img inside a `position: relative` parent gives it explicit bounds, so `object-fit` resolves correctly.

**JS pattern:** `activateThumb(btn)` fades image to opacity 0, preloads via `new Image()`, swaps `src` on load, fades back to opacity 1. This prevents flash of wrong-size images.

**Triggers:**
- `#openProductModal` — View Details button
- `#openProductModalImg` — wraps product image, has `::after` pseudo-element for hover darkening (`rgba(0,0,0,0.12)`) — no label/text overlay

## Store Locations Section

Sits between About and Footer. One confirmed real stockist:
- **Anything Tennis** — Trinity Gardens Tennis Club, 1 Maryvale Ave, Trinity Gardens SA 5068

Uses a Google Maps `<iframe>` embed. Section background: `url('images/grip-single.jpg')` with a white overlay for legibility.

## Social Links (Footer)

Instagram and Facebook SVG icon links in the footer:
- Instagram: `https://www.instagram.com/justgoodgrips/`
- Facebook: `https://www.facebook.com/justgoodgrips`

## Stripe Integration

Checkout is handled by **Stripe Payment Links** (no backend). Only the white 12-pack currently has a live link. The 60-pack and colour variants show "Coming Soon" buttons.

Current live Stripe link for 12-pack white (single purchase): `https://buy.stripe.com/3cI5kF50PcDv6PDehc83C0k`

Membership subscription links are in `membership/index.html` in the `STRIPE_LINKS` JS object.

## Images

### Active image files

| File | Usage |
|------|-------|
| `images/logo-black.svg` | Header logo (black wordmark, no background) |
| `images/jgg-insta.png` | Footer logo (white mark on dark background) |
| `images/hero-bg.jpg` | Hero section background |
| `images/grip-single.jpg` | Stores section background |
| `images/grip-pack-12-white.webp` | White 12-pack product card + modal thumb 1 |
| `images/mockup-1-handing-grips.png` | Modal thumb 2 |
| `images/mockup-2-handing-grips.png` | Modal thumb 3 |
| `images/mockup-3-handing-grips.png` | Modal thumb 4 |
| `images/photo-scott.jpg` | About section founder photo |

### Clean-name copies (original filenames had spaces/dates)
- `hero-bg.jpg` ← `6B159C42-F458-4BFC-9D6C-9743A79E2B12_L0_001-27_11_2025, 5_08_56 pm.jpg`
- `grip-single.jpg` ← `1000002495_802e88225df0ac3fd06006b819c4cede-10_2_2024, 11_00_32 PM.jpg`

### Fallback behaviour
The `onerror` handler on product `<img>` tags adds `.img-fallback` to show an SVG placeholder when the image fails to load.

## CSS Conventions

- All design tokens (colours, radii, shadows, transition) live in `:root` — always use these variables, never hardcode values.
- Responsive breakpoints: tablet ≤ 960px, mobile ≤ 640px, very small ≤ 380px.
- Button variants: `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-buy`, `.btn-buy--featured`.
- Featured product card uses `.product-card--featured` which adds a green top border via `::before`.

## CSS Gotchas

**Media query scoping bug:** When adding new breakpoint rules (e.g. for a modal), it's easy to accidentally insert a `}` that closes a pre-existing `@media` block early. This makes all subsequent rules in that block global — overriding desktop layouts everywhere. Always verify that `@media` braces are balanced after editing `style.css`.

**Carousel horizontal overflow:** The review carousel track lays all cards side-by-side. `overflow: hidden` on the `.carousel-viewport` clips visually but the track still contributes to scroll width. Adding `overflow: hidden` to the outer `.reviews-section` prevents horizontal page scroll.

**Modal image centering:** Percentage-based heights don't resolve against an `aspect-ratio`-only parent. Use `position: absolute; inset: 0` on the `<img>` to give it pixel-resolved bounds, then `object-fit: contain; object-position: center` works as expected.

## Canva MCP Integration

Canva is connected via MCP for editing designs and accessing uploaded assets. To add/reconnect:

```
claude mcp add --transport http canva https://mcp.canva.com/mcp
```

After adding, restart Claude Code and complete the Canva OAuth flow when prompted.

### Key Canva Asset IDs

**Uploaded images (MAG... IDs)** — only accessible via signed thumbnail URLs (can't export directly):
- `MAGXM9UEssA` — "Black logo - no background.svg" (3162×438, full wordmark)
- `MAGXM3ULmcs` — "White logo - no background.svg" (white wordmark)
- `MAGW7ZMyj5M` — "Copy of JGG-Brand-Logo.svg" (375×375 square logo mark)
- `MAGW7JcpqvQ` — "JGG-Brand-Logo-White.svg"
- `MAG53cRURO8` — Product packaging PNG (1271×1766, 3-pack shot)
- `MAGdNIs2X4Y` — Grip rolls PNG (2743×3644, 12-pack shot)

**Design files (D... IDs)** — can be exported via `export-design` MCP tool:
- `DAGXM1ugNeg` — "large-logo-vector" (823×242) — black wordmark on white bg
- `DAGW7KOC9Pw` — "JGG-Brand-Logo" (447×447) — black logo mark
- `DAGW7MNKBWc` — "JGG-Brand-Logo-White" (447×447) — white logo mark
- `DAGXG--H__M` — "Copy of JGG-Brand-Logo-White" (447×447)
- `DAG53DYhX5Q` — "Price List Poster" (794×1123) — has product photos embedded
- `DAG53hvHP-k` — "Background + Price List Poster" (794×1123)
- `DAGWTVZNTNM` — "www.justgoodgrips.com" banner (1286×378)
- `DAG5UVN1xNk` — Lifestyle/court design (exported as `stores-bg.jpg`, low quality — not in use)

### Known Canva Limitations (Free Plan)

- ❌ Cannot export PNG with transparent background (paid feature)
- ❌ Cannot export at "pro" quality (paid feature)
- ✅ Can export PNG at "regular" quality with white/opaque background
- ⚠️ Exported JPGs from Canva designs tend to be low quality — prefer using locally sourced photos where possible

### Next Steps for High-Quality Images

**For logos:** Export the logo designs (`DAGXM1ugNeg`, `DAGW7KOC9Pw`, `DAGW7MNKBWc`) using `mcp__claude_ai_Canva__export-design` with `format: { type: "png", export_quality: "regular", lossless: true }`. They will have a white background — this works fine for:
- `logo-black.png` (black text on white bg) → displayed in header which has a white bg
- `logo-mark.png` (black mark on white bg) → displayed in the About section which has a light bg
- `logo-white.png` — white text on white bg won't work; **needs a design with a dark/black background** or use the thumbnail as a fallback

**For product images:** The raw uploaded assets (`MAG53cRURO8`, `MAGdNIs2X4Y`) are the cleanest product shots. Export designs `DAG53DYhX5Q` or `DAG53hvHP-k` (Price List Poster) to extract product imagery, or ask the user to manually export/download the uploaded images from Canva at full resolution and place them in `images/`.
