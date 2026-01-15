import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const heroImage = getPlaceholderImage("hero");
  const featuredProducts = getFeaturedProducts(4);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-fade-in-up">
            Embrace Your Natural Radiance
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up animation-delay-300">
            Discover bespoke skincare, crafted for you. Powered by intelligence,
            perfected by nature.
          </p>
          <Button asChild size="lg" className="animate-fade-in-up animation-delay-600">
            <Link href="/products">
              Shop All Products <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
            Featured Collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/products">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
