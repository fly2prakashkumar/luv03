
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: allProducts, isLoading } = useCollection<Product>(productsCollection);

  const products = useMemo(() => {
    if (!query || !allProducts) return [];
    const lowerCaseQuery = query.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, allProducts]);


  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        {query ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">
              Search Results for "{query}"
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {isLoading 
                ? 'Searching...'
                : products.length > 0
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

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
           {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="p-0">
                    <Skeleton className="aspect-square w-full" />
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-1/2" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
        </div>
      ) : products.length > 0 && (
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

    