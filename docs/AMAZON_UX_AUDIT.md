# Amazon UX Audit → TrendVaulta Adaptation

**Date:** 2026-08-07 (refreshed)  
**Method:** Live inspection of https://www.amazon.com/ — homepage, search results (`/s?k=…`), empty cart (`/gp/cart/view.html`) via accessibility tree + viewport screenshots.  
**Scope:** UX / information-architecture patterns only. **Not** a brand, content, or visual clone.

---

## 1. Observed site map / section inventory

### A1. Global chrome

| Element | Observed behavior |
|---|---|
| Logo | Left brand mark → home |
| Delivery / location | “Deliver to [region]” (geo/IP-aware availability context) |
| Search | Dominant center field + department-scoped combobox (“All Departments”) + high-contrast submit; “Agent Search” secondary action present |
| Language / region | EN + flag in header; currency/country in footer |
| Account | “Hello, sign in / Account & Lists” flyout (lists, orders, history, recommendations) |
| Orders | “Returns & Orders” primary entry |
| Cart | Cart count badge (keyboard shortcut exposed) |
| Secondary nav | “All” mega-menu + utility links (Today’s Deals, Gift Cards, Customer Service, Registry, …) |
| Accessibility | Skip links + keyboard shortcuts (search, cart, home, orders) |

### A2. Homepage sections (top → bottom, observed)

| # | Section | Purpose | Content types | Desktop | Mobile (expected) | CTA | Why it converts | TrendVaulta equivalent |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero / promo carousel | Campaign capture | Seasonal full-bleed slides, prev/next | Wide carousel | Swipe, taller crop | Slide → category/deal | Urgency + seasonal intent | HeroSection (static retail, not carousel) — PARTIAL |
| 2 | Category / deal tile cards | Guided browse | 2×2 image tiles + “See all / Shop …” | Multi-column cards | Stacked 1–2 cols | Tile → PLP | Reduces decision paralysis | PopularCategories — DEMO |
| 3 | Horizontal product rails | Best sellers / “for you” | Product image carousels | Peek scroll | Touch scroll | Product → PDP | Social proof + continuity | Featured + Inspired + Recently viewed — DEMO/API mix |
| 4 | Thematic merch blocks | Department storytelling | Beauty, fashion, home, travel, fitness… | Repeating modules | Same, stacked | “Discover more” | Lifestyle affinity | DealsRail + brands + lookbook — DEMO |
| 5 | Back to top | Navigation utility | Button | Sticky utility | Same | Scroll top | Long-page recovery | Browser default / unused |
| 6 | Footer help columns | Self-serve | Get to Know Us / Help / Legal / Locale | Multi-column | Accordion/stack | Policy links | Trust + support deflection | Footer — ALREADY (retailized) |

### A3. Product discovery (search results — observed)

| Pattern | Observation |
|---|---|
| Results summary | “1–48 of over N results for ‘query’” with query highlight |
| Facets / shortcuts | Left rail “Popular Shopping Ideas” (e.g. Face, Dry Skin) + deeper filters |
| Sort | Featured, Price, Avg. Customer Review, Newest, Best Seller, … |
| Product cards | Large image, brand-forward, price, ratings; **editorial badges** (e.g. “Overall Pick”) |
| Sponsored | Labeled sponsored slots interleaved |
| Empty / loading | Dense skeleton / progressive cards (standard retail) |

### A4. Product detail (pattern summary)

Not fully walked in this session (viewport constraints). Standard Amazon-class PDP IA used for mapping:

| Pattern | Typical behavior |
|---|---|
| Image gallery | Thumbnails + main image / zoom |
| Price / discount | List vs sale, savings callout |
| Variants | Size/color/style selectors |
| Stock | In-stock / low / ships messaging |
| Primary actions | Add to cart + Buy now near buy box |
| Reviews | Stars + count + review body below fold |
| Related / FBT | “Frequently bought together” / similar rails |
| Trust near ATC | Shipping, returns, secure payment cues |

### A5. Cart + checkout trust (empty cart — observed)

| Pattern | Observation |
|---|---|
| Empty state | Clear heading + lifestyle illustration + “Shop today’s deals” recovery link |
| Auth CTAs | Sign in (primary) / Sign up (secondary) when anonymous |
| Promo messaging | Gift card / promo code deferred to payment step (copy near cart) |
| Saved for later | Separate empty bucket (“No items saved for later”) |
| Upsells | “See personalized recommendations” when signed out |
| Trust | Price/availability disclaimer; help footer always present |

### A6. Service / utility modules (adapt naming)

