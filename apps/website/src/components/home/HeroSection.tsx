'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  DEMO_HERO_SLIDES,
  type DemoHeroSlide,
} from '@/data/demoStorefront';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  /** Override for future API; defaults to DEMO slides */
  slides?: DemoHeroSlide[];
}

const TONE_OVERLAY: Record<DemoHeroSlide['tone'], string> = {
  rose: 'from-stone-950/75 via-rose-950/45 to-stone-950/20',
  stone: 'from-stone-950/80 via-stone-900/50 to-stone-950/25',
  teal: 'from-stone-950/75 via-teal-950/40 to-stone-950/20',
};

const AUTO_MS = 6500;

/** DEMO hero carousel — TODO(api): storefront home hero module */
export function HeroSection({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  slides = DEMO_HERO_SLIDES,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const slide = slides[index] ?? slides[0];

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (reduceMotion || paused || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, count]);

  if (!slide) return null;

  return (
    <section
      aria-roledescription='carousel'
      aria-label='Featured campaigns'
      className='relative overflow-hidden'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className='relative min-h-[520px] sm:min-h-[560px] lg:min-h-[600px]'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={slide.id}
            role='group'
            aria-roledescription='slide'
            aria-label={`${index + 1} of ${count}: ${slide.title}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45 }}
            className='absolute inset-0'
          >
            <img
              src={slide.imageUrl}
              alt=''
              className='absolute inset-0 h-full w-full object-cover'
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${TONE_OVERLAY[slide.tone]}`}
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>

        <div className='relative z-10 mx-auto flex min-h-[520px] max-w-[1400px] flex-col justify-center px-4 py-14 sm:min-h-[560px] sm:px-6 sm:py-16 lg:min-h-[600px] lg:px-8'>
          <div className='max-w-xl text-white'>
            <p className='text-sm font-semibold uppercase tracking-[0.22em] text-white/90'>
              TrendVaulta
            </p>
            <p className='mt-3 text-xs font-medium uppercase tracking-wider text-white/70'>
              {slide.eyebrow}
              <span className='sr-only'> · Demo campaign slide</span>
            </p>
            <h1 className='mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
              {slide.title}
            </h1>
            <p className='mt-3 max-w-md text-base text-white/85 sm:text-lg'>
              {slide.body}
            </p>

            <div className='mt-6 flex flex-wrap gap-3'>
              <Link
                href={slide.ctaHref}
                className='inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
              >
                {slide.ctaLabel}
              </Link>
              {slide.secondaryCtaLabel && slide.secondaryCtaHref ? (
                <Link
                  href={slide.secondaryCtaHref}
                  className='inline-flex items-center rounded-lg border border-white/50 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
                >
                  {slide.secondaryCtaLabel}
                </Link>
              ) : null}
            </div>

            <form
              onSubmit={onSearchSubmit}
              className='relative mt-8 max-w-xl'
              role='search'
            >
              <label htmlFor='home-search' className='sr-only'>
                Search products
              </label>
              <input
                id='home-search'
                type='search'
                placeholder='Search beauty, fashion, lifestyle…'
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className='w-full rounded-lg border border-white/20 bg-white/95 py-3.5 pl-11 pr-28 text-stone-900 placeholder:text-stone-500 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30'
              />
              <Search
                className='pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400'
                aria-hidden
              />
              <button
                type='submit'
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800'
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type='button'
              onClick={goPrev}
              aria-label='Previous slide'
              className='absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-900 shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 sm:left-5 sm:inline-flex'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              type='button'
              onClick={goNext}
              aria-label='Next slide'
              className='absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-900 shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 sm:right-5 sm:inline-flex'
            >
              <ChevronRight className='h-5 w-5' />
            </button>

            <div
              className='absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2'
              role='tablist'
              aria-label='Choose slide'
            >
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type='button'
                  role='tab'
                  aria-selected={i === index}
                  aria-label={`Show slide ${i + 1}: ${item.title}`}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    i === index
                      ? 'w-7 bg-white'
                      : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
