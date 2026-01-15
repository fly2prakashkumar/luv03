
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { searchProducts } from '@/lib/products';
import { ProductCard } from '@/components/products/product-card';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const products = query ? searchProducts(query) : [];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        {query ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">
              Search Results for "{query}"
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {products.length > 0
                ? `Found ${products.length} product(s).`
                : 'No products found matching your search.'}
            </p>
          </>
        ) : (
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Search for Products
          </h1>
        )}
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
