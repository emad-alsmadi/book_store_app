'use client';

import Link from 'next/link';
import { DEMO_FEATURED_BRANDS, type DemoBrand } from '@/data/demoStorefront';

type Props = {
  brands?: DemoBrand[];
};

/** DEMO module — TODO(api): GET /api/brands?featured=true */
export function FeaturedBrandsStrip({ brands = DEMO_FEATURED_BRANDS }: Props) {
  return (
    <section
      aria-labelledby='brands-heading'
      className='border-t border-stone-200 bg-stone-50 py-12 sm:py-16'
    >
      <div className='mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8'>
        <div className='mb-6'>
          <p className='text-xs font-medium uppercase tracking-wider text-stone-500'>
            Demo brands
          </p>
          <h2
            id='brands-heading'
            className='mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl'
          >
            Featured houses
          </h2>
          <p className='mt-1 text-sm text-stone-600'>
            Placeholder brand spotlights until featured brands ship from API.
          </p>
        </div>

        <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link
                href={brand.href}
                className='flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500'
              >
                <div
                  className={`mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r ${brand.accent}`}
                  aria-hidden
                />
                <div>
                  <h3 className='text-lg font-semibold text-stone-900'>
                    {brand.name}
                  </h3>
                  <p className='mt-1 text-sm text-stone-600'>{brand.tagline}</p>
                </div>
                <span className='mt-4 text-sm font-semibold text-fuchsia-700'>
                  Explore →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
