

'use client';

import Link from 'next/link';
import { Search, Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
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
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverAnchor, PopoverTrigger } from '@/components/ui/popover';
import { searchProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="hsl(var(--primary-foreground))" {...props}>
        <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2Z" />
    </svg>
);


export function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const isMobile = useIsMobile();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user } = useUser();
    const auth = useAuth();

    const isAdminPage = pathname.startsWith('/admin');

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                if (isMobile) {
                    setIsSearchOpen(false);
                }
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSuggestionClick = () => {
        setIsPopoverOpen(false);
        setSearchQuery('');
        if (isMobile) {
            setIsSearchOpen(false);
        }
    }
    
    const handleLogout = async () => {
      await signOut(auth);
      router.push('/');
    }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
              <span className="font-bold text-xl font-headline">Luv O3</span>
            </Link>
          </div>

          {isMounted && isMobile && (
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
                      <Logo />
                      <span className="font-bold text-xl font-headline">Luv O3</span>
                      </Link>
                  </SheetHeader>
                  <MainNav isMobile={true}/>
                </SheetContent>
              </Sheet>
            </div>
          )}
          
          <div className={cn("flex flex-1 items-center justify-end space-x-2 md:space-x-4")}>
             <div className="w-full flex-1 md:w-auto md:flex-none">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverAnchor asChild>
                      <form
                        className={cn(
                          'relative w-full',
                          isMounted && isMobile && !isSearchOpen && 'hidden'
                        )}
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (searchQuery) {
                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                            setIsPopoverOpen(false);
                             setSearchQuery('');
                            if (isMobile) setIsSearchOpen(false);
                          }
                        }}
                      >
                      <Input
                          icon={<Search/>}
                          type="search"
                          placeholder="Search..."
                          className="md:w-64 bg-background text-foreground h-10 md:h-10"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchSubmit}
                          onFocus={() => searchQuery.length > 1 && setIsPopoverOpen(true)}
                          onBlur={() => {
                            setTimeout(() => {
                                if (isMobile) setIsSearchOpen(false);
                            }, 150);
                          }}
                          autoFocus={isMobile && isSearchOpen}
                      />
                      </form>
                  </PopoverAnchor>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <div className="flex flex-col gap-1 p-2">
                          {searchResults.map(product => {
                              const placeholder = getPlaceholderImage(product.imageId);
                              return (
                                  <Link key={product.id} href={`/products/${product.id}`} className="block" onClick={handleSuggestionClick}>
                                      <div className="flex items-center gap-4 p-2 rounded-md">
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
            <nav className={cn("flex items-center", isMobile && isSearchOpen && "hidden")}>
              {isMounted && isMobile && !isSearchOpen && (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className='hover:bg-transparent'>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Open Search</span>
                </Button>
              )}
              <CartIcon />
              <ThemeToggle />
              {user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-transparent">
                      <Avatar className="h-8 w-8">
                         {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/account"><User className="mr-2 h-4 w-4" /> My Account</Link>
                    </DropdownMenuItem>
                    {user.email === 'admin@gmail.com' && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="icon" className="hover:bg-transparent">
                  <Link href="/login">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </div>
      {!isAdminPage && (
        <div className="hidden md:block border-b">
            <div className="container flex justify-center">
            <MainNav />
            </div>
        </div>
      )}
    </header>
  );
}
