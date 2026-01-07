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
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium font-headline">
                      Luv O3
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Luxury Skincare & AI-Powered Recommendations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {categories.slice(0, 3).map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
             <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {categories.slice(3).map((component) => (
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
        <NavigationMenuItem>
           <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/products">Brands</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
         <NavigationMenuItem>
           <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/recommendations">AI Beauty Advisor</Link>
            </NavigationMenuLink>
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
