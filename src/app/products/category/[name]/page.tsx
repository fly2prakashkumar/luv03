
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

const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, ' and ') // "Bath & Body" -> "bath and body"
    .replace(/\s+/g, '-');       // "bath and body" -> "bath-and-body"
}

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
    if (!name || !allProducts) {
      const title = name ? name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "";
      return { categoryName: title, products: [] };
    }

    const filteredProducts = allProducts.filter(p => {
      if (!p.category) return false;
      // Slugify the product's category and compare with the slug from the URL
      return slugify(p.category) === name;
    });
    
    // Try to find the original category name from the first matching product for the title
    const displayTitle = filteredProducts.length > 0
        ? filteredProducts[0].category
        : name.replace(/-/g, ' ').replace(/ and /g, ' & ').replace(/\b\w/g, l => l.toUpperCase());

    return { categoryName: displayTitle, products: filteredProducts };
  }, [name, allProducts]);

  const showLoading = isLoading || !name;

  if (!showLoading && products.length === 0) {
    // If we have a category name but no products are found after loading, show 404.
    // This prevents showing 404 for valid categories that are temporarily empty.
    // To make this more robust, you might check if the category itself is a valid one against a predefined list.
    // For now, if allProducts have loaded and we still find no matches, we assume it's a page not found.
    if(allProducts) {
       notFound();
    }
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
          {showLoading
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
