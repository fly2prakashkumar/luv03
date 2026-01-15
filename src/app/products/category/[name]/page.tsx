
"use client";

import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const categoryName = decodeURIComponent(params.name).replace(/-/g, ' ');
  const products = getProductsByCategory(categoryName);

  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-transparent">
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
