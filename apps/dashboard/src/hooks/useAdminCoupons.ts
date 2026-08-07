import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCouponsApi, type CouponPayload } from '../lib/api';

export const ADMIN_COUPONS_KEY = ['admin', 'coupons'] as const;

export function useAdminCoupons(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...ADMIN_COUPONS_KEY, params ?? {}] as const,
    queryFn: () => adminCouponsApi.getCoupons(params),
    staleTime: 30_000,
  });
}

export function useCreateCouponMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CouponPayload) =>
      adminCouponsApi.createCoupon(payload),
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
    }) => adminCouponsApi.updateCoupon(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
    },
  });
}

export function useDeleteCouponMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCouponsApi.deleteCoupon(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
    },
  });
}
