# TrendVaulta — Data Model Audit

**Date:** 2026-08-07  
**Source:** Mongoose models under `apps/api/models/`  
**Rule:** Do not migrate production schemas until impact is reviewed. This document records **current**, **problems**, **canonical proposal**, and **migration impact**.

---

## 1. Inventory of models (`code`)

| Model file | Collection | Purpose |
|------------|------------|---------|
| `User.js` | `users` (default) | Auth identity, roles, Stripe customer id |
| `Product.js` | `products` | Catalog SKU / merchandising |
| `Brand.js` | `brands` | Brand catalog |
| `Order.js` | `orders` (default) | Checkout / fulfillment |
| `Coupon.js` | `coupons` | Promotions |
| `Wishlist.js` | `wishlists` | Per-user saved products |
| `Review.js` | `reviews` | Ratings/comments |
| `StripeWebhookEvent.js` | `stripewebhookevents` (default) | Webhook idempotency |

**Missing (MVP SHOULD / POST):** dedicated `Address`, `Cart` (server), audit log.

---

## 2. User

### Current schema
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | String | yes | unique |
| username | String | yes | not unique at schema level |
| password | String | yes | bcrypt hashed |
| roles | `[String]` enum user/admin/moderator | | array (**not** singular `role`) |
| stripeCustomerId | String | | default `''` |
| timestamps | createdAt, updatedAt | | |

**JWT payload:** `{ id: String(_id), roles }` — note `id` not `_id`.

**Indexes:** email unique.

**Ownership:** self for profile; admin for `/users` CRUD.

**Lifecycle:** no soft-delete / disable flag.

**Concurrency:** N/A beyond unique email.

### Problems
- Client can influence `roles` at register (app-level).
- Website cookie uses singular `userRole`; types package uses singular `role`.
- Username uniqueness only enforced in profile update query, not schema unique.

### Canonical proposal
- Keep `roles: string[]`.
- Add optional `isActive: Boolean` default true (**BUSINESS DECISION REQUIRED**).
- Consider `username` unique index.
- Never persist client-supplied roles on public register.

### Migration impact
Low if only adding `isActive` with default. Role array already correct — do not rename to `role`.

---

## 3. Product

### Current schema (summary)
| Field | Type | Notes |
|-------|------|-------|
| title, description, cover | String | required |
| brand | ObjectId → Brand | required |
| price, basePrice | Number | required; basePrice defaults to price |
| images | [String] | |
| category | enum | makeup, perfumes, clothing, skincare, accessories, home |
| subcategory | String | required |
| variants[] | size, color, colorCode, stock, price, sku | embedded |
| material, weight, dimensions, shippingInfo | mixed | |
| stock | Number | product-level |
| sku | String | unique sparse |
| averageRating, reviewCount | Number | denormalized |
| isActive, featured | Boolean | |
| timestamps | | |

**Indexes:** sku unique sparse; no compound text index confirmed in schema file.

**Concurrency-sensitive:** `stock`, `variants[].stock`, rating aggregates.

### Problems
- Dual stock locations without documented precedence.
- Variant SKU not uniquely indexed.
- `getProductById` does not hide inactive.

### Canonical proposal
- Keep embedded variants for V1 (no separate ProductVariant collection unless scale requires).
- Document stock precedence (variant-first when variants exist).
- Add indexes: `{ category: 1, isActive: 1 }`, `{ brand: 1, isActive: 1 }`, text on title optional Post-MVP.

### Migration impact
Additive indexes only → low. Changing variant shape → medium (seeder + admin forms).

---

## 4. Brand

| Field | Notes |
|-------|-------|
| name, slug | required, unique |
| description, logo, website, country | optional |
| isActive, featured | booleans |
| timestamps | |

Public list filters `isActive: true` in controller.

**Canonical:** keep as-is. Soft-deactivate via `isActive` (already pattern).

---

## 5. Order + OrderItem + ShippingAddress

### Current OrderItem (`code` — PROBLEM)
```
template: ObjectId ref Template (required)
title, price, qty, cover
```
Joi still validates `template` / `templateId`.

### Controllers write (`code`)
```
productId, title, price, qty, cover, variant?
```

### Order fields
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId → User | required |
| items | [OrderItem] | min 1 |
| shippingAddress | embedded | required |
| status | enum | pending, paid, shipped, delivered, canceled |
| itemsPrice, shippingPrice, taxPrice, totalPrice | Number | |
| paymentStatus | enum | unpaid, pending, paid, failed, refunded |
| stripeSessionId, paymentIntentId | String | |
| paidAt | Date | |
| timestamps | | |

