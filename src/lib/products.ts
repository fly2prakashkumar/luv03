import type { Product } from './types';

// This file is no longer the source of truth for products.
// All product data is now fetched directly from Firestore in real-time.
// These functions are deprecated.

export function getAllProducts(): Product[] {
  console.warn("`getAllProducts` from `lib/products` is deprecated. Please use `useCollection` from Firebase.");
  return [];
}

export function getProductById(id: string): Product | undefined {
  console.warn("`getProductById` from `lib/products` is deprecated. Please use `useDoc` from Firebase.");
  return undefined;
}

export function getProductsByCategory(category: string): Product[] {
   console.warn("`getProductsByCategory` from `lib/products` is deprecated. Please use `useCollection` and filter.");
  return [];
}

export function getFeaturedProducts(count: number): Product[] {
  console.warn("`getFeaturedProducts` from `lib/products` is deprecated. Please use `useCollection` with a query limit.");
  return [];
}

export function searchProducts(query: string): Product[] {
  console.warn("`searchProducts` from `lib/products` is deprecated. Please fetch from Firestore and filter on the client.");
  return [];
}