- Fast / reliable shipping messaging  
- Easy returns  
- Secure checkout  
- Customer support entry  
- Order tracking / Returns & Orders  
- Gift / offers / deals rail  
- Wishlist / lists  
- Help, shipping & returns policies  

---

## 2. Desktop vs mobile notes

| Area | Desktop | Mobile (expected / standard) |
|---|---|---|
| Search | Always dominant in header | Often sticky; department selector may collapse |
| Mega menu | “All” side panel | Hamburger drawer |
| Hero | Wide carousel | Same content, taller crop, swipe |
| Category tiles | Multi-column card grid | 1–2 columns, stacked |
| Product rails | Horizontal scroll with peek | Same, touch-first |
| Search facets | Persistent left column | Drawer / bottom sheet |
| Cart empty | Two-column (art + CTAs) | Stacked |
| Footer | Multi-column link matrix | Accordion / stacked lists |

---

## 3. Pattern → TrendVaulta mapping

| Amazon pattern | Business value | Exists in TrendVaulta? | Recommendation | Priority |
|---|---|---|---|---|
| Dominant search in chrome/hero | Fast intent capture | Yes (Navbar + Hero) | Keep; polish only | P0 ✓ |
| Account / Orders / Cart entry | Commerce orientation | Yes | Keep; clarify labels | P0 ✓ |
| Delivery / location messaging | Expectation setting | Soft trust copy only | Demo trust strip — not geo engine | P1 ✓ demo |
| Mega / department nav | Browse breadth | Partial (nav shortcuts) | Keep retail categories | P0 ✓ |
| Hero promo carousel | Campaign conversion | Partial (static hero) | Optional carousel later | P1 |
| Deal / offer rail | Urgency & discovery | DEMO-ONLY | Swap to `/api/offers` later | P0 ✓ demo |
| Category shortcut tiles | Guided browse | DEMO-ONLY | Keep; wire CMS later | P0 ✓ demo |
| Best sellers / featured products | Social proof + sales | Wired to products API | Add `sort=bestselling` later | P0 ✓ |
| “For you” / recommendations | Repeat engagement | DEMO stub | Real recs API later | P1 ✓ demo |
| Recently viewed | Continuity | localStorage demo | Sync API later | P1 ✓ demo |
| Brand spotlight | Brand equity | DEMO strip | `brands?featured=true` later | P0 ✓ demo |
| Trust / service strip | Reduce anxiety | DEMO strip | CMS/trust content later | P0 ✓ demo |
| Bundles / complete the look | AOV lift | DEMO on PDP (this batch) | Bundles API later | P2 |
| Editorial / lookbook | Lifestyle brand | DEMO on home (this batch) | CMS modules later | P2 |
| Helpful footer | Self-serve support | Yes (retail links) | Keep | P1 ✓ |
| Product card badges | Scanability | Sale + demo bestseller/low/new | Product.badges from API | P0 ✓ demo |
| PLP facets density | Findability | PARTIAL | Enrich filters later | P1 |
| Wishlist | Consideration set | Exists | Keep | — |
| Secure checkout / Stripe | Conversion | Exists | **Do not touch** | OUT |

---

## 4. Must-have for V1 storefront polish

1. Retail homepage composition: hero → trust → categories → deals → featured → brands → recently viewed → inspired → social proof → CTA  
2. Trust/service strip (shipping, returns, secure payment, support)  
3. Featured product rail from real product API  
4. Demo deals + featured brands  
5. Product card badge polish (sale + bestseller / low stock / new)  
6. No Craftify/template IA on first-hit surfaces  

**Status:** Items 1–6 implemented as frontend (demo where marked).

---

## 5. Nice-to-have / post-MVP

- Hero promo carousel (CMS-driven)  
- Personalized recommendations engine  
- Recently viewed cross-device sync  
- Dense PLP facets  
- Bundles API (replace PDP demo)  
- Gift finder / occasion modules  
- Editorial CMS lookbooks  
- Delivery-to-address availability engine  

---

## 6. Explicit “Do not copy” list

- Amazon logos, wordmarks, smile arrow, packaging icons  
- Amazon orange/yellow CTA system as brand identity  
- Amazon proprietary copy (“Spend less. Smile more.”, Prime-specific claims, etc.)  
- Scraped product titles, images, prices, or review text from Amazon  
- Exact visual clone (nav colors, layout pixel-matching, Prime badge lookalikes)  
- Amazon trademarked program names as TrendVaulta features (Prime, Amazon Basics, etc.)  

**Adaptation rule:** Borrow **information architecture and interaction patterns** only; keep TrendVaulta branding, original copy, and first-party / placeholder product data.
