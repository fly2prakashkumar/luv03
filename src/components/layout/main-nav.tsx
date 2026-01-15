
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
            className="text-foreground transition-colors hover:text-foreground"
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
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-[active]:bg-transparent data-[state=open]:bg-transparent")}>
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
