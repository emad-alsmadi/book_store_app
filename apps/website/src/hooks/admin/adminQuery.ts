import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import type {
  UserUpdatePayload,
  CouponPayload,
  ProductPayload,
  BrandPayload,
} from '@/types';

export const ADMIN_USERS_KEY = ['admin', 'users'] as const;
export const ADMIN_COUPONS_KEY = ['admin', 'coupons'] as const;
export const ADMIN_PRODUCTS_KEY = ['admin', 'products'] as const;
export const ADMIN_BRANDS_KEY = ['admin', 'brands'] as const;
export const ADMIN_ORDERS_KEY = ['admin', 'orders'] as const;

export function useAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_KEY,
    queryFn: () => adminApi.getUsers(),
    staleTime: 30_000,
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ADMIN_COUPONS_KEY,
    queryFn: () => adminApi.getCoupons(),
    staleTime: 30_000,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_KEY,
    queryFn: () => adminApi.getProducts(),
    staleTime: 30_000,
  });
}

export function useAdminBrands() {
  return useQuery({
    queryKey: ADMIN_BRANDS_KEY,
    queryFn: () => adminApi.getBrands(),
    staleTime: 30_000,
  });
}

export function useAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_KEY, params ?? {}] as const,
    queryFn: () => adminApi.getOrders(params),
    staleTime: 15_000,
  });
}

export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY });
      await qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) =>
      adminApi.updateUser(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
  });
}

export function useDeleteUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
  });
}

export function useCreateCouponMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CouponPayload) => adminApi.createCoupon(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
    },
  });
}

export function useUpdateCouponMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CouponPayload>;
    }) => adminApi.updateCoupon(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
    },
  });
}

export function useDeleteCouponMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
    },
  });
}

export function useCreateProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => adminApi.createProduct(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      await qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProductPayload>;
    }) => adminApi.updateProduct(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      await qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      await qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateBrandMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BrandPayload) => adminApi.createBrand(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_BRANDS_KEY });
      await qc.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useUpdateBrandMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BrandPayload>;
    }) => adminApi.updateBrand(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_BRANDS_KEY });
      await qc.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useDeleteBrandMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBrand(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_BRANDS_KEY });
      await qc.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}
