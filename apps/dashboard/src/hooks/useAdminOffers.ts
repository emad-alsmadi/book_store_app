import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminOffersApi, type OfferPayload } from '../lib/api';

export const ADMIN_OFFERS_KEY = ['admin', 'offers'] as const;

export function useAdminOffers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...ADMIN_OFFERS_KEY, params ?? {}] as const,
    queryFn: () => adminOffersApi.getOffers(params),
    staleTime: 30_000,
  });
}

export function useCreateOfferMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OfferPayload) =>
      adminOffersApi.createOffer(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_OFFERS_KEY });
    },
  });
}

export function useUpdateOfferMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<OfferPayload>;
    }) => adminOffersApi.updateOffer(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_OFFERS_KEY });
    },
  });
}

export function useDeleteOfferMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminOffersApi.deleteOffer(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ADMIN_OFFERS_KEY });
    },
  });
}
