
'use client';

import Link from 'next/link';
import { Search, Menu, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartIcon } from '@/components/cart/cart-icon';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { MainNav } from './main-nav';
import { ThemeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';
import React from 'react';

export function AppHeader() {
    const router = useRouter();

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const query = event.currentTarget.value;
            if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            }
        }
    };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-header">
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
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                   <ShoppingBag className="h-6 w-6" />
                   <span className="font-bold text-xl font-headline">Luv O3</span>
                </Link>
                <MainNav isMobile={true}/>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input
                icon={<Search/>}
                type="search"
                placeholder="Search..."
                className="md:w-64 bg-background"
                onKeyDown={handleSearch}
              />
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
