import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import type { ProductsQuery, ProductsResponse, Product } from '@/types';

export function productsListKey(query: ProductsQuery) {
  return ['products', 'list', query] as const;
}

export function productByIdKey(id: string) {
  return ['products', 'byId', id] as const;
}

export function useProducts(query: ProductsQuery) {
  return useQuery<ProductsResponse>({
    queryKey: productsListKey(query),
    queryFn: async () => {
      return await productsApi.getProducts(query);
    },
    staleTime: 30_000,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}

export function useProductById(id?: string) {
  return useQuery<Product>({
    queryKey: id ? productByIdKey(id) : ['products', 'byId', 'missing'],
    queryFn: async () => {
      if (!id) throw new Error('Missing product id');
      return await productsApi.getProductById(id);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
    retry: 1,
  });
}
