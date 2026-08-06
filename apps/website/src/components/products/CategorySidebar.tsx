'use client';

import Link from 'next/link';
import { ChevronRight, X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

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

export function CategorySidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category');

  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    size: false,
    color: false,
    rating: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 500 });
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedRating(null);
    router.push('/products');
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedRating !== null;

  return (
    <div className='w-64 shrink-0'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-gray-900 text-lg'>Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='text-xs text-fuchsia-600 hover:text-fuchsia-700 flex items-center gap-1 font-medium'
            >
              <X className='h-3 w-3' />
              Clear All
            </button>
          )}
        </div>

        {/* Categories */}
        <div className='mb-4 border-b border-gray-100 pb-4'>
          <button
            onClick={() => toggleSection('categories')}
            className='flex items-center justify-between w-full mb-3'
          >
            <h4 className='text-sm font-semibold text-gray-900'>Categories</h4>
            {expandedSections.categories ? (
              <ChevronUp className='h-4 w-4 text-gray-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-gray-500' />
            )}
          </button>

          {expandedSections.categories && (
            <nav className='space-y-1'>
              {categories.map((category) => (
                <div key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentCategory === category.slug
                        ? 'bg-fuchsia-50 text-fuchsia-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
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
                          className='block px-3 py-1.5 text-xs text-gray-600 hover:text-fuchsia-600 transition-colors capitalize'
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className='mt-3 pt-3 border-t border-gray-200'>
                <Link
                  href='/products'
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !currentCategory
                      ? 'bg-fuchsia-50 text-fuchsia-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </Link>
              </div>
            </nav>
          )}
        </div>

        {/* Price Range */}
        <div className='mb-4 border-b border-gray-100 pb-4'>
          <button
            onClick={() => toggleSection('price')}
            className='flex items-center justify-between w-full mb-3'
          >
            <h4 className='text-sm font-semibold text-gray-900'>Price Range</h4>
            {expandedSections.price ? (
              <ChevronUp className='h-4 w-4 text-gray-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-gray-500' />
            )}
          </button>

          {expandedSections.price && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500 font-medium'>$</span>
                <input
                  type='number'
                  placeholder='Min'
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent'
                />
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500 font-medium'>$</span>
                <input
                  type='number'
                  placeholder='Max'
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent'
                />
              </div>
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div className='mb-4 border-b border-gray-100 pb-4'>
          <button
            onClick={() => toggleSection('size')}
            className='flex items-center justify-between w-full mb-3'
          >
            <h4 className='text-sm font-semibold text-gray-900'>Size</h4>
            {expandedSections.size ? (
              <ChevronUp className='h-4 w-4 text-gray-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-gray-500' />
            )}
          </button>

          {expandedSections.size && (
            <div className='flex flex-wrap gap-2'>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                    selectedSizes.includes(size)
                      ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className='mb-4 border-b border-gray-100 pb-4'>
          <button
            onClick={() => toggleSection('color')}
            className='flex items-center justify-between w-full mb-3'
          >
            <h4 className='text-sm font-semibold text-gray-900'>Color</h4>
            {expandedSections.color ? (
              <ChevronUp className='h-4 w-4 text-gray-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-gray-500' />
            )}
          </button>

          {expandedSections.color && (
            <div className='flex flex-wrap gap-3'>
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColors.includes(color.name)
                      ? 'border-fuchsia-600 ring-2 ring-fuchsia-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className='flex items-center justify-between w-full mb-3'
          >
            <h4 className='text-sm font-semibold text-gray-900'>
              Customer Rating
            </h4>
            {expandedSections.rating ? (
              <ChevronUp className='h-4 w-4 text-gray-500' />
            ) : (
              <ChevronDown className='h-4 w-4 text-gray-500' />
            )}
          </button>

          {expandedSections.rating && (
            <div className='space-y-2'>
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() =>
                    setSelectedRating(
                      selectedRating === rating.value ? null : rating.value,
                    )
                  }
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedRating === rating.value
                      ? 'bg-fuchsia-50 text-fuchsia-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating.value
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
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
