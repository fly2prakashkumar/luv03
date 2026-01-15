"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All products' },
    { href: '/products', label: 'Both&Body' },
    { href: '/products', label: 'Skin care' },
    { href: '/products', label: 'Toothpaste' },
    { href: '/products', label: 'Handwash' },
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
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
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