**Ownership:** `user`.  
**Lifecycle:** pending → paid (implemented); further statuses lack admin API.  
**Soft-delete:** none.  
**Concurrency:** paymentStatus transitions; stock not tied yet.

### Problems
1. Template vs productId schema/controller split — **BROKEN**.  
2. `serializeOrder` still maps `template` → `templateId`.  
3. No `couponCode` / `discountAmount` persisted.  
4. No `processing` status (may be fine).

### Canonical OrderItem proposal
```
productId: ObjectId ref Product (required)
title: String
price: Number          // snapshot at purchase
qty: Number
cover: String
variant?: { size?, color?, colorCode?, sku? }
```

### Canonical Order additions (recommended V1)
```
discountAmount: Number default 0
couponCode: String optional
couponId: ObjectId optional
```

### Migration impact
| Data | Action |
|------|--------|
| Existing orders with `items.template` | Migration script: copy `template` → `productId`; dual-read in serializer during transition |
| New writes | Only `productId` |
| Joi | Require `productId` |
| Drop Template refs | After backfill + verification |

**Do not** rename collection. Impact: **high** if production data exists (`missing info` on prod contents).

---

## 6. Wishlist

### Current
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | required |
| template | ObjectId ref Template | required — **stale name** |
| timestamps | | |
| indexes | `{ user: 1, template: 1 }` unique; user; template | |

Controller reads/writes **`product`**.

### Array vs document-per-product

| Option | Pros | Cons |
|--------|------|------|
| `user + products[]` | Single doc per user | Contended updates; harder unique; large arrays |
| `user + product` (one doc) | Matches add/remove/check queries; unique index | More docs |

**Recommendation (`code` query patterns):** keep **one document per (user, product)**. Rename `template` → `product`, rebuild unique index `{ user: 1, product: 1 }`.

### Migration impact
Rename field + drop old index + create new unique index. Duplicate risk if mixed fields exist. **Medium.**

---

## 7. Review

### Current
| Field | Notes |
|-------|-------|
| user | ObjectId |
| template | ObjectId ref Template — **stale** |
| rating | 1–5 |
| comment | 3–1000 |
| unique | `{ user: 1, template: 1 }` |

Controller/Joi mismatch: runtime uses `product`; Joi create requires `template`.

### Canonical
```
user, product (ObjectId ref Product), rating, comment
unique (user, product)
```

### Migration impact
Same pattern as Wishlist. **Medium.** Update denormalized Product rating after backfill if needed.

---

## 8. Coupon

| Field | Notes |
|-------|-------|
| code | unique, uppercase |
| discountType | percentage \| fixed |
| discountValue | Number |
| expirationDate | Date |
| usageLimit | Number \| null |
| usedCount | Number |
| minimumOrderAmount | Number |
| isActive | Boolean |
| description | optional |
| timestamps | |

**Concurrency-sensitive:** `usedCount` increments — use conditional update `usedCount < usageLimit` when limit set.

**Missing:** per-user redemption collection; `maximumDiscount` cap field.

**Canonical V1:** keep global counter; increment only on successful paid order.

---

## 9. StripeWebhookEvent

| Field | Notes |
|-------|-------|
| eventId | String unique required |
| timestamps | |

**Purpose:** idempotency key store.  
**Lifecycle:** insert before processing; delete on processing failure to allow retry `code`.  
**Canonical:** keep; optionally store `type`, `processedAt`.

---

## 10. ID naming conventions

| Context | Current | Canonical |
|---------|---------|-----------|
| Mongo `_id` | everywhere | keep |
| JWT `id` | stringified `_id` | keep; map in clients |
| Order item | `template` / `templateId` / `productId` mixed | **`productId` only** |
| FE AdminUser | `_id` + `roles[]` | keep |
| Shared `@craftify/types` User.role singular | stale | align to `roles[]` |

---

## 11. Soft delete summary

| Entity | Soft delete today | Proposal |
|--------|-------------------|----------|
| Product | `isActive` | keep |
| Brand | `isActive` | keep |
| Coupon | deactivate on delete | keep |
| User | none | optional `isActive` |
| Order | none (status canceled) | keep status machine |
| Review / Wishlist | hard delete | keep |

---

## 12. Priority schema work order

1. Order items → `productId` (+ serializer)  
2. Wishlist `product` + index  
3. Review `product` + Joi + index  
4. Persist coupon snapshot on Order  
5. User `isActive` if product accepts decision  
6. Indexes for catalog query patterns  
