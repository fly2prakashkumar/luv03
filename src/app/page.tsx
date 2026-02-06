
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/products/product-card";
import { ArrowRight, Leaf, FlaskConical, Recycle, Microscope, Zap, Wind, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Oxygen-Activated",
    description: "Botanical oils empowered by deep oxygen enrichment for superior vitality.",
  },
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Ayurvedic Intelligence",
    description: "Classic skin intelligence meets modern ozone science for targeted care.",
  },
  {
    icon: <Wind className="h-8 w-8" />,
    title: "Resilient Defense",
    description: "Maintains skin resilience against environmental stress and poor air quality.",
  },
  {
    icon: <Microscope className="h-8 w-8" />,
    title: "Precision Formulated",
    description: "Crafted in-house to guarantee the highest levels of purity and performance.",
  },
];

const collections = [
    {
        title: "Amber Collection",
        subtitle: "Vata Skin",
        description: "For dry and aging skin. Deeply nourishing and restorative.",
        color: "bg-orange-500/10 border-orange-500/20 text-orange-700",
        icon: <Droplets className="h-6 w-6" />
    },
    {
        title: "Blue Collection",
        subtitle: "Pitta Skin",
        description: "For sensitive and inflamed skin. Cooling, calming, and protective.",
        color: "bg-blue-500/10 border-blue-500/20 text-blue-700",
        icon: <Wind className="h-6 w-6" />
    },
    {
        title: "Green Collection",
        subtitle: "Kapha Skin",
        description: "For oily and congested skin. Lightweight, balancing, and refining.",
        color: "bg-green-500/10 border-green-500/20 text-green-700",
        icon: <Leaf className="h-6 w-6" />
    }
]

const testimonials = [
    {
        quote: "My skin has never felt better! The Radiant Glow Serum is a game-changer. I saw a visible difference in just a week.",
        name: "Priya Sharma",
        location: "Mumbai",
        avatarId: "testimonial-1",
    },
    {
        quote: "I've struggled with sensitive skin for years, but the Gentle Purifying Cleanser is amazing. It's so mild yet effective.",
        name: "Rahul Verma",
        location: "Delhi",
        avatarId: "testimonial-2",
    },
    {
        quote: "The Hydro-Boost Moisturizer is my holy grail. It's lightweight, hydrating, and perfect under makeup. Highly recommend!",
        name: "Ananya Reddy",
        location: "Bangalore",
        avatarId: "testimonial-3",
    }
];

const heroSlides = [
    {
        id: "hero",
        title: "Luv O3™ — Precision Ozonated Skincare",
        subtitle: "Where advanced ozone science meets classical Ayurvedic skin intelligence.",
        buttonText: "Shop the Collections",
        buttonLink: "/products"
    },
    {
        id: "hero-2",
        title: "Oxygen-Activated Botanical Oils",
        subtitle: "Designed to support the skin's natural balance through deep oxygen enrichment.",
        buttonText: "Our Story",
        buttonLink: "/about"
    },
    {
        id: "hero-3",
        title: "Vitality Under Any Stress",
        subtitle: "Maintain skin vitality even under environmental stress and poor air quality.",
        buttonText: "Discover Products",
        buttonLink: "/products"
    }
]


export default function Home() {
  const firestore = useFirestore();
  const featuredProductsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), limit(4)) : null),
    [firestore]
  );
  const { data: featuredProducts, isLoading } = useCollection<Product>(featuredProductsQuery);
  
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );


  return (
    <div className="flex flex-col">
       <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {heroSlides.map((slide) => {
              const slideImage = getPlaceholderImage(slide.id);
              return (
                <CarouselItem key={slide.id}>
                  <div className="relative w-full h-[60vh] md:h-[70vh]">
                    {slideImage && (
                      <Image
                        src={slideImage.imageUrl}
                        alt={slideImage.description}
                        fill
                        className="object-cover"
                        priority={slide.id === 'hero'}
                        data-ai-hint={slideImage.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                      <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-fade-in-up">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up animation-delay-300 font-semibold italic">
                        {slide.subtitle}
                      </p>
                      <Button asChild size="lg" className="animate-fade-in-up animation-delay-600">
                        <Link href={slide.buttonLink}>
                          {slide.buttonText} <ArrowRight className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Featured Collection */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
            Featured Formulations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
              : featuredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/products">
                Explore Full Range
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Philosophy Section */}
      <section className="py-12 md:py-24 bg-muted/30" id="philosophy">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block px-4 py-1.5 mb-2 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                    Our Philosophy
                </div>
                <h2 className="text-3xl md:text-5xl font-headline font-bold">Luv O3™ — Precision Ozonated Skincare</h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium italic">
                    Where advanced ozone science meets classical Ayurvedic skin intelligence.
                </p>
                <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Luv O3 formulates ozonated skincare tailored to specific skin constitutions. Each product is designed to support the skin's natural balance through oxygen-activated botanical oils, delivering targeted care beyond surface treatment.
                    </p>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Powered by deep oxygen enrichment, Luv O3 creams help maintain skin vitality and resilience—even under environmental stress and poor air quality.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Skin Constitution Collections */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Ozonated Formulations by Skin Constitution</h2>
                <p className="mt-4 text-muted-foreground text-lg">Targeted Care by Skin Constitution</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {collections.map((col, index) => (
                    <Card key={index} className={cn("flex flex-col border-2 transition-transform hover:-translate-y-1", col.color)}>
                        <CardHeader className="text-center">
                            <div className="mx-auto p-3 rounded-full bg-background mb-4 text-primary shadow-sm w-fit">
                                {col.icon}
                            </div>
                            <CardTitle className="font-headline text-2xl">{col.title}</CardTitle>
                            <CardDescription className="text-lg font-semibold">{col.subtitle}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center flex-grow">
                            <p className="text-muted-foreground leading-relaxed">
                                {col.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <p className="text-center mt-12 text-muted-foreground font-medium max-w-2xl mx-auto">
                All other Luv O3 formulations are suitable for all skin types and designed for daily skin equilibrium.
            </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
                Why Choose Luv O3?
            </h2>
          </div>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="text-center flex flex-col items-center">
                        <div className="p-4 text-primary mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-headline font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>
        
      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Real Results from Real People
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => {
                const avatarImage = getPlaceholderImage(testimonial.avatarId);
                return (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                        <Card className="h-full flex flex-col justify-between">
                            <CardContent className="p-6">
                            <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            </CardContent>
                            <CardHeader className="pt-0">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={testimonial.name} data-ai-hint={avatarImage.imageHint}/>}
                                        <AvatarFallback className="font-bold text-black">{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                        </div>
                    </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

    </div>
  );
}
