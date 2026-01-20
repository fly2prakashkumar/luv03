
"use client";

import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const firestore = useFirestore();
  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'products', id) : null),
    [firestore, id]
  );
  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (!isLoading && !product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
       <div className="mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {isLoading || !product ? (
          <>
            <Skeleton className="aspect-square rounded-lg" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Separator />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <div className="mt-4">
                <Skeleton className="h-11 w-full md:w-40" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
          </>
        )}
      </div>
    </div>
  );
}

    