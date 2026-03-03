# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brand Context

All conversations in this repository are in the context of **Just Good Grips**, an Australian tennis overgrip brand. When making decisions about copy, tone, design, or product details, refer to the brand's public presence:

- Website: https://www.justgoodgrips.com/about
- Instagram: https://www.instagram.com/justgoodgrips/

## Project Overview

Just Good Grips is a static single-page e-commerce site for an Australian tennis overgrip brand. No build tools, no frameworks, no package manager — it's plain HTML, CSS, and vanilla JS served directly in a browser.

## Development

Open `index.html` directly in a browser — no server or build step required. For local development with live reload, any static file server works (e.g. `npx serve .` or VS Code's Live Server extension).

## Architecture

Three files make up the entire site:

- **`index.html`** — Single-page layout with sections: Header → Hero → Announcement Bar → Products → Features → Testimonials → About → Footer
- **`style.css`** — All styles. CSS custom properties (tokens) are defined at the top in `:root`. The design is Wilson-inspired, minimal, black/white with tennis-ball green (`#c8e617`) as the accent.
- **`script.js`** — Minimal vanilla JS: sticky header shadow on scroll, mobile nav toggle, smooth-scroll for anchor links, and a guard that alerts if Stripe links haven't been replaced.

## Stripe Integration

Checkout is handled by **Stripe Payment Links** (no backend). The two buy buttons in `index.html` have placeholder `href` values:
- `YOUR_STRIPE_3_PACK_LINK` — 3 Pack ($10 AUD)
- `YOUR_STRIPE_12_PACK_LINK` — 12 Pack ($25 AUD)

Replace these with actual `https://buy.stripe.com/...` URLs to enable purchasing.

## Product Images

Images live at:
- `images/grip-pack-3.jpg` — currently a low-res thumbnail (143×200px), needs replacing
- `images/grip-pack-12.jpg` — currently a low-res thumbnail (150×200px), needs replacing
- `images/logo-black.png` — currently a low-res thumbnail (200×27px), needs replacing
- `images/logo-white.png` — currently a low-res thumbnail (200×27px), needs replacing
- `images/logo-mark.png` — currently a low-res thumbnail (200×200px), needs replacing

The `onerror` handler on each product `<img>` adds `.img-fallback` to show an SVG placeholder when the image fails to load.

## HTML/CSS Changes Already Made

The logo and about-section placeholders have been updated to use `<img>` tags:

- **Header logo**: `<img src="images/logo-black.png" alt="Just Good Grips" class="logo-img">`
- **Footer logo**: `<img src="images/logo-white.png" alt="Just Good Grips" class="logo-img">`
- **About section**: `<img src="images/logo-mark.png" alt="Just Good Grips" class="about-visual-img">` inside `.about-visual-box`

CSS additions in `style.css`:
- `.logo-img { height: 36px; width: auto; display: block; }`
- `.about-visual-img { width: 55%; height: auto; }`
- Removed `font-size: 5rem` from `.about-visual-box`

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

### Known Canva Limitations (Free Plan)

- ❌ Cannot export PNG with transparent background (paid feature)
- ❌ Cannot export at "pro" quality (paid feature)
- ✅ Can export PNG at "regular" quality with white/opaque background

### Next Steps for High-Quality Images

**For logos:** Export the logo designs (`DAGXM1ugNeg`, `DAGW7KOC9Pw`, `DAGW7MNKBWc`) using `mcp__claude_ai_Canva__export-design` with `format: { type: "png", export_quality: "regular", lossless: true }`. They will have a white background — this works fine for:
- `logo-black.png` (black text on white bg) → displayed in header which has a white bg
- `logo-mark.png` (black mark on white bg) → displayed in the About section which has a light bg
- `logo-white.png` — white text on white bg won't work; **needs a design with a dark/black background** or use the thumbnail as a fallback

**For product images:** The raw uploaded assets (`MAG53cRURO8`, `MAGdNIs2X4Y`) are the cleanest product shots. Export designs `DAG53DYhX5Q` or `DAG53hvHP-k` (Price List Poster) to extract product imagery, or ask the user to manually export/download the uploaded images from Canva at full resolution and place them in `images/`.

## CSS Conventions

- All design tokens (colours, radii, shadows, transition) live in `:root` — always use these variables, never hardcode values.
- Responsive breakpoints: tablet ≤ 960px, mobile ≤ 640px, very small ≤ 380px.
- Button variants: `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-buy`, `.btn-buy--featured`.
- Featured product card uses `.product-card--featured` which adds a green top border via `::before`.
