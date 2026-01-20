
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductCardProps {
  product: Product & { id: string };
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product?.id) return null;

  return (
    <Card className="flex flex-col overflow-hidden h-full group relative border-border hover:border-primary transition-all">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View product: {product.name}</span>
      </Link>
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline leading-tight mb-1 transition-colors group-hover:text-primary">
          {product.name}
        </CardTitle>
        <p className="font-semibold text-md">₹{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 z-20 bg-background">
        <AddToCartButton product={product} className="w-full" />
      </CardFooter>
    </Card>
  );
}
