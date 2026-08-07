'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import {
  DEMO_GIFT_FINDER,
  buildGiftFinderHref,
  type DemoGiftFinderConfig,
  type DemoGiftOption,
} from '@/data/demoStorefront';

type Props = {
  config?: DemoGiftFinderConfig;
};

function ChipGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: DemoGiftOption[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className='mb-2 text-sm font-semibold text-stone-900'>
        {legend}
      </legend>
      <div className='flex flex-wrap gap-2'>
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type='button'
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 ${
                selected
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** DEMO module — TODO(api): GET /api/storefront/gift-finder */
export function GiftFinderSection({ config = DEMO_GIFT_FINDER }: Props) {
  const [occasionId, setOccasionId] = useState<string | null>(
    config.occasions[0]?.id ?? null,
  );
  const [recipientId, setRecipientId] = useState<string | null>(
    config.recipients[0]?.id ?? null,
  );
  const [budgetId, setBudgetId] = useState<string | null>(
    config.budgets[3]?.id ?? config.budgets[0]?.id ?? null,
  );

  const href = useMemo(
    () => buildGiftFinderHref({ occasionId, recipientId, budgetId }),
    [occasionId, recipientId, budgetId],
  );

  return (
    <section
      aria-labelledby='gift-finder-heading'
      className='border-t border-stone-200 bg-white py-12 sm:py-16'
    >
      <div className='mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className='overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-rose-50 via-white to-amber-50'
        >
          <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]'>
            <div className='p-6 sm:p-8 lg:p-10'>
              <p className='inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-rose-700'>
                <Gift className='h-3.5 w-3.5' aria-hidden />
                Demo gift finder
              </p>
              <h2
                id='gift-finder-heading'
                className='mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl'
              >
                Find a thoughtful gift
              </h2>
              <p className='mt-2 max-w-md text-sm text-stone-600'>
                Pick an occasion, who it’s for, and a budget — we’ll route you
                to matching products. Original TrendVaulta demo; replace with
                API later.
              </p>

              <div className='mt-6 space-y-5'>
                <ChipGroup
                  legend='Occasion'
                  options={config.occasions}
                  value={occasionId}
                  onChange={setOccasionId}
                />
                <ChipGroup
                  legend='Who is it for?'
                  options={config.recipients}
                  value={recipientId}
                  onChange={setRecipientId}
                />
                <ChipGroup
                  legend='Budget'
                  options={config.budgets}
                  value={budgetId}
                  onChange={setBudgetId}
                />
              </div>

              <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'>
                <Link
                  href={href}
                  className='inline-flex items-center justify-center rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2'
                >
                  Show gift ideas
                </Link>
                <p className='text-xs text-stone-500'>
                  Opens catalog with demo filters applied.
                </p>
              </div>
            </div>

            <div className='relative min-h-[220px] border-t border-stone-200/80 lg:border-l lg:border-t-0'>
              <img
                src='/images/4.webp'
                alt=''
                className='absolute inset-0 h-full w-full object-cover'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-stone-900/35 via-transparent to-transparent' />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
