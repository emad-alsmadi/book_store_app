'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recentlyViewedApi } from '@/lib/api';
import { getAuthToken } from '@/lib/authCookies';
import {
  getRecentlyViewed,
  productToRecentlyViewedItem,
  type RecentlyViewedItem,
} from '@/lib/recentlyViewed';

export const RECENTLY_VIEWED_KEY = ['recentlyViewed', 'me'] as const;

/**
 * Auth users: GET /api/me/recently-viewed.
 * Anonymous: localStorage demo/local fallback.
 */
export function useRecentlyViewed() {
  const isAuthenticated =
    typeof window !== 'undefined' && !!getAuthToken();

  const query = useQuery({
    queryKey: RECENTLY_VIEWED_KEY,
    queryFn: () => recentlyViewedApi.getRecentlyViewed(),
    enabled: isAuthenticated,
    staleTime: 30_000,
    retry: 1,
  });

  const [localItems, setLocalItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocalItems(getRecentlyViewed());
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    const items = (query.data ?? []).map((product, index) =>
      productToRecentlyViewedItem(product, Date.now() - index),
    );
    return {
      items,
      isLoading: query.isLoading,
      source: 'api' as const,
    };
  }

  return {
    items: localItems,
    isLoading: false,
    source: 'local' as const,
  };
}
