export const endpoints = {
  products: {
    list: '/products',
    details: (id: string) => `/products/${id}`,
  },
  brands: {
    list: '/brands',
    details: (id: string) => `/brands/${id}`,
  },
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    profile: '/auth/profile',
  },
  password: {
    forgot: '/password/forgot-password',
    reset: (userId: string, token: string) =>
      `/password/reset-password/${userId}/${token}`,
  },
  orders: {
    create: '/orders',
    my: '/orders/my',
    details: (id: string) => `/orders/${id}`,
  },
  payments: {
    setupStatus: '/payments/setup-status',
    checkoutSession: '/payments/checkout-session',
    verifyPayment: '/payments/verify-payment',
  },
  admin: {
    users: {
      list: '/users',
      details: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    coupons: {
      list: '/coupons',
      create: '/coupons',
      update: (id: string) => `/coupons/${id}`,
      delete: (id: string) => `/coupons/${id}`,
    },
  },
  wishlist: {
    add: (productId: string) => `/wishlist/${productId}`,
    remove: (productId: string) => `/wishlist/${productId}`,
    my: '/wishlist/my',
    check: (productId: string) => `/wishlist/check/${productId}`,
  },
  reviews: {
    create: '/reviews',
    update: (reviewId: string) => `/reviews/${reviewId}`,
    delete: (reviewId: string) => `/reviews/${reviewId}`,
    product: (productId: string) => `/reviews/product/${productId}`,
    my: (productId: string) => `/reviews/my/${productId}`,
    myReviews: '/reviews/my',
  },
  coupons: {
    byCode: (code: string) => `/coupons/code/${code}`,
    validate: '/coupons/validate',
    /** Admin/ops only; paid webhook increments usage for customers */
    incrementUsage: (id: string) => `/coupons/${id}/use`,
  },
} as const;
