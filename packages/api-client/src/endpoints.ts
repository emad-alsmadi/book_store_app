import apiClient from './api';
import type {
  User,
  Product,
  Order,
  AuthResponse,
  PaginatedResponse,
} from '@craftify/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),

  register: (email: string, password: string, username: string) =>
    apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      username,
    }),

  logout: () => apiClient.post('/auth/logout'),

  forgotPassword: (email: string) =>
    apiClient.post('/password/forgot-password', { email }),

  resetPassword: (userId: string, token: string, newPassword: string) =>
    apiClient.post(`/password/reset-password/${userId}/${token}`, {
      password: newPassword,
    }),
};

export const productApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),

  create: (data: Partial<Product>) =>
    apiClient.post<Product>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data),

  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

/** @deprecated use productApi */
export const templateApi = productApi;

export const orderApi = {
  getMyOrders: () => apiClient.get<Order[]>('/orders/my'),

  getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),

  create: (data: unknown) => apiClient.post<Order>('/orders', data),
};

export const userApi = {
  getProfile: () => apiClient.get<{ user: User }>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<{ user: User }>('/auth/profile', data),
};

/** @deprecated Craftify creators — unused in TrendVaulta */
export const creatorApi = {
  getAll: () => apiClient.get('/brands'),
  getById: (id: string) => apiClient.get(`/brands/${id}`),
};
