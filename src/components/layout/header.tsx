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
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useUser, useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import Logo from '../../../public/assets/Logo1.jpg';

export function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<(Product & { id: string })[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const isMobile = useIsMobile();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user } = useUser();
    const auth = useAuth();
    
    const firestore = useFirestore();
    const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const { data: allProducts } = useCollection<Product>(productsCollection);

    const isAdminPage = pathname.startsWith('/admin');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (searchQuery.length > 1 && allProducts) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const results = allProducts.filter(
              (product) =>
                product.name.toLowerCase().includes(lowerCaseQuery) ||
                product.description.toLowerCase().includes(lowerCaseQuery) ||
                product.category.toLowerCase().includes(lowerCaseQuery)
            ).slice(0, 5);
            setSearchResults(results);
            setIsPopoverOpen(results.length > 0);
        } else {
            setSearchResults([]);
            setIsPopoverOpen(false);
        }
    }, [searchQuery, allProducts]);

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
      if (!auth) return;
      await signOut(auth);
      router.push('/');
    }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center">
          <div className="mr-[200px] relative top-[7px] hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src={Logo} alt="" width={170} height={100} className="" />
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
                      <Image src={Logo} alt="" width={170} height={100} className=""/>
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
                              return (
                                  <Link key={product.id} href={`/products/${product.id}`} className="block" onClick={handleSuggestionClick}>
                                      <div className="flex items-center gap-4 p-2 rounded-md">
                                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                              {product.imageUrls && product.imageUrls[0] && <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />}
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
