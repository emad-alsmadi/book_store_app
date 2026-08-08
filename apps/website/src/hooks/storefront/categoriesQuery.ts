import { useQuery } from '@tanstack/react-query';
import {
  categoriesApi,
  type StorefrontCategoryItem,
} from '@/lib/api';
import type { DemoCategoryShortcut } from '@/data/demoStorefront';

export function categoriesKey() {
  return ['storefront', 'categories'] as const;
}

type CategoryMeta = Pick<
  DemoCategoryShortcut,
  'accent' | 'icon' | 'countLabel'
>;

/** Visual meta for Product.category ids (API returns id/label/href only) */
const CATEGORY_META: Record<string, CategoryMeta> = {
  makeup: {
    accent: 'from-rose-500 to-pink-600',
    icon: 'sparkles',
    countLabel: 'Color & glam',
  },
  perfumes: {
    accent: 'from-violet-500 to-fuchsia-600',
    icon: 'gift',
    countLabel: 'Scents & sets',
  },
  clothing: {
    accent: 'from-stone-600 to-neutral-800',
    icon: 'shirt',
    countLabel: 'Ready-to-wear',
  },
  skincare: {
    accent: 'from-emerald-500 to-teal-600',
    icon: 'heart',
    countLabel: 'Glow essentials',
  },
  accessories: {
    accent: 'from-amber-500 to-orange-600',
    icon: 'watch',
    countLabel: 'Bags & details',
  },
  home: {
    accent: 'from-sky-500 to-indigo-600',
    icon: 'home',
    countLabel: 'Lifestyle living',
  },
  beauty: {
    accent: 'from-rose-500 to-pink-600',
    icon: 'sparkles',
    countLabel: 'Skincare & makeup',
  },
  fashion: {
    accent: 'from-stone-600 to-neutral-800',
    icon: 'shirt',
    countLabel: 'Ready-to-wear',
  },
  wellness: {
    accent: 'from-emerald-500 to-teal-600',
    icon: 'heart',
    countLabel: 'Self-care picks',
  },
};

const DEFAULT_META: CategoryMeta = {
  accent: 'from-cyan-500 to-blue-600',
  icon: 'bag',
  countLabel: 'Shop collection',
};

function mapCategoryItem(item: StorefrontCategoryItem): DemoCategoryShortcut | null {
  const id = typeof item.id === 'string' ? item.id.trim() : '';
  const label = typeof item.label === 'string' ? item.label.trim() : '';
  const href = typeof item.href === 'string' ? item.href.trim() : '';
  if (!id || !label || !href) return null;

  const meta = CATEGORY_META[id] ?? DEFAULT_META;
  return {
    name: label,
    href,
    accent: meta.accent,
    icon: meta.icon,
    countLabel: meta.countLabel,
  };
}

/** GET /api/storefront/categories — mapped for PopularCategories */
export function useStorefrontCategories() {
  return useQuery<DemoCategoryShortcut[]>({
    queryKey: categoriesKey(),
    queryFn: async () => {
      const res = await categoriesApi.getCategories();
      return (res.results ?? [])
        .map(mapCategoryItem)
        .filter((item): item is DemoCategoryShortcut => item != null);
    },
    staleTime: 60_000,
    retry: 1,
  });
}
