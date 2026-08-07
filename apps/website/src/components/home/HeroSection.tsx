'use client';

import { Search, Sparkles, Shirt, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: HeroSectionProps) {
  return (
    <div className='relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6 text-left'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-700'>
              TrendVaulta
            </p>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-stone-900'>
              Beauty, fashion & lifestyle — curated for everyday polish
            </h1>
            <p className='text-base sm:text-lg text-stone-700'>
              Discover elevated essentials, limited edits, and brands that match
              your rhythm. Shop with clear prices, trusted checkout, and care
              you can feel.
            </p>

            <form
              onSubmit={onSearchSubmit}
              className='relative max-w-xl'
              role='search'
            >
              <label
                htmlFor='home-search'
                className='sr-only'
              >
                Search products
              </label>
              <input
                id='home-search'
                type='text'
                placeholder='Search beauty, fashion, lifestyle…'
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className='w-full pl-12 pr-28 py-4 rounded-lg border border-stone-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 shadow-lg bg-white'
              />
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <button
                type='submit'
                className='absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 hover:from-fuchsia-700 hover:via-indigo-700 hover:to-cyan-600 text-white rounded-md font-medium transition-colors'
              >
                Search
              </button>
            </form>

            <div className='flex flex-wrap gap-3'>
              <Link
                href='/products?category=beauty'
                className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-md text-sm font-medium transition-colors border border-stone-200 text-stone-800'
              >
                <Sparkles className='h-4 w-4' />
                Beauty
              </Link>
              <Link
                href='/products?category=fashion'
                className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-md text-sm font-medium transition-colors border border-stone-200 text-stone-800'
              >
                <Shirt className='h-4 w-4' />
                Fashion
              </Link>
              <Link
                href='/products'
                className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-md text-sm font-medium transition-colors border border-stone-200 text-stone-800'
              >
                <ShoppingBag className='h-4 w-4' />
                Shop all
              </Link>
            </div>
          </div>

          <div className='hidden lg:grid grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <div className='aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300'>
                <div
                  className='w-full h-full bg-cover bg-center'
                  style={{ backgroundImage: 'url(/images/4.webp)' }}
                  role='img'
                  aria-label='Lifestyle product mood'
                />
              </div>
              <div className='aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300'>
                <div
                  className='w-full h-full bg-cover bg-center'
                  style={{ backgroundImage: 'url(/images/1.webp)' }}
                  role='img'
                  aria-label='Beauty product mood'
                />
              </div>
            </div>
            <div className='space-y-4 mt-8'>
              <div className='aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300'>
                <div
                  className='w-full h-full bg-cover bg-center'
                  style={{ backgroundImage: 'url(/images/2.webp)' }}
                  role='img'
                  aria-label='Fashion product mood'
                />
              </div>
              <div className='aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300'>
                <div
                  className='w-full h-full bg-cover bg-center'
                  style={{ backgroundImage: 'url(/images/3.webp)' }}
                  role='img'
                  aria-label='Home lifestyle mood'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
