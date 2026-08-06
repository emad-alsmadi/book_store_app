import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '@/lib/api';

export function brandsKey() {
  return ['brands'] as const;
}

export function brandByIdKey(id: string) {
  return ['brands', 'byId', id] as const;
}

export function useBrands() {
  return useQuery({
    queryKey: brandsKey(),
    queryFn: async () => {
      return await brandsApi.getBrands();
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export function useBrandById(id?: string) {
  return useQuery({
    queryKey: id ? brandByIdKey(id) : ['brands', 'byId', 'missing'],
    queryFn: async () => {
      if (!id) throw new Error('Missing brand id');
      return await brandsApi.getBrandById(id);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
    retry: 1,
  });
}
