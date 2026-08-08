import { useQuery } from '@tanstack/react-query';
import { adminStatsApi } from '../lib/api';

export const ADMIN_STATS_KEY = ['admin', 'stats'] as const;

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_KEY,
    queryFn: () => adminStatsApi.getStats(),
    staleTime: 15_000,
  });
}
