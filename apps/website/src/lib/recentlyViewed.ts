/**
 * DEMO — anonymous recently viewed (localStorage).
 * TODO(api): POST/GET /api/me/recently-viewed when authenticated
 */

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
  return merged;
}
