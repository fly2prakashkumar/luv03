"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const trendingProducts: { title: string; href: string; description: string }[] = [
  {
    title: "Trending 1",
    href: "/products",
    description: "Description for trending product 1.",
  },
  {
    title: "Trending 2",
    href: "/products",
    description: "Description for trending product 2.",
  },
  {
    title: "Trending 3",
    href: "/products",
    description: "Description for trending product 3.",
  },
]

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All products' },
    { href: '/products', label: 'Both&Body' },
    { href: '/products', label: 'Skin care' },
    { href: '/products', label: 'Electronics' },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            {link.label}
          </Link>
        ))}
         <Link
            href={'/products'}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Trending Products
        </Link>
      </div>
    );
  }
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
         {navLinks.map((link) => (
            <NavigationMenuItem key={link.href + link.label}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Trending Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {trendingProducts.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
