import axios from 'axios';
import { clearAuthSession, getAuthToken } from './auth';

/**
 * Dashboard API client — uses Vite proxy `/api` → API server in dev.
 * Override with VITE_API_URL (e.g. http://localhost:3000/api).
 */
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearAuthSession();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export type AdminOrderCustomer = {
  _id?: string;
  username?: string;
  email?: string;
};

export type AdminOrder = {
  _id: string;
  status: string;
  paymentStatus?: string;
  totalPrice?: number;
  createdAt?: string;
  allowedNextStatuses?: string[];
  user?: string | AdminOrderCustomer;
};

export type AdminOrdersQuery = {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  q?: string;
};

export type AdminOrdersResponse = {
  data: AdminOrder[];
  meta: { total: number; page: number; pages: number; limit: number };
};

export type LoginResponse = {
  message?: string;
  token: string;
  email?: string;
  username?: string;
  roles?: string[];
};

function errorMessage(err: unknown, fallback: string) {
  const ax = err as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return ax?.response?.data?.message || ax?.message || fallback;
}

export { errorMessage };

export type ProfileUser = {
  _id: string;
  email: string;
  username: string;
  roles?: string[];
  createdAt?: string;
};

export type ProfileResponse = {
  user: ProfileUser;
  permissions?: string[];
};

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const { data } = await api.get<ProfileResponse>('/auth/profile');
    return data;
  },

  updateProfile: async (payload: {
    username: string;
    email: string;
  }): Promise<{ message: string; user: ProfileUser }> => {
    const { data } = await api.put<{ message: string; user: ProfileUser }>(
      '/auth/profile',
      payload,
    );
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Stateless JWT — clear local session even if request fails
    }
  },
};

export const adminOrdersApi = {
  getOrders: async (
    params: AdminOrdersQuery = {},
  ): Promise<AdminOrdersResponse> => {
    const { data } = await api.get<AdminOrdersResponse>('/orders', {
      params: { limit: 50, ...params },
    });
    return data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<AdminOrder> => {
    const { data } = await api.patch<AdminOrder>(`/orders/${id}/status`, {
      status,
    });
    return data;
  },
};

export type AdminStatsStatusCounts = {
  pending: number;
  paid: number;
  shipped: number;
  delivered: number;
  canceled: number;
};

export type AdminStats = {
  users: number;
  products: number;
  brands: number;
  orders: number;
  paidRevenue: number;
  statusCounts: AdminStatsStatusCounts;
};

export type AdminStatsResponse = {
  message?: string;
  data: AdminStats;
};

export const adminStatsApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<AdminStatsResponse>('/admin/stats');
    return data.data;
  },
};

export type AdminBrand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
};

export type BrandFormPayload = {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
};

export type AdminProduct = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  cover?: string;
  category?: string;
  subcategory?: string;
  stock?: number;
  sku?: string;
  averageRating?: number;
  isActive?: boolean;
  brand?: string | { _id?: string; name?: string; slug?: string };
};

export type ProductFormPayload = {
  title: string;
  brand: string;
  description: string;
  price: number;
  cover: string;
  category: string;
  subcategory: string;
  stock: number;
  sku: string;
};

export type PaginatedList<T> = {
  data: T[];
  meta?: { total: number; page: number; pages: number; limit: number };
};

export const adminBrandsApi = {
  getBrands: async (
    params: { page?: number; limit?: number; q?: string } = {},
  ): Promise<PaginatedList<AdminBrand>> => {
    const { data } = await api.get<PaginatedList<AdminBrand>>('/brands', {
      params: { limit: 100, ...params },
    });
    return data;
  },

  createBrand: async (payload: BrandFormPayload): Promise<AdminBrand> => {
    const { data } = await api.post<AdminBrand>('/brands', payload);
    return data;
  },

  updateBrand: async (
    id: string,
    payload: Partial<BrandFormPayload>,
  ): Promise<AdminBrand> => {
    const { data } = await api.put<AdminBrand>(`/brands/${id}`, payload);
    return data;
  },

  deleteBrand: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/brands/${id}`);
    return data;
  },
};

export const adminProductsApi = {
  getProducts: async (
    params: {
      page?: number;
      limit?: number;
      q?: string;
      category?: string;
      includeInactive?: boolean;
    } = {},
  ): Promise<PaginatedList<AdminProduct>> => {
    const { data } = await api.get<PaginatedList<AdminProduct>>('/products', {
      params: { limit: 100, includeInactive: true, ...params },
    });
    return data;
  },

  createProduct: async (payload: ProductFormPayload): Promise<AdminProduct> => {
    const { data } = await api.post<AdminProduct>('/products', payload);
    return data;
  },

  updateProduct: async (
    id: string,
    payload: Partial<ProductFormPayload>,
  ): Promise<AdminProduct> => {
    const { data } = await api.put<AdminProduct>(`/products/${id}`, payload);
    return data;
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`);
    return data;
  },
};

