
"use client";

import { getProductById } from "@/lib/products";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductById(params.id);
  const router = useRouter();

  if (!product) {
    notFound();
  }

  const placeholder = getPlaceholderImage(product.imageId);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
       <div className="mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
          <p className="text-2xl font-semibold">₹{product.price.toFixed(2)}</p>
          <Separator />
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <div className="mt-4">
            <AddToCartButton product={product} className="w-full md:w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
