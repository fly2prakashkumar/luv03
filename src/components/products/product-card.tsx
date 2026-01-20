
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

  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block aspect-square relative">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline leading-tight mb-1">
          <Link href={`/products/${product.id}`} className="transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="font-semibold text-md">₹{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
