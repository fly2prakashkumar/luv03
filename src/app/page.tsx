
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { ArrowRight, Leaf, FlaskConical, Recycle, Microscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    },
    {
        quote: "I never thought a sunscreen could feel this good. The Sun-Kissed SPF 50 is non-greasy and leaves no white cast. I'm hooked!",
        name: "Vikram Singh",
        location: "Pune",
        avatarId: "testimonial-4",
    },
    {
        quote: "The Detoxifying Clay Mask is a weekend essential for me. It leaves my skin feeling so clean and refreshed.",
        name: "Sneha Patel",
        location: "Ahmedabad",
        avatarId: "testimonial-5",
    },
    {
        quote: "Finally, an eye cream that actually works on my dark circles. The Revitalizing Eye Cream is fantastic!",
        name: "Arjun Iyer",
        location: "Chennai",
        avatarId: "testimonial-6",
    }
];

const heroSlides = [
    {
        id: "hero",
        title: "Embrace Your Natural Radiance",
        subtitle: "Discover bespoke skincare, crafted for you. Powered by intelligence, perfected by nature.",
        buttonText: "Shop All Products",
        buttonLink: "/products"
    },
    {
        id: "hero-2",
        title: "The Art of Ozonated Oils",
        subtitle: "Experience the revolutionary fusion of nature's purity and scientific innovation in every drop.",
        buttonText: "Learn More",
        buttonLink: "/#what-sets-us-apart"
    },
    {
        id: "hero-3",
        title: "Get Your Personal AI-Rec",
        subtitle: "Find the perfect products for your unique skin needs with our AI-powered recommendation engine.",
        buttonText: "Get Started",
        buttonLink: "/recommendations"
    }
]


export default function Home() {
  const featuredProducts = getFeaturedProducts(4);

  return (
    <div className="flex flex-col">
       <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
        <Carousel
          opts={{ loop: true }}
          className="w-full h-full"
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
                      <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up animation-delay-300 font-semibold">
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
      
      <section className="py-12 md:py-20 bg-muted/50" id="what-sets-us-apart">
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
                        <div className="p-4 bg-muted text-foreground rounded-full mb-4">
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
        
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            What Our Customers Say
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
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
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
