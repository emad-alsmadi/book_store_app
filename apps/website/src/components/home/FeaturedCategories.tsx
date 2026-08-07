'use client';

import Link from 'next/link';
import { DEMO_CATEGORY_SHORTCUTS } from '@/data/demoStorefront';

/** Retail category tiles — DEMO labels; hrefs hit live catalog filters */
export function FeaturedCategories() {
  const categories = DEMO_CATEGORY_SHORTCUTS.slice(0, 6).map((c, i) => ({
    name: c.name,
    count: c.countLabel,
    href: c.href,
    image: `/images/${(i % 4) + 1}.webp`,
  }));

  return (
    <div className='bg-slate-50 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Browse by category
          </h2>
          <p className='text-gray-600 text-lg'>
            Beauty, fashion, and lifestyle edits for every mood
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className='group relative overflow-hidden rounded-lg aspect-[16/9] hover:shadow-xl transition-shadow duration-300'
            >
              <div
                className='absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105'
                style={{ backgroundImage: `url("${category.image}")` }}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                <h3 className='text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors'>
                  {category.name}
                </h3>
                <p className='text-sm text-white/80'>{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
