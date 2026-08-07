# Amazon UX Audit → TrendVaulta Adaptation

**Date:** 2026-08-07  
**Method:** Live inspection of https://www.amazon.com/ (homepage structure via accessibility tree + viewport). Patterns below are **UX/IA observations only** — not a brand or content clone.  
**Scope:** Homepage chrome + merchandising modules; product discovery / PDP / cart patterns summarized from common retail IA and Amazon’s visible entry points (Account, Orders, Cart, Deals, category tiles).

---

## 1. Observed site map / section inventory

### A1. Global chrome
| Element | Observed behavior |
|---|---|
| Logo | Left brand mark → home |
| Delivery / location | “Deliver to [region]” with confirm popover (availability/pricing context) |
| Search | Dominant center search + department scoped combobox (“All Departments”) + submit |
| Language / region | EN + country/currency cues in header and footer |
| Account | “Hello, sign in / Account & Lists” flyout (lists, orders, history, recommendations) |
| Orders | “Returns & Orders” primary entry |
| Cart | Cart count badge |
| Secondary nav | “All” mega menu + utility links (Today’s Deals, Gift Cards, Customer Service, …) |
| Accessibility | Skip links + keyboard shortcuts (search, cart, home, orders) |

### A2. Homepage sections (top → bottom, observed)
1. **Hero / promo carousel** — full-bleed campaign slides (e.g. seasonal “Back to School”), prev/next controls  
2. **Category / deal tile grid** — 2×2 style cards with 4 image shortcuts + “See all / Shop …” CTA  
3. **Horizontal product/deal rails** — best sellers / “for you” / trend carousels  
4. **Thematic merchandising blocks** — beauty, fashion, home, travel, fitness, gaming (repeatable module)  
5. **Back to top** utility  
6. **Footer help columns** — Get to Know Us / Make Money / Payment Products / Let Us Help You  
7. **Footer legal + locale** — Conditions, Privacy, language/currency/country  

### A3–A5. Discovery / PDP / cart (pattern summary)
Not fully walked in this session; treated as standard Amazon-class retail IA:

| Surface | Patterns |
|---|---|
| Discovery | Facets, sort, dense product cards (image, price, rating, badges), urgency/social proof |
| PDP | Gallery, price/discount, variants, stock, ATC / Buy now, ratings summary, related rails |
| Cart / checkout | Clear order summary, coupon entry, shipping messaging, trust near pay CTA, light upsells |

### A6. Service / utility modules (adapt naming for TrendVaulta)
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
| Footer | Multi-column link matrix | Accordion / stacked lists |

---

## 3. Pattern → TrendVaulta mapping

| Amazon pattern | Business value | Exists in TrendVaulta? | Recommendation | Priority |
|---|---|---|---|---|
| Dominant search in chrome/hero | Fast intent capture | Partial (hero search; header may vary) | Keep TrendVaulta search; retail copy | P0 |
| Account / Orders / Cart entry | Commerce orientation | Partial (auth, cart, orders exist) | Keep; clarify labels | P0 |
| Delivery / location messaging | Expectation setting | Missing | Soft “ships to” trust copy (demo) — not geo engine | P1 |
| Mega / department nav | Browse breadth | Partial (nav + categories stale Craftify) | Retail category shortcuts | P0 |
| Hero promo carousel | Campaign conversion | Partial (static Craftify hero) | Retail hero + CTAs to `/products` | P0 |
| Deal / offer rail | Urgency & discovery | Missing frontend | Demo deals rail | P0 |
| Category shortcut tiles | Guided browse | Partial (wrong domain: templates) | Beauty/fashion categories | P0 |
| Best sellers / featured products | Social proof + sales | Missing on homepage (API fetched unused) | Wire featured products grid | P0 |
| “For you” / recommendations | Repeat engagement | Missing | Demo carousel stub | P1 |
| Recently viewed | Continuity | Missing | localStorage demo | P1 |
| Brand spotlight | Brand equity | Partial (brands API elsewhere) | Demo featured brands strip | P0 |
| Trust / service strip | Reduce purchase anxiety | Partial (WhyChooseUs unused + Craftify copy) | Retail trust strip | P0 |
| Bundles / FBT | AOV lift | Missing | Demo later | P2 |
| Editorial / lookbook | Lifestyle brand | Missing | Post-MVP | P2 |
| Helpful footer | Self-serve support | Partial (Craftify links to `/templates`) | Retail + trust links | P1 |
| Product card badges | Scanability | Partial (sale %, OOS) | Add bestseller / low stock (demo flags) | P0 |
| Wishlist | Consideration set | Exists (API + UI elsewhere) | Keep; don’t rebuild | — |
| Secure checkout / Stripe | Conversion | Exists | Do not touch in this phase | — |

---

## 4. Must-have for V1 storefront polish

1. Retail-correct homepage composition (hero → trust → categories → deals → featured products → brands → social proof → CTA)  
2. Trust/service strip (shipping, returns, secure payment, support)  
3. Featured / best-seller product rail using **real** product API where available  
4. Demo deals + featured brands modules  
5. Product card badge polish (sale already; + bestseller / low stock)  
6. Remove remaining Craftify/template IA from surfaces users hit first  

---

## 5. Nice-to-have / post-MVP

- Personalized recommendations engine  
- Recently viewed sync across devices  
- CMS-driven homepage modules  
- Bundles / frequently bought together  
- Gift finder / occasion modules  
- Editorial lookbooks  
- Delivery-to-address availability engine  

---

## 6. Explicit “Do not copy” list

- Amazon logos, wordmarks, smile arrow, packaging icons  
- Amazon orange/yellow CTA system as brand identity  
- Amazon proprietary copy (“Spend less. Smile more.”, Prime-specific claims, etc.)  
- Scraped product titles, images, prices, or review text from Amazon  
- Exact visual clone (nav colors, layout pixel-matching, Prime badge lookalikes)  
- Amazon trademarked program names as TrendVaulta features (Prime, Amazon Basics, etc.)  

**Adaptation rule:** Borrow **information architecture and interaction patterns** only; keep TrendVaulta branding, copy, and product data.
