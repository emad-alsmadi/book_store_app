'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, HeadphonesIcon, RotateCcw } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: Truck,
      title: 'Reliable delivery',
      description: 'Clear shipping options and tracking on every order',
    },
    {
      icon: RotateCcw,
      title: 'Easy returns',
      description: 'Straightforward returns within our store policy window',
    },
    {
      icon: Shield,
      title: 'Secure payments',
      description: 'Checkout protected with industry-standard encryption',
    },
    {
      icon: HeadphonesIcon,
      title: 'Care support',
      description: 'Friendly help when you need sizing, gifts, or order care',
    },
  ];

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
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -4 }}
              className='bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-slate-200'
            >
              <div className='inline-flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-cyan-500 text-white mb-4'>
                <feature.icon className='h-8 w-8' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2 text-lg'>
                {feature.title}
              </h3>
              <p className='text-gray-600 text-sm'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
