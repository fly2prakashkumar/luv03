
'use client';

import Link from 'next/link';
import { Search, Menu, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartIcon } from '@/components/cart/cart-icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { MainNav } from './main-nav';
import { ThemeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { searchProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export function AppHeader() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const results = searchProducts(searchQuery).slice(0, 5); // Limit to 5 results
            setSearchResults(results);
            setIsPopoverOpen(results.length > 0);
        } else {
            setSearchResults([]);
            setIsPopoverOpen(false);
        }
    }, [searchQuery]);

    const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const query = event.currentTarget.value;
            if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                setIsPopoverOpen(false);
                setSearchQuery('');
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSuggestionClick = () => {
        setIsPopoverOpen(false);
        setSearchQuery('');
    }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold text-xl font-headline">Luv O3</span>
            </Link>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-primary/90 hover:bg-primary/90">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader className="mb-6">
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="font-bold text-xl font-headline">Luv O3</span>
                    </Link>
                </SheetHeader>
                <MainNav isMobile={true}/>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverAnchor asChild>
                    <Input
                        icon={<Search/>}
                        type="search"
                        placeholder="Search..."
                        className="md:w-64 bg-background text-foreground"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                        onFocus={() => searchQuery.length > 1 && setIsPopoverOpen(true)}
                    />
                </PopoverAnchor>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <div className="flex flex-col gap-1 p-2">
                        {searchResults.map(product => {
                            const placeholder = getPlaceholderImage(product.imageId);
                            return (
                                <Link key={product.id} href={`/products/${product.id}`} className="block" onClick={handleSuggestionClick}>
                                    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                            {placeholder && <Image src={placeholder.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={placeholder.imageHint} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{product.name}</p>
                                            <p className="text-muted-foreground text-sm">₹{product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </PopoverContent>
              </Popover>
            </div>
            <nav className="flex items-center">
              <CartIcon />
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </div>
      <div className="hidden md:block border-b">
         <div className="container flex justify-center">
           <MainNav />
         </div>
      </div>
    </header>
  );
}
