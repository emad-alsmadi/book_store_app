# TrendVaulta — Business Rules & Acceptance Criteria

**Date:** 2026-08-07  
**Basis:** Confirmed behavior from `apps/api` controllers/models/routes and website checkout/cart clients.  
**Legend:** `code` · `docs` · `inferred` · `recommended` · `BUSINESS DECISION REQUIRED`

Rules below describe **current implemented behavior** where known, then **recommended V1 defaults** when the repo does not establish a rule. Do not treat recommended defaults as live product law until accepted.

---

## 1. Authentication

### 1.1 Registration
| Aspect | Detail |
|--------|--------|
| Actor | Anonymous visitor |
| Preconditions | Valid email, username, password (≥8) |
| Main flow | Validate Joi → reject duplicate email → bcrypt hash → create user → return JWT + user fields (no password) |
| Validation | `validateRegisterUser` in `models/User.js` |
| Authorization | Public |
| Side effects | User document created |
| Failure | Duplicate email → 400 `"This user already registered"`; validation → 400 |
| **code issue** | Client may send `roles`; controller uses `req.body.roles \|\| ['user']` — privilege escalation risk |
| Acceptance | Duplicate email blocked; password never returned; new users are `roles: ['user']` only |

**BUSINESS DECISION REQUIRED:** Ignore client `roles` always.  
**Recommended default:** Server forces `['user']` on public register.

### 1.2 Login — invalid credentials
| Aspect | Detail |
|--------|--------|
| Actor | Registered user |
| Main flow | Find by email → bcrypt compare → JWT |
| Failure | Unknown email or bad password → 400 `"invalid email or password"` (same message) `code` |
| Acceptance | No email enumeration via distinct messages on login (current behavior is OK) |

### 1.3 Disabled user
| Aspect | Detail |
|--------|--------|
| **code** | No `isActive` / disabled flag on User |
| **BUSINESS DECISION REQUIRED** | Whether admins can disable accounts |
| **Recommended default** | Add `isActive` (default true); login rejects inactive with generic invalid-credentials message |

### 1.4 Expired / invalid token
| Aspect | Detail |
|--------|--------|
| Actor | Any authenticated request |
| Behavior | `verfiyToken` JWT verify failure → 401 `"Token is not valid!"`; missing token → 401 `"You are not authenticated!"` `code` |
| JWT TTL | `expiresIn: '30d'` in `User.generateToken` `code` |
| Acceptance | Protected routes reject expired/malformed tokens |

### 1.5 Authorization failures
| Aspect | Detail |
|--------|--------|
| Behavior | `checkRolePermission` → 403 with required permission `code` |
| **code issue** | Permission map still Craftify `templates:*` while routes need `products:*` etc. — effective admin denial |
| Acceptance (V1) | Admin with `admin` role can perform documented admin mutations |

### 1.6 Password reset — expiry & reuse
| Aspect | Detail |
|--------|--------|
| Actor | User with known email |
| Main flow | Forgot → JWT signed with `JWT_SECRET_KEY + user.password`, 5m expiry → email link → reset verifies token → hash new password → save `code` |
| Expiry | 5 minutes `code` |
| Reuse | After password change, old token secret changes (password in HMAC material) → prior tokens fail `code` (effective single-use) |
| Failure | Unknown email → 404 (enumerates existence) `code` |
| Acceptance | Expired token rejected; token after successful reset rejected |
| **Recommended hardening** | Always return generic “if email exists, link sent”; rate-limit forgot endpoint |

### 1.7 Logout
| Aspect | Detail |
|--------|--------|
| Behavior | Stateless API `POST /auth/logout` returns 200; client clears cookies `code` |
| Acceptance | Client removes token; API does not maintain server session denylist (none exists) |

### 1.8 Refresh tokens
| Aspect | Detail |
|--------|--------|
| **code** | Not implemented — do not claim support |

---

## 2. Products

### 2.1 Active / inactive
| Aspect | Detail |
|--------|--------|
| Public list | Query forces `isActive: true` `code` (`product.controller.js`) |
| Get by id | No `isActive` filter on `getProductById` — inactive may still be fetchable by id `code` |
| **BUSINESS DECISION REQUIRED** | Detail page for inactive products |
| **Recommended default** | 404 for non-admin when `isActive === false` |

### 2.2 Stock & out-of-stock
| Aspect | Detail |
|--------|--------|
| Fields | `stock` on product; `variants[].stock` `code` |
| Checkout | Controllers do **not** reject qty > stock today `code` |
| Decrement | Not implemented on paid `code` |
| **BUSINESS DECISION REQUIRED** | Variant vs product stock authority |
| **Recommended default** | If `variants.length > 0`, selected variant stock is authoritative; else `product.stock`. Reject checkout when insufficient. Atomic `$inc` with condition `stock >= qty` on paid. |

### 2.3 Variants
| Aspect | Detail |
|--------|--------|
| Model | Embedded array: size, color, colorCode, stock, price, sku `code` |
| Checkout | Optional `variant` accepted in payment normalize path but not validated against catalog `code` |
| Acceptance (V1) | If client sends variant, it must match an existing variant; price from variant.price if set else product.price |

### 2.4 SKU uniqueness
| Aspect | Detail |
|--------|--------|
| Product SKU | `unique: true, sparse: true` `code` |
| Variant SKU | No unique index `code` |
| **BUSINESS DECISION REQUIRED** | Global uniqueness for variant SKUs |
| **Recommended default** | Product SKU unique when present; variant SKUs unique within product for V1 |

