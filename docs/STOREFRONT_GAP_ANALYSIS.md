# TrendVaulta Storefront Gap Analysis

**Date:** 2026-08-07  
**Source:** `apps/website` inspection + Amazon UX audit mapping  
**Goal:** Classify what exists vs what to add as frontend demo vs backend later

---

## Classification legend

| Tag | Meaning |
|---|---|
| ALREADY EXISTS | Shipped and usable |
| PARTIAL | Present but incomplete / wrong domain copy |
| MISSING FRONTEND | UI not built; can demo without API |
| MISSING BACKEND | Needs API/models |
| DEMO-ONLY FOR NOW | Frontend mock wired; replace with API later |
| OUT OF SCOPE | Not for this batch |

---

## Homepage

| Candidate | Status | Notes |
|---|---|---|
| Hero + search | PARTIAL | Still Craftify template copy; links to `/templates` |
| Popular categories | PARTIAL | Template categories; wrong hrefs |
| Featured / best sellers grid | MISSING FRONTEND | `useProducts` on home unused |
| Trust / service strip | PARTIAL → DEMO | `WhyChooseUs` unused + Craftify; replace with retail strip |
| Deals / offers rail | DEMO-ONLY FOR NOW | No deals API |
| Featured brands | DEMO-ONLY FOR NOW | Brands API exists elsewhere; homepage demo first |
| Testimonials | ALREADY EXISTS | Social proof block |
| CTA section | PARTIAL | Craftify copy |
| Stats bar | PARTIAL | Unused; Craftify metrics |
| Recently viewed | DEMO-ONLY FOR NOW | localStorage |
| Recommendations “inspired by” | DEMO-ONLY FOR NOW | Stub carousel |
| Bundles / FBT | MISSING FRONTEND | P2 |
| Editorial lookbook | MISSING FRONTEND | P2 |
| Homepage CMS modules | MISSING BACKEND | See backend backlog |

---

## Catalog / discovery

| Candidate | Status | Notes |
|---|---|---|
| Product listing page | ALREADY EXISTS | `/products` |
| Search / filters / sort | PARTIAL | Basic query params; not Amazon-dense facets |
| Product cards | PARTIAL | Sale % + OOS; missing bestseller/low-stock badges |
| Empty / loading states | PARTIAL | Present on some pages |

---

## Product detail

| Candidate | Status | Notes |
|---|---|---|
| Gallery | ALREADY EXISTS | |
| Price / discount | ALREADY EXISTS | |
| Variants | PARTIAL | UI present; checkout rules separate |
| Add to cart / buy now | ALREADY EXISTS | |
| Ratings summary | ALREADY EXISTS | |
| Related products | PARTIAL / MISSING | Not Amazon-class rails |
| Q&A tabs | OUT OF SCOPE | |
| Recently viewed tracking | DEMO-ONLY FOR NOW | Track on PDP |

---

## Cart / checkout / profile

| Candidate | Status | Notes |
|---|---|---|
| Cart | ALREADY EXISTS | Do not break |
| Checkout + Stripe | ALREADY EXISTS | OUT OF SCOPE for demo work |
| Coupons | ALREADY EXISTS | Server-authoritative |
| Wishlist | ALREADY EXISTS | |
| Orders / profile | ALREADY EXISTS | |
| Trust near pay CTA | PARTIAL | Keep; no Stripe changes |

---

## Shared UI / data

| Candidate | Status | Notes |
|---|---|---|
| Button, layout chrome | ALREADY EXISTS | |
| Footer | PARTIAL | Still Craftify branding + `/templates` |
| Demo storefront data module | MISSING FRONTEND → add | `src/data/demoStorefront.ts` |
| Header account/cart | ALREADY EXISTS | |

---

## This batch decisions

**In scope (frontend demo + retail copy polish):**
- Trust strip, deals rail, featured products, featured brands  
- Product card badge extensions  
- Retailize hero / categories / WhyChooseUs / CTA / footer shop links  
- Recently viewed (localStorage)  

**Out of scope:**
- Backend APIs, Stripe, auth, order mutations  
- Recommendation ML infrastructure  
- Scraping or Amazon visual clone  
