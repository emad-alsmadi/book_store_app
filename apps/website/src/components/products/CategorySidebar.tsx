'use client';

import Link from 'next/link';
import { ChevronRight, X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const categories = [
  {
    name: 'Makeup',
    slug: 'makeup',
    subcategories: [
      'foundation',
      'lipstick',
      'eyeshadow',
      'mascara',
      'blush',
      'concealer',
      'primer',
      'setting-spray',
    ],
  },
  {
    name: 'Perfumes',
    slug: 'perfumes',
    subcategories: [
      'eau-de-parfum',
      'eau-de-toilette',
      'body-mist',
      'gift-sets',
      'cologne',
      'roll-on',
    ],
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    subcategories: [
      'dresses',
      'tops',
      'pants',
      'jackets',
      'accessories',
      'sweaters',
      'skirts',
      'activewear',
    ],
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    subcategories: [
      'cleanser',
      'moisturizer',
      'serum',
      'sunscreen',
      'masks',
      'toner',
      'exfoliator',
      'eye-cream',
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    subcategories: [
      'jewelry',
      'bags',
      'scarves',
      'belts',
      'watches',
      'sunglasses',
      'hats',
      'wallets',
    ],
  },
  {
    name: 'Home and Living',
    slug: 'home',
    subcategories: [
      'decor',
      'kitchen',
      'bedding',
      'lighting',
      'furniture',
      'rugs',
      'curtains',
      'organization',
    ],
  },
];

/** DEMO — Amazon-style “shopping ideas” shortcuts (href-only, no scraped copy) */
const shoppingIdeas = [
  { label: 'Face', href: '/products?category=skincare' },
  { label: 'Makeup', href: '/products?category=makeup' },
  { label: 'Fragrance', href: '/products?category=perfumes' },
  { label: 'Ready-to-wear', href: '/products?category=clothing' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Red', code: '#EF4444' },
  { name: 'Blue', code: '#3B82F6' },
  { name: 'Green', code: '#10B981' },
  { name: 'Yellow', code: '#F59E0B' },
  { name: 'Pink', code: '#EC4899' },
  { name: 'Purple', code: '#8B5CF6' },
];

const ratings = [
  { value: 4, label: '4★ & Up' },
  { value: 3, label: '3★ & Up' },
  { value: 2, label: '2★ & Up' },
  { value: 1, label: '1★ & Up' },
];

type Props = {
  /** Close mobile drawer after category navigation / apply */
  onAfterNavigate?: () => void;
};

export function CategorySidebar({ onAfterNavigate }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category');
  const currentSubcategory = searchParams.get('subcategory');
  const urlMin = searchParams.get('minPrice');
  const urlMax = searchParams.get('maxPrice');
  const urlRating = searchParams.get('minRating');
  const urlSizes = (searchParams.get('size') || '')
    .split(',')
    .filter(Boolean);
  const urlColors = (searchParams.get('color') || '')
    .split(',')
    .filter(Boolean);

  const [priceMin, setPriceMin] = useState(urlMin || '0');
  const [priceMax, setPriceMax] = useState(urlMax || '500');
  const [expandedSections, setExpandedSections] = useState({
    ideas: true,
    categories: true,
    price: true,
    size: false,
    color: false,
    rating: false,
  });

  useEffect(() => {
    setPriceMin(urlMin || '0');
    setPriceMax(urlMax || '500');
  }, [urlMin, urlMax]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
    onAfterNavigate?.();
  };

  const toggleSize = (size: string) => {
    pushParams((params) => {
      const next = urlSizes.includes(size)
        ? urlSizes.filter((s) => s !== size)
        : [...urlSizes, size];
      if (next.length) params.set('size', next.join(','));
      else params.delete('size');
    });
  };

  const toggleColor = (color: string) => {
    pushParams((params) => {
      const next = urlColors.includes(color)
        ? urlColors.filter((c) => c !== color)
        : [...urlColors, color];
      if (next.length) params.set('color', next.join(','));
      else params.delete('color');
    });
  };

  const applyPrice = () => {
    pushParams((params) => {
      const min = Number(priceMin);
      const max = Number(priceMax);
      if (!Number.isNaN(min) && min > 0) params.set('minPrice', String(min));
      else params.delete('minPrice');
      if (!Number.isNaN(max) && max > 0) params.set('maxPrice', String(max));
      else params.delete('maxPrice');
    });
  };

  const setRating = (value: number) => {
    pushParams((params) => {
      if (urlRating === String(value)) params.delete('minRating');
      else params.set('minRating', String(value));
    });
  };

  const clearFilters = () => {
    router.push('/products');
    onAfterNavigate?.();
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
      urlMin ||
      urlMax ||
      urlRating ||
      urlSizes.length ||
      urlColors.length,
  );

  return (
    <div className='w-full lg:w-64 lg:shrink-0'>
      <div className='rounded-xl border border-stone-100 bg-white p-4 shadow-sm lg:sticky lg:top-20'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-stone-900'>Filters</h3>
          {hasActiveFilters && (
            <button
              type='button'
              onClick={clearFilters}
              className='flex items-center gap-1 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-700'
            >
              <X className='h-3 w-3' />
              Clear All
            </button>
          )}
        </div>

        {/* Shopping ideas */}
        <div className='mb-4 border-b border-stone-100 pb-4'>
          <button
            type='button'
            onClick={() => toggleSection('ideas')}
            className='mb-3 flex w-full items-center justify-between'
          >
            <h4 className='text-sm font-semibold text-stone-900'>
              Popular ideas
            </h4>
            {expandedSections.ideas ? (
              <ChevronUp className='h-4 w-4 text-stone-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-stone-500' />
            )}
          </button>
          {expandedSections.ideas && (
            <ul className='flex flex-wrap gap-2'>
              {shoppingIdeas.map((idea) => (
                <li key={idea.label}>
                  <Link
                    href={idea.href}
                    onClick={() => onAfterNavigate?.()}
                    className='inline-block rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700 hover:border-fuchsia-300 hover:text-fuchsia-700'
                  >
                    {idea.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Categories */}
        <div className='mb-4 border-b border-stone-100 pb-4'>
          <button
            type='button'
            onClick={() => toggleSection('categories')}
            className='mb-3 flex w-full items-center justify-between'
          >
            <h4 className='text-sm font-semibold text-stone-900'>Categories</h4>
            {expandedSections.categories ? (
              <ChevronUp className='h-4 w-4 text-stone-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-stone-500' />
            )}
          </button>

          {expandedSections.categories && (
            <nav className='space-y-1'>
              {categories.map((category) => (
                <div key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    onClick={() => onAfterNavigate?.()}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      currentCategory === category.slug
                        ? 'bg-fuchsia-50 font-medium text-fuchsia-700'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <ChevronRight className='h-4 w-4' />
                  </Link>

                  {currentCategory === category.slug && (
                    <div className='ml-4 mt-1 space-y-1'>
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/products?category=${category.slug}&subcategory=${sub}`}
                          onClick={() => onAfterNavigate?.()}
                          className={`block px-3 py-1.5 text-xs capitalize transition-colors ${
                            currentSubcategory === sub
                              ? 'font-semibold text-fuchsia-700'
                              : 'text-stone-600 hover:text-fuchsia-600'
                          }`}
                        >
                          {sub.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className='mt-3 border-t border-stone-200 pt-3'>
                <Link
                  href='/products'
                  onClick={() => onAfterNavigate?.()}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    !currentCategory
                      ? 'bg-fuchsia-50 font-medium text-fuchsia-700'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  All Products
                </Link>
              </div>
            </nav>
          )}
        </div>

        {/* Price Range — API-backed */}
        <div className='mb-4 border-b border-stone-100 pb-4'>
          <button
            type='button'
            onClick={() => toggleSection('price')}
            className='mb-3 flex w-full items-center justify-between'
          >
            <h4 className='text-sm font-semibold text-stone-900'>Price</h4>
            {expandedSections.price ? (
              <ChevronUp className='h-4 w-4 text-stone-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-stone-500' />
            )}
          </button>

          {expandedSections.price && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <label className='sr-only' htmlFor='filter-min-price'>
                  Min price
                </label>
                <span className='text-xs font-medium text-stone-500'>$</span>
                <input
                  id='filter-min-price'
                  type='number'
                  min={0}
                  placeholder='Min'
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className='w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                />
              </div>
              <div className='flex items-center gap-2'>
                <label className='sr-only' htmlFor='filter-max-price'>
                  Max price
                </label>
                <span className='text-xs font-medium text-stone-500'>$</span>
                <input
                  id='filter-max-price'
                  type='number'
                  min={0}
                  placeholder='Max'
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className='w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                />
              </div>
              <button
                type='button'
                onClick={applyPrice}
                className='w-full rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-800'
              >
                Apply price
              </button>
            </div>
          )}
        </div>

        {/* Size — DEMO client facet */}
        <div className='mb-4 border-b border-stone-100 pb-4'>
          <button
            type='button'
            onClick={() => toggleSection('size')}
            className='mb-3 flex w-full items-center justify-between'
          >
            <h4 className='text-sm font-semibold text-stone-900'>
              Size{' '}
              <span className='font-normal text-stone-400'>(demo)</span>
            </h4>
            {expandedSections.size ? (
              <ChevronUp className='h-4 w-4 text-stone-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-stone-500' />
            )}
          </button>

          {expandedSections.size && (
            <div className='flex flex-wrap gap-2'>
              {sizes.map((size) => (
                <button
                  key={size}
                  type='button'
                  onClick={() => toggleSize(size)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                    urlSizes.includes(size)
                      ? 'border-fuchsia-600 bg-fuchsia-50 font-medium text-fuchsia-700'
                      : 'border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color — DEMO client facet */}
        <div className='mb-4 border-b border-stone-100 pb-4'>
          <button
            type='button'
            onClick={() => toggleSection('color')}
            className='mb-3 flex w-full items-center justify-between'
          >
            <h4 className='text-sm font-semibold text-stone-900'>
              Color{' '}
              <span className='font-normal text-stone-400'>(demo)</span>
            </h4>
            {expandedSections.color ? (
              <ChevronUp className='h-4 w-4 text-stone-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-stone-500' />
            )}
          </button>

          {expandedSections.color && (
            <div className='flex flex-wrap gap-3'>
              {colors.map((color) => (
                <button
                  key={color.name}
                  type='button'
                  onClick={() => toggleColor(color.name)}
                  className={`h-7 w-7 rounded-full border-2 transition-all hover:scale-110 ${
                    urlColors.includes(color.name)
                      ? 'border-fuchsia-600 ring-2 ring-fuchsia-200'
                      : 'border-stone-300 hover:border-stone-400'
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                  aria-label={`Filter by ${color.name}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rating — DEMO client facet */}
        <div>
          <button
            type='button'
            onClick={() => toggleSection('rating')}
            className='mb-3 flex w-full items-center justify-between'
          >
            <h4 className='text-sm font-semibold text-stone-900'>
              Customer rating{' '}
              <span className='font-normal text-stone-400'>(demo)</span>
            </h4>
            {expandedSections.rating ? (
              <ChevronUp className='h-4 w-4 text-stone-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-stone-500' />
            )}
          </button>

          {expandedSections.rating && (
            <div className='space-y-2'>
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  type='button'
                  onClick={() => setRating(rating.value)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    urlRating === String(rating.value)
                      ? 'bg-fuchsia-50 text-fuchsia-700'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating.value
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
