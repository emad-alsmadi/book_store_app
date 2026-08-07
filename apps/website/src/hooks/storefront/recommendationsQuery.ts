'use client';

import { useQuery } from '@tanstack/react-query';
import {
  recommendationsApi,
  type RecommendationsQuery,
  type RecommendationsResponse,
} from '@/lib/api';

export function recommendationsKey(params: RecommendationsQuery) {
  return ['recommendations', params] as const;
}

/**
 * GET /api/recommendations
 */
export function useRecommendations(params: RecommendationsQuery = {}) {
  return useQuery<RecommendationsResponse>({
    queryKey: recommendationsKey(params),
    queryFn: () => recommendationsApi.getRecommendations(params),
    staleTime: 60_000,
    retry: 1,
  });
}

/** Home rail: context=home, default limit 8 */
export function useHomeRecommendations(limit = 8) {
  return useRecommendations({ context: 'home', limit });
}
