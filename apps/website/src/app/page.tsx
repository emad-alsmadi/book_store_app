'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductsQuery } from '@/types';
import { useProducts } from '@/hooks/products/productsQuery';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustServiceStrip } from '@/components/home/TrustServiceStrip';
import { PopularCategories } from '@/components/home/PopularCategories';
import { DealsRail } from '@/components/home/DealsRail';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { FeaturedBrandsStrip } from '@/components/home/FeaturedBrandsStrip';
import { GiftFinderSection } from '@/components/home/GiftFinderSection';
import { RecentlyViewedSection } from '@/components/home/RecentlyViewedSection';
import { InspiredByBrowsingSection } from '@/components/home/InspiredByBrowsingSection';
import { EditorialLookbookSection } from '@/components/home/EditorialLookbookSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  const router = useRouter();
  const [query] = useState<ProductsQuery>({
    page: 1,
    limit: 16,
    // TODO(api): switch to sort=bestselling when backend supports it
    sort: 'createdAt',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const stableQuery = useMemo(() => query, [query]);
  const productsQuery = useProducts(stableQuery);
  const products = productsQuery.data?.data ?? [];
  const featuredProducts = products.slice(0, 8);
  const loading = productsQuery.isLoading;
  const error = (productsQuery.error as { message?: string } | null)?.message || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className='space-y-0'>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      <TrustServiceStrip />

      <PopularCategories />

      <DealsRail />

      <FeaturedProductsSection
        products={featuredProducts}
        loading={loading}
        error={error}
      />

      <FeaturedBrandsStrip />

      <GiftFinderSection />

      <RecentlyViewedSection />

      <InspiredByBrowsingSection
        products={products}
        loading={loading}
      />

      <EditorialLookbookSection />

      <WhyChooseUs />

      <Testimonials />

      <CTASection />
    </div>
  );
}
