
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { ArrowRight, Leaf, FlaskConical, Recycle, Microscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Organic Ingredients",
    description: "Pure oils. No harsh chemicals. Skin-safe and earth-friendly.",
  },
  {
    icon: <FlaskConical className="h-8 w-8" />,
    title: "Lab-Grade Quality",
    description: "Produced in certified facilities for consistent results.",
  },
  {
    icon: <Recycle className="h-8 w-8" />,
    title: "Eco Packaging",
    description: "Recyclable, sustainable, and plastic-conscious choices.",
  },
  {
    icon: <Microscope className="h-8 w-8" />,
    title: "Science Meets Nature",
    description: "Advanced skincare inspired by ozone research.",
  },
];


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
          <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up animation-delay-300 font-semibold">
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
      
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Where Nature Meets Innovation</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                The ozonia herbs is India's first advanced skin and oral care products using ozonated organic oils. Everything is crafted in-house in labs to guarantee the highest levels of purity, potency, and performance for every skin type.
            </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
                What Sets Us Apart
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="text-center bg-card p-6 flex flex-col items-center">
                        <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
                            {feature.icon}
                        </div>
                        <CardTitle className="text-xl font-headline mb-2">{feature.title}</CardTitle>
                        <CardContent className="p-0 text-muted-foreground text-sm">
                            <p>{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
      </section>

    </div>
  );
}
