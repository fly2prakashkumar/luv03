
'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Mock data based on the image
const productImages = (imageUrl: string) => [
  imageUrl,
  'https://picsum.photos/seed/gallery1/1000/1000',
  'https://picsum.photos/seed/gallery2/1000/1000',
  'https://picsum.photos/seed/gallery3/1000/1000',
  'https://picsum.photos/seed/gallery4/1000/1000',
];

const tags = [
  'All Skin types',
  'Lightweight Texture',
  'Detanning',
  'UV A/B & Blue Light Protection',
  'No White Cast',
  'Pollution Protection',
];

const sizes = [
  { id: '50g', name: 'Single Pack (50gm)', price: 449, usp: '₹8.98 / g' },
  { id: '80g', name: 'Single Pack (80gm)', price: 599, usp: '₹7.49 / g' },
  {
    id: 'pack2',
    name: 'Pack of 2 (80gm)',
    price: 838,
    originalPrice: 1198,
    discount: '30% off',
    usp: '₹5.24 / g',
    bestValue: true,
  },
  {
    id: '125g',
    name: 'Single Pack (125g)',
    price: 699,
    originalPrice: 999,
    discount: '30% off',
    usp: '₹5.59 / g',
    bestValue: true,
  },
];

const ingredients = [
  {
    name: 'Cherry Tomato',
    description:
      'Rich in Lycopene, Cherry Tomato reduces skin damage brought on by UV exposure, making it an excellent skin rejuvenator. It heals & purifies the skin, giving it an even tone.',
    image: 'https://picsum.photos/seed/tomato/100/100',
    hint: 'cherry tomatoes',
  },
  {
    name: 'Hyaluronic Acid',
    description:
      'For the oh-so-plump look! The gold standard of hydration, Hyaluronic Acid binds water to skin cells and repairs moisture barrier.',
    image: 'https://picsum.photos/seed/hyaluronic/100/100',
    hint: 'hyaluronic acid molecule',
  },
];

const offers = [
  { title: 'Buy Any 2 products at ₹699', code: 'FRESH' },
  { title: 'Buy 3 & Pay for 2', code: 'B3P2' },
  { title: 'Get a best worth ₹199', code: 'WINTERGLO' },
];

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

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizes[1].id);

  useEffect(() => {
    if (product?.imageUrl) {
      setMainImage(product.imageUrl);
    }
  }, [product]);

  const activeSize = sizes.find((s) => s.id === selectedSize) || sizes[1];

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const galleryImages = productImages(product.imageUrl);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
          <div className="flex flex-col gap-3">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className={cn(
                  'aspect-square relative rounded-md overflow-hidden cursor-pointer border-2',
                  mainImage === img ? 'border-primary' : 'border-transparent'
                )}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full z-10">
              Best Seller
            </div>
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current opacity-50" />
            </div>
            <span className="font-bold">4.8</span>
            <span className="text-muted-foreground">| 941 reviews</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Net content: {activeSize.name.match(/\((.*?)\)/)?.[1] || ''} (USP:{' '}
            {activeSize.usp})
          </p>

          <div>
            <span className="text-3xl font-bold">₹{activeSize.price}</span>
            {activeSize.originalPrice && (
              <span className="ml-2 text-muted-foreground line-through">
                ₹{activeSize.originalPrice}
              </span>
            )}
            {activeSize.discount && (
              <span className="ml-2 text-foreground font-semibold">
                {activeSize.discount}
              </span>
            )}
            <p className="text-xs text-muted-foreground">
              Prices are inclusive of all taxes
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Select Size</h3>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="grid grid-cols-2 gap-3"
            >
              {sizes.map((size) => (
                <Label
                  key={size.id}
                  htmlFor={size.id}
                  className={cn(
                    'border rounded-md p-3 cursor-pointer relative',
                    selectedSize === size.id
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-border'
                  )}
                >
                  <RadioGroupItem
                    value={size.id}
                    id={size.id}
                    className="sr-only"
                  />
                  {size.bestValue && (
                    <div className="absolute -top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      11h:19m:8s
                    </div>
                  )}
                  <p className="font-semibold">{size.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">₹{size.price}</span>
                    {size.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{size.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    USP: {size.usp}
                  </p>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <AddToCartButton
            product={{ ...product, price: activeSize.price, id: id }}
            className="w-full h-12 text-lg"
          />

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">What's In It?</h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              {ingredients.map((ingredient) => (
                <div key={ingredient.name} className="flex flex-col items-center">
                  <Image
                    src={ingredient.image}
                    alt={ingredient.name}
                    width={80}
                    height={80}
                    className="rounded-full mb-2"
                    data-ai-hint={ingredient.hint}
                  />
                  <h4 className="font-semibold">{ingredient.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {ingredient.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Available offers</h3>
            <Carousel
              opts={{ align: 'start', loop: true }}
              className="w-full max-w-full"
            >
              <CarouselContent className="-ml-2">
                {offers.map((offer, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <p className="font-semibold text-sm text-center">
                          {offer.title}
                        </p>
                        <div className="text-center mt-2">
                          <p className="text-xs text-muted-foreground">
                            Use code:
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(offer.code)
                            }
                            className="font-bold tracking-wider"
                          >
                            {offer.code}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-4">
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
          <div className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="aspect-square w-full rounded-md" />
          </div>
          <Skeleton className="aspect-square rounded-lg" />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-9 w-1/4" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
