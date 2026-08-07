import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminOrdersApi,
  type AdminOrdersQuery,
} from '../lib/api';

export const ADMIN_ORDERS_KEY = ['admin', 'orders'] as const;

export function useAdminOrders(params?: AdminOrdersQuery) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_KEY, params ?? {}] as const,
    queryFn: () => adminOrdersApi.getOrders(params),
    staleTime: 15_000,
  });
}

export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminOrdersApi.updateOrderStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY });
    },
  });
}
