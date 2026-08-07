/**
 * Recently viewed — localStorage for anonymous users;
 * authenticated users also sync via POST/GET /api/me/recently-viewed.
 */

import type { Product } from '@/types';
import { getAuthToken } from '@/lib/authCookies';
import { recentlyViewedApi } from '@/lib/api';

export type RecentlyViewedItem = {
  id: string;
  title: string;
  cover: string;
  price: number;
  category?: string;
  viewedAt: number;
};

const STORAGE_KEY = 'tv_recently_viewed_v1';
const MAX_ITEMS = 12;

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function productToRecentlyViewedItem(
  product: Product,
  viewedAt = Date.now(),
): RecentlyViewedItem {
  return {
    id: product._id,
    title: product.title,
    cover: product.cover,
    price: product.price,
    category: product.category,
    viewedAt,
  };
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Record a product view locally (always), and POST to the API when logged in.
 * PDP can keep calling this helper unchanged.
 */
export function trackRecentlyViewed(
  item: Omit<RecentlyViewedItem, 'viewedAt'>,
): RecentlyViewedItem[] {
  if (!canUseStorage()) return [];
  const next: RecentlyViewedItem = { ...item, viewedAt: Date.now() };
  const existing = getRecentlyViewed().filter((x) => x.id !== item.id);
  const merged = [next, ...existing].slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore quota / private mode
  }

  if (getAuthToken()) {
    void recentlyViewedApi.trackRecentlyViewed(item.id).catch(() => {
      // keep local history even if sync fails
    });
  }

  return merged;
}
