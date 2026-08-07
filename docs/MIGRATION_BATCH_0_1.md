# Migration notes — Batch 0.1 (schema canonicalize)

Run against each environment **after** deploying code that dual-reads where needed.

## Wishlist (`wishlists`)

Old field: `template`  
New field: `product`

```js
// mongosh
db.wishlists.updateMany(
  { product: { $exists: false }, template: { $exists: true } },
  [{ $set: { product: '$template' } }, { $unset: 'template' }],
);
db.wishlists.dropIndex('user_1_template_1'); // if exists
db.wishlists.createIndex({ user: 1, product: 1 }, { unique: true });
```

## Reviews (`reviews`)

```js
db.reviews.updateMany(
  { product: { $exists: false }, template: { $exists: true } },
  [{ $set: { product: '$template' } }, { $unset: 'template' }],
);
db.reviews.dropIndex('user_1_template_1'); // if exists
db.reviews.createIndex({ user: 1, product: 1 }, { unique: true });
```

## Orders (`orders`)

```js
db.orders.find({ 'items.template': { $exists: true } }).forEach((o) => {
  o.items = o.items.map((it) => {
    const productId = it.productId || it.template;
    const { template, ...rest } = it;
    return { ...rest, productId };
  });
  db.orders.replaceOne({ _id: o._id }, o);
});
```

New optional fields (`discountAmount`, `couponCode`, `couponId`, `stockDecremented`, `couponIncremented`) default safely for old documents.

## Rollback

Keep a DB backup before running. Reverting code without reverting data leaves `product`/`productId` fields which older Template-based code will not read.
