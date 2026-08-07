'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cartStore';
import { useProducts } from '@/hooks/products/productsQuery';
import { pickInspiredProducts } from '@/data/demoStorefront';

type CompanionProduct = {
  _id: string;
  title: string;
  price: number;
  cover: string;
  category?: string;
  stock?: number;
};

type Props = {
  productId: string;
  category?: string;
};

/**
 * DEMO “complete the look” / frequently-bought-together style module.
 * Uses catalog affinity stub — not co-purchase analytics.
 * TODO(api): GET /api/products/:id/bundles
 */
export function CompleteTheLookSection({ productId, category }: Props) {
  const cart = useCart();
  const { data, isLoading, error } = useProducts({
    page: 1,
    limit: 12,
    sort: 'createdAt',
  });
  const catalog = (data?.data ?? []) as CompanionProduct[];

  const companions = useMemo(
    () =>
      pickInspiredProducts(catalog, {
        excludeIds: [productId],
        preferredCategories: category ? [category] : [],
        limit: 3,
      }),
    [catalog, productId, category],
  );

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Default-select all once companions resolve
  const effectiveSelected = useMemo(() => {
    if (Object.keys(selected).length > 0) return selected;
    return Object.fromEntries(companions.map((p) => [p._id, true]));
  }, [companions, selected]);

  const selectedItems = companions.filter((p) => effectiveSelected[p._id]);
  const total = selectedItems.reduce((sum, p) => sum + p.price, 0);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const base =
        Object.keys(prev).length > 0
          ? prev
          : Object.fromEntries(companions.map((p) => [p._id, true]));
      return { ...base, [id]: !base[id] };
    });
  };

  const handleAddSelected = () => {
    selectedItems.forEach((p) => {
      cart.addToCart({
        productId: p._id,
        title: p.title,
        price: p.price,
        cover: p.cover,
        qty: 1,
      });
    });
  };

  if (isLoading) {
    return (
      <section
        aria-labelledby='complete-look-heading'
        className='mb-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8'
      >
        <div className='flex items-center gap-2 text-sm text-stone-500'>
          <Loader2 className='h-4 w-4 animate-spin' aria-hidden />
          Loading suggestions…
        </div>
      </section>
    );
  }

  if (error || companions.length === 0) return null;

  return (
    <section
      aria-labelledby='complete-look-heading'
      className='mb-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8'
    >
      <div className='mb-5'>
        <p className='text-xs font-medium uppercase tracking-wider text-stone-500'>
          Demo · complete the look
        </p>
        <h2
          id='complete-look-heading'
          className='mt-1 text-xl font-bold text-stone-900 sm:text-2xl'
        >
          Pair it with
        </h2>
        <p className='mt-1 text-sm text-stone-600'>
          Suggested companions from the catalog (demo affinity). Replace with
          bundles API later.
        </p>
      </div>

      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {companions.map((item) => {
          const checked = !!effectiveSelected[item._id];
          const inStock = item.stock === undefined || item.stock > 0;
          return (
            <li key={item._id}>
              <label
                className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
                  checked
                    ? 'border-fuchsia-300 bg-fuchsia-50/40'
                    : 'border-stone-200 bg-stone-50'
                } ${!inStock ? 'opacity-60' : ''}`}
              >
                <input
                  type='checkbox'
                  className='mt-1 h-4 w-4 rounded border-stone-300 text-fuchsia-600 focus:ring-fuchsia-500'
                  checked={checked}
                  disabled={!inStock}
                  onChange={() => toggle(item._id)}
                  aria-label={`Select ${item.title}`}
                />
                <Link
                  href={`/products/${item._id}`}
                  className='min-w-0 flex-1'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='flex gap-3'>
                    <img
                      src={item.cover}
                      alt=''
                      className='h-16 w-16 shrink-0 rounded-lg object-cover bg-stone-100'
                      loading='lazy'
                    />
                    <div className='min-w-0'>
                      <p className='line-clamp-2 text-sm font-medium text-stone-900'>
                        {item.title}
                      </p>
                      <p className='mt-1 text-sm font-semibold text-stone-800'>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </label>
            </li>
          );
        })}
      </ul>

      <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-stone-600'>
          {selectedItems.length === 0
            ? 'Select at least one item'
            : (
              <>
                Selected total{' '}
                <span className='font-semibold text-stone-900'>
                  ${total.toFixed(2)}
                </span>
              </>
            )}
        </p>
        <Button
          type='button'
          onClick={handleAddSelected}
          disabled={selectedItems.length === 0}
          className='gap-2'
        >
          <ShoppingCart className='h-4 w-4' aria-hidden />
          Add selected to cart
        </Button>
      </div>
    </section>
  );
}
