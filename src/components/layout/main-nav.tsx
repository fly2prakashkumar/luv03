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
    { href: '/products/category/bath-&-body', label: 'Bath & Body' },
    { href: '/products/category/skin-care', label: 'Skin care' },
    { href: '/products/category/toothpaste', label: 'Toothpaste' },
    { href: '/products/category/handwash', label: 'Handwash' },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className="transition-colors text-foreground"
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
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
