# TrendVaulta — Security Model

**Date:** 2026-08-07  
**Scope:** Authentication, authorization, ownership, validation, payment integrity, and known gaps.  
**Evidence:** `apps/api` middlewares/controllers + website `authCookies.ts` / `proxy.ts` / `api.ts`.

---

## 1. Three-layer model

| Layer | Question | Where enforced today |
|-------|----------|----------------------|
| **Authentication** | Who is the caller? | `verfiyToken` JWT verify |
| **Authorization** | What role/permission? | `checkRolePermission` + `rolePermissions.js` |
| **Ownership** | Is this their resource? | Controllers (orders, reviews, verify-payment, wishlist by user id) |

**Preferred pipeline (canonical):**  
`verfiyToken → checkRolePermission (if admin route) → validate (Joi) → controller (ownership + business rules)`

---

## 2. Authentication

### Token generation (`code`)
- `User.generateToken()` → JWT HS256 with `{ id, roles }`, `expiresIn: '30d'`, secret `JWT_SECRET_KEY`.
- Issued on register/login.

### Token verification (`code`)
- Header `Authorization: Bearer <token>` or legacy `headers.token`.
- Invalid/missing → 401.

### Refresh tokens
- **Not implemented.** Do not document as supported.

### Client storage (`code`)
| Cookie | Set by | httpOnly | Notes |
|--------|--------|----------|-------|
| `token` | Browser `js-cookie` after login | **No** | Readable by XSS |
| `userRole` | Browser `js-cookie` | **No** | Used by Next `proxy.ts` for UI route gates |

**Important correction:** Browser JS cannot create httpOnly cookies. Current architecture is **explicitly non-httpOnly**. Any docs implying httpOnly without API `Set-Cookie` are wrong.

### Logout (`code`)
- API returns 200; client clears cookies. No server denylist.

### Password hashing (`code`)
- bcryptjs salt rounds 10 on register/reset.

### Password reset (`code`)
- Token: JWT signed with `JWT_SECRET_KEY + currentPasswordHash`, 5m expiry.
- Successful reset changes password → prior reset tokens fail verification.
- Dev may return reset link in JSON if email fails.
- Forgot flow 404 on unknown email → **user enumeration**.

### Auth — security findings

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| A1 | Register accepts `roles` from body | Critical | Open |
| A2 | JWT in non-httpOnly cookie | High | By design today; needs decision |
| A3 | `userRole` cookie spoofable → UI admin routes | Medium (API still JWT) | Open |
| A4 | 30d access token lifetime | Medium | Review |
| A5 | Password reset email enumeration | Low/Med | Open |
| A6 | Reset endpoint TODO validation comment | Low | Partial validation exists on password length |
| A7 | No account lockout / rate limit | High | Missing |
| A8 | No disabled-user flag | Med | Missing |

**BUSINESS DECISION REQUIRED — token storage V1:**  
**Recommended:** API sets `Set-Cookie` httpOnly + Secure + SameSite=Lax (or Strict) for access token; stop storing JWT in `js-cookie`. Keep role checks for UI derived from `/auth/profile`, not a separate spoofable cookie.

---

## 3. Authorization (RBAC)

### Intended mechanism (`code`)
`getUserPermissions(roles)` → allow if includes required permission string.

### Current map (`rolePermissions.js`) — **BROKEN for TrendVaulta**
Grants Craftify permissions: `templates:*`, `creators:*`, plus `users:*` for admin.

### Routes require (`code`)
`products:write|delete`, `brands:write|delete`, `coupons:read|write|delete`, `users:read|write|delete`.

### Consequence
Even `admin` JWT fails admin product/brand/coupon/user routes until map is fixed.

### Canonical permission set (proposed)

```
products:read | products:write | products:delete
brands:read | brands:write | brands:delete
coupons:read | coupons:write | coupons:delete
orders:read | orders:write          # admin order ops
users:read | users:write | users:delete
users:read:own                      # optional self
```

| Role | Proposal |
|------|----------|
| user | own profile/orders/wishlist/reviews; catalog read via public routes |
| moderator | products/brands write; orders read; limited users read |
| admin | all |

---

## 4. Ownership matrix

