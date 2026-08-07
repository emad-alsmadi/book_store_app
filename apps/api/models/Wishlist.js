const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'wishlists',
  },
);

// One wishlist row per user+product
WishlistSchema.index({ user: 1, product: 1 }, { unique: true });
WishlistSchema.index({ user: 1 });
WishlistSchema.index({ product: 1 });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = { Wishlist };
