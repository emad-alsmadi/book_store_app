'use client';

import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <section
      aria-labelledby='hero-heading'
      className='relative overflow-hidden border-b border-stone-200/80'
    >
      {/* Atmosphere — TrendVaulta brand gradient, not a flat fill */}
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl'
        aria-hidden
      />

      <div className='relative mx-auto grid max-w-7xl grid-cols-1 items-stretch lg:grid-cols-2'>
        {/* Copy column */}
        <div className='flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20'>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-700 sm:text-sm'
          >
            TrendVaulta
          </motion.p>

          <motion.h1
            id='hero-heading'
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className='mt-3 max-w-xl text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]'
          >
            Curated beauty & style for everyday polish
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className='mt-4 max-w-md text-base text-stone-600 sm:text-lg'
          >
            Shop elevated essentials with clear prices and secure checkout.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            onSubmit={onSearchSubmit}
            className='relative mt-8 max-w-xl'
            role='search'
          >
            <label
              htmlFor='home-search'
              className='sr-only'
            >
              Search products
            </label>
            <Search
              className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400'
              aria-hidden
            />
            <input
              id='home-search'
              type='search'
              placeholder='Search beauty, fashion, lifestyle…'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full rounded-xl border border-stone-200 bg-white/90 py-3.5 pl-12 pr-28 text-stone-900 shadow-sm backdrop-blur placeholder:text-stone-400 focus:border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/15'
            />
            <button
              type='submit'
              className='absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-fuchsia-700 hover:via-indigo-700 hover:to-cyan-600'
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className='mt-6 flex flex-wrap items-center gap-3'
          >
            <Link
              href='/products'
              className='inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2'
            >
              Shop the edit
              <ArrowRight
                className='h-4 w-4'
                aria-hidden
              />
            </Link>
            <Link
              href='/products?category=beauty'
              className='inline-flex items-center rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-800 backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500'
            >
              Beauty
            </Link>
            <Link
              href='/products?category=fashion'
              className='inline-flex items-center rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-800 backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500'
            >
              Fashion
            </Link>
          </motion.div>
        </div>

        {/* Dominant visual plane */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className='relative min-h-[280px] sm:min-h-[360px] lg:min-h-full'
        >
          <img
            src='/images/2.webp'
            alt=''
            className='absolute inset-0 h-full w-full object-cover'
            fetchPriority='high'
          />
          <div
            className='absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-white/35'
            aria-hidden
          />
        </motion.div>
      </div>
    </section>
  );
}