| Resource | Rule today | Gap |
|----------|------------|-----|
| Profile | JWT id | OK |
| Orders list | `user: jwt.id` | OK |
| Order by id | owner or admin | OK |
| Verify payment | order.user === jwt | OK |
| Wishlist | user scoped | Schema field broken |
| Reviews mutate | review.user === jwt | OK |
| Reviews create | any auth user | Purchase gate undecided |
| Coupon `/use` | any auth user | **Should be system-only** |
| Admin users | permission | RBAC map broken |

**IDOR posture:** Order/review/wishlist patterns generally scope by user. Risk rises if admin checks rely only on spoofable cookie (they do not for API — good). Ensure list endpoints never accept arbitrary `userId` query without admin permission.

---

## 5. Validation

| Layer | Status |
|-------|--------|
| Backend Joi on many models | Present |
| Trust FE validation alone | **Forbidden** for money/auth |
| Checkout amounts | Product prices from DB; shipping/tax from client — **fail** |
| Coupon orderAmount | Client-supplied — **fail** |
| Order create Joi | Still Template fields — **fail** |

---

## 6. Payment & webhook security

| Control | Status |
|---------|--------|
| Stripe secret only on server | Intended via env |
| Checkout Session amounts | Partially authoritative |
| Webhook raw body before JSON parser | Yes (`app.js` order) |
| Signature verification | Yes |
| Idempotency via eventId unique | Yes |
| Mark paid from redirect only | No (verify + webhook) |
| Stock atomicity | Missing |
| Coupon application server-side | Missing |
| `incrementCouponUsage` exposure | Over-broad |

**Hard rules for V1:**
1. Never trust client price/discount/stock/role/paymentStatus.  
2. Never skip webhook signature verification outside explicit local mock.  
3. Paid transition + stock + coupon increment must be idempotent.

---

## 7. Transport & browser security

| Control | Status |
|---------|--------|
| CORS | Allowlist via `FRONTEND_URL` / `DASHBOARD_URL` / `ALLOWED_ORIGINS` (`corsAllowlist.js`) — set env in production |
| HTTPS | Deployment concern (`missing info` for prod) |
| Rate limiting | In-memory limits on auth, password, checkout, coupon validate (`rateLimit.js`) |
| Helmet / security headers | Missing on API |
| XSS → JWT theft | High likelihood given non-httpOnly token |
| CSRF | Lower for Bearer header; rises if moving to cookie-auth without CSRF strategy |

**Recommended CORS:** allowlist `FRONTEND_URL`, `DASHBOARD_URL` only.

---

## 8. Data exposure & logging

| Risk | Status |
|------|--------|
| Passwords in logs | Avoid; ensure never log body.password |
| JWT / Stripe secrets in logs | Redact; lean-ctx already redacts some tooling output |
| Error handler | `console.log(err)` + `err.message` to client — may leak internals |
| Coupon by code public GET | Full document exposure |
| Reset link in dev JSON | OK for local; must not occur in production responses |

---

## 9. File upload

No multer/upload routes confirmed in API tree for products (cover is URL string). If uploads added later: type/size/auth checks required.

---

## 10. Security release gate (pre-staging checklist)

Copy from Phase 11 — track evidence:

- [ ] Password hashing verified  
- [ ] JWT validation on all private routes  
- [ ] RBAC map matches route permissions  
- [ ] Register cannot set roles  
- [ ] Ownership on orders/reviews/wishlist/payments  
- [ ] Joi aligned to product domain  
- [x] CORS allowlist (env-driven; verify production URLs)  
- [x] Rate limit auth + forgot-password + checkout + coupon validate  

- [ ] No secrets in frontend env except public publishable keys  
- [ ] Stripe webhook signature + idempotency tested  
- [ ] No sensitive logs in sample traffic  
- [ ] Safe error responses  
- [ ] Dependency audit scheduled  
- [ ] Cookie policy decision documented and implemented  

**Do not mark production-ready until every required item has evidence.**

---

## 11. Immediate hardening order (aligns with Batch 0.1)

1. Force `roles: ['user']` on register  
2. Fix `ROLE_PERMISSIONS`  
3. Fix Order/Wishlist/Review schemas (prevents broken authz uniqueness)  
4. Server-side checkout totals + coupon  
5. Restrict `/coupons/:id/use`  
6. Add rate limits + CORS allowlist  
7. Decide/implement httpOnly session design  
8. Generic forgot-password response  
