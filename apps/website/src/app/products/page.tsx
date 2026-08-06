'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/products/productsQuery';
import { CategorySidebar } from '@/components/products/CategorySidebar';
import { Pagination } from '@/components/ui/Pagination';
import { useSearchParams } from 'next/navigation';

const sortOptions = [
  { value: 'createdAt', label: 'Featured' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-averageRating', label: 'Avg. Customer Review' },
  { value: '-createdAt', label: 'Newest Arrivals' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const limit = 12;

  // Reset page when category or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory, sortBy]);

  const {
    data: response,
    isLoading,
    error,
  } = useProducts({
    page: currentPage,
    limit,
    sort: sortBy,
    category,
    subcategory,
  });
  const products = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, pages: 1, limit };

  const filteredProducts = products.filter(
    (product: any) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center text-red-600'>
          <p>Failed to load products</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex gap-8'>
          {/* Sidebar */}
          <div className='hidden lg:block'>
            <CategorySidebar />
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6'
            >
              <h1 className='text-3xl font-extrabold text-gray-900 mb-2'>
                Products
              </h1>
              <p className='text-gray-600'>
                Discover amazing products for your lifestyle
              </p>
            </motion.div>

            {/* Search, Filter and Sort */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'
            >
              <div className='relative flex-1 max-w-xl w-full'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                <Input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>

              <div className='flex gap-3 w-full sm:w-auto'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent flex items-center gap-2'
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <Button
                  variant='outline'
                  className='gap-2 lg:hidden'
                >
                  <Filter className='h-4 w-4' />
                  Filters
                </Button>
              </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className='mb-6 text-sm text-gray-600'
            >
              Showing {filteredProducts.length} of {meta.total} results
            </motion.div>

            {/* Products Grid */}
            {filteredProducts && filteredProducts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                >
                  {filteredProducts.map((product: any) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </motion.div>

                {/* Pagination */}
                {meta.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mt-8'
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalPages={meta.pages}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='text-center py-12 bg-white rounded-xl border border-gray-100'
              >
                <p className='text-gray-500 text-lg'>
                  {searchQuery
                    ? 'No products found matching your search.'
                    : 'No products available.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
