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

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
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
