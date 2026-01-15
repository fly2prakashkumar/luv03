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

const categories: { title: string; href: string; description: string }[] = [
    {
      title: "Skincare",
      href: "/products",
      description: "Cleansers, moisturizers, serums, and more for your face.",
    },
    {
      title: "Makeup",
      href: "/products",
      description: "Foundations, lipsticks, and everything for your look.",
    },
    {
      title: "Hair",
      href: "/products",
      description: "Shampoos, conditioners, and treatments for luscious locks.",
    },
    {
      title: "Body",
      href: "/products",
      description: "Lotions, scrubs, and oils for the whole body.",
    },
     {
      title: "Fragrance",
      href: "/products",
      description: "Discover your signature scent.",
    },
     {
      title: "Tools & Brushes",
      href: "/products",
      description: "Perfect your application with our professional tools.",
    },
]

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/products" passHref legacyBehavior>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Shop
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
         <NavigationMenuItem>
            <Link href="/recommendations" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>AI Beauty Advisor</NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
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
