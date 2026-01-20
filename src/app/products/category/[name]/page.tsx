
"use client";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams, notFound } from "next/navigation";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: allProducts, isLoading } = useCollection<Product>(productsCollection);

  const { categoryName, products } = useMemo(() => {
    if (!name) return { categoryName: '', products: [] };
    const decodedName = decodeURIComponent(name).replace(/-/g, ' ');
    const filteredProducts = allProducts?.filter(p => 
      p.category.toLowerCase().replace(/&/g, 'and') === decodedName.toLowerCase().replace(/&/g, 'and')
    ) || [];

    return { categoryName: decodedName, products: filteredProducts };
  }, [name, allProducts]);

  if (!isLoading && products.length === 0) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline capitalize">
            {categoryName}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of {categoryName} products, crafted with the finest ingredients.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
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
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </div>
  );
}

    