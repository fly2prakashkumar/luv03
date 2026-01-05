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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Cleansers",
    href: "/products",
    description:
      "Gentle yet effective cleansers for all skin types.",
  },
  {
    title: "Moisturizers",
    href: "/products",
    description:
      "Hydrate and nourish your skin with our range of moisturizers.",
  },
  {
    title: "Serums",
    href: "/products",
    description:
      "Targeted treatments to address specific skin concerns.",
  },
  {
    title: "Sunscreen",
    href: "/products",
    description: "Protect your skin from harmful UV rays.",
  },
]

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <li className="row-span-4">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium font-headline">
                      Luv 03
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Luxury Skincare & AI-Powered Recommendations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/products" title="Face">
                Cleansers, moisturizers, serums, and more.
              </ListItem>
              <ListItem href="/products" title="Body">
                Lotions, scrubs, and oils for the whole body.
              </ListItem>
              <ListItem href="/products" title="Lip">
                Balms and treatments for soft, hydrated lips.
              </ListItem>
               <ListItem href="/products" title="Hair">
                Shampoos, conditioners, and treatments.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/recommendations" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              AI Recommendations
            </NavigationMenuLink>
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