export type AppRole = 'user' | 'admin' | 'moderator';

export type AdminUser = {
  _id: string;
  email: string;
  username: string;
  roles?: AppRole[];
  createdAt?: string;
  isAccountVerified?: boolean;
};

export type UserUpdatePayload = {
  email?: string;
  username?: string;
  password?: string;
  roles?: AppRole[];
};

export const adminUsersApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await api.get<AdminUser[]>('/users');
    return Array.isArray(data) ? data : [];
  },

  updateUser: async (
    id: string,
    payload: UserUpdatePayload,
  ): Promise<{ message: string; updatedUser: AdminUser }> => {
    const { data } = await api.put<{ message: string; updatedUser: AdminUser }>(
      `/users/${id}`,
      payload,
    );
    return data;
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/users/${id}`);
    return data;
  },
};

export type DiscountType = 'percentage' | 'fixed';

export type AdminCoupon = {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expirationDate: string;
  usageLimit: number | null;
  usedCount: number;
  minimumOrderAmount: number;
  isActive: boolean;
  description: string | null;
  createdAt?: string;
};

export type CouponPayload = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expirationDate: string;
  usageLimit?: number | null;
  minimumOrderAmount?: number;
  isActive?: boolean;
  description?: string;
};

export const adminCouponsApi = {
  getCoupons: async (
    params: { page?: number; limit?: number } = {},
  ): Promise<PaginatedList<AdminCoupon>> => {
    const { data } = await api.get<PaginatedList<AdminCoupon>>('/coupons', {
      params: { limit: 100, ...params },
    });
    return data;
  },

  createCoupon: async (payload: CouponPayload): Promise<AdminCoupon> => {
    const { data } = await api.post<AdminCoupon>('/coupons', payload);
    return data;
  },

  updateCoupon: async (
    id: string,
    payload: Partial<CouponPayload>,
  ): Promise<AdminCoupon> => {
    const { data } = await api.put<AdminCoupon>(`/coupons/${id}`, payload);
    return data;
  },

  deleteCoupon: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/coupons/${id}`);
    return data;
  },
};

export type AdminOffer = {
  _id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  href: string;
  imageUrl?: string;
  endsAt?: string | null;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type OfferPayload = {
  title: string;
  href: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
  endsAt?: string | null;
  active?: boolean;
  sortOrder?: number;
};

export const adminOffersApi = {
  getOffers: async (
    params: { page?: number; limit?: number } = {},
  ): Promise<PaginatedList<AdminOffer>> => {
    const { data } = await api.get<PaginatedList<AdminOffer>>(
      '/offers/admin',
      {
        params: { limit: 100, ...params },
      },
    );
    return data;
  },

  createOffer: async (payload: OfferPayload): Promise<AdminOffer> => {
    const { data } = await api.post<AdminOffer>('/offers', payload);
    return data;
  },

  updateOffer: async (
    id: string,
    payload: Partial<OfferPayload>,
  ): Promise<AdminOffer> => {
    const { data } = await api.put<AdminOffer>(`/offers/${id}`, payload);
    return data;
  },

  deleteOffer: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/offers/${id}`);
    return data;
  },
};

export type AdminReview = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  user?: string | { _id?: string; username?: string; email?: string };
  product?: string | { _id?: string; title?: string; cover?: string; sku?: string };
};

export const adminReviewsApi = {
  getReviews: async (
    params: { page?: number; limit?: number } = {},
  ): Promise<PaginatedList<AdminReview>> => {
    const { data } = await api.get<PaginatedList<AdminReview>>(
      '/reviews/admin',
      { params: { limit: 100, ...params } },
    );
    return data;
  },

  deleteReview: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/reviews/admin/${id}`,
    );
    return data;
  },
};