### 2.5 Price rules
| Aspect | Detail |
|--------|--------|
| Source of truth | DB `product.price` (and optional variant.price) — checkout overwrites client prices `code` |
| Acceptance | Client-sent item prices ignored |

---

## 3. Cart

| Aspect | Detail |
|--------|--------|
| Storage | Client-only (`cartStore.ts`) `code` |
| Stale price | Possible until checkout; checkout reloads product price `code` |
| Stale stock | Possible; **not** validated at checkout today |
| Deactivated after add | Product may remain in cart; list hides inactive; checkout may still load by id if not filtered |
| Quantity | Client-controlled; server should enforce min 1 and stock cap |
| Acceptance (V1) | Checkout rejects inactive products, missing variants, qty &lt; 1, qty &gt; stock |

---

## 4. Coupons

| Scenario | Current (`code`) | V1 acceptance |
|----------|------------------|---------------|
| Nonexistent code | 404 `valid: false` | Keep |
| Inactive | 400 inactive | Keep |
| Expired | 400 expired | Keep |
| Min purchase | Compared to client `orderAmount` | Server must recompute orderAmount from cart lines |
| Max discount | Clamped to `orderAmount` | Keep; no separate maxDiscount field |
| Usage limit | Global `usedCount` vs `usageLimit` | Keep global for V1 |
| Repeated use by same user | Not tracked per user | **BUSINESS DECISION REQUIRED** — recommended: allow until global limit |
| % vs fixed | Implemented | Keep |
| Apply at pay | **Not applied** to Stripe total | MUST apply server-side before session create |
| Increment | `POST /coupons/:id/use` any authenticated user | **Recommended:** only increment inside paid webhook / verify path |

**Public `GET /coupons/code/:code`:** returns full coupon doc `code` — **recommended** restrict or return limited fields.

---

## 5. Orders — state machine

### Current enum (`code`)
`status`: `pending` | `paid` | `shipped` | `delivered` | `canceled`  
`paymentStatus`: `unpaid` | `pending` | `paid` | `failed` | `refunded`

### Transitions (implemented vs required)

| From → To | Implemented? | Notes |
|-----------|--------------|-------|
| → pending | Yes | Created at checkout / direct order |
| pending → paid | Yes | Webhook / verify-payment |
| paid → shipped | **No admin API** | **BUSINESS DECISION REQUIRED** |
| shipped → delivered | **No admin API** | |
| * → canceled | **No API** | When allowed? |
| paid → refunded (paymentStatus) | Field exists; no Stripe refund handler found | |

**Recommended V1 transitions (admin only after paid):**  
`pending → canceled` (if unpaid)  
`paid → shipped → delivered`  
`paid → canceled` only with inventory restock policy defined  

**Invalid transitions:** skip states; customer cannot self-mark paid/shipped.

### Acceptance
- Customer lists only own orders  
- Customer get-by-id scoped to owner unless admin `code`  
- Paid is idempotent if already paid `code`

---

## 6. Stripe

| Scenario | Current | Acceptance |
|----------|---------|------------|
| Session creation | Auth required; pending order; line items from DB prices + client shipping/tax | Amounts fully server-authoritative |
| Duplicate webhook | Unique `eventId` → 200 duplicate `code` | Keep; side effects must be idempotent |
| Delayed webhook | `verify-payment` fallback for owner `code` | Keep as secondary path |
| Invalid signature | 400 `code` | Keep |
| Failed payment | Order remains pending/unpaid | No stock decrement |
| Success; browser never returns | Webhook still marks paid | Customer sees paid in history |
| Order already paid | Early return `code` | Keep |
| Refund/chargeback | `refunded` enum only | **BUSINESS DECISION REQUIRED** — Post-MVP automation OK |

**Hard rule:** Never mark paid from success-page redirect alone (redirect may call verify; webhook is primary) `code` + `recommended`.

---

## 7. Wishlist

| Scenario | Current | Notes |
|----------|---------|-------|
| Add | `POST /wishlist/:productId` | Requires auth; product must exist |
| Duplicate | 400 already in wishlist | Intended |
| Ownership | Queries scoped by `req.user.id` | OK |
| Schema | Model field `template` vs controller `product` | **BROKEN** — see DATA_MODEL |
| Removed/deactivated products | Add checks existence only; list populates product | **BUSINESS DECISION REQUIRED** — recommended: filter null/inactive on list |

**Canonical design (recommended):** one document per `(user, product)` + unique compound index (already intended).

---

## 8. Reviews

| Scenario | Current | Notes |
|----------|---------|-------|
| Rating range | 1–5 Joi + schema | Keep |
| Duplicate | One per user+product (intended index on wrong field name) | Keep one-review rule |
| Ownership | Update/delete check `review.user === req.user.id` | Keep |
| Edit / delete | Supported | Keep |
| Purchase required | **Not enforced** | **BUSINESS DECISION REQUIRED** |
| **Recommended default** | Require at least one paid order containing the product |

Schema field name mismatch (`template` vs `product`) is a blocker for reliable uniqueness.

---

## 9. Profile & addresses

### Profile
- Get/update username + email; conflict → 409 `code`  
- Password change via profile: not in profile controller (reset flow only)

### Addresses
- No saved Address entity `code`  
- Shipping address required on order create/checkout  
- **SHOULD HAVE** saved addresses — see MVP_SCOPE

---

## 10. Cross-cutting acceptance (V1)

1. Backend is source of truth for price, stock, discount, tax, shipping, payment state, roles.  
2. No client-supplied role elevation.  
3. Ownership checks on orders, reviews, wishlist, payment verify.  
4. Webhook signature required in all non-local environments.  
5. Critical flows covered by integration tests (see future TEST_STRATEGY).
