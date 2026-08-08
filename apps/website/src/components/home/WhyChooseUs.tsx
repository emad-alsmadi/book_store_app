'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Truck,
  HeadphonesIcon,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import { useWhyChooseUs } from '@/hooks/storefront/whyChooseUsQuery';

const ICON_MAP: Record<string, LucideIcon> = {
  truck: Truck,
  refresh: RotateCcw,
  shield: Shield,
  headset: HeadphonesIcon,
};

const FALLBACK = [
  {
    id: 'delivery',
    icon: 'truck',
    title: 'Reliable delivery',
    description: 'Clear shipping options and tracking on every order',
  },
  {
    id: 'returns',
    icon: 'refresh',
    title: 'Easy returns',
    description: 'Straightforward returns within our store policy window',
  },
  {
    id: 'payments',
    icon: 'shield',
    title: 'Secure payments',
    description: 'Checkout protected with industry-standard encryption',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Care support',
    description: 'Friendly help when you need sizing, gifts, or order care',
  },
];

export function WhyChooseUs() {
  const q = useWhyChooseUs();
  const features =
    q.data && q.data.length > 0 ? q.data : FALLBACK;

  return (
    <div className='bg-slate-100 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Why shop TrendVaulta
          </h2>
          <p className='text-gray-600 text-lg'>
            A calmer retail experience for beauty, fashion, and lifestyle
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature) => {
            const Icon =
              ICON_MAP[feature.icon || ''] || ICON_MAP.truck || Truck;
            return (
              <motion.div
                key={feature.id || feature.title}
                whileHover={{ y: -4 }}
                className='bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-slate-200'
              >
                <div className='inline-flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-cyan-500 text-white mb-4'>
                  <Icon className='h-8 w-8' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2 text-lg'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 text-sm'>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
