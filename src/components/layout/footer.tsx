import Link from "next/link";
import { ShoppingBag, Instagram, Facebook, MapPin, Phone } from "lucide-react";

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All products' },
    { href: '/products/category/both-and-body', label: 'Both&Body' },
    { href: '/products/category/skin-care', label: 'Skin care' },
    { href: '/products/category/toothpaste', label: 'Toothpaste' },
    { href: '/products/category/handwash', label: 'Handwash' },
];

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

export function AppFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8" />
                <span className="font-bold text-2xl font-headline">Luv O3</span>
              </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in beatae ea recusandae blanditiis veritatis.
            </p>
             <div className="flex space-x-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-6 w-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-6 w-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><WhatsappIcon className="h-6 w-6" /></Link>
            </div>
          </div>

          {/* Column 2: Links & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {navLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Contact Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4"/>
                      <span>Chennai , India</span>
                  </li>
                  <li className="flex items-center space-x-2">
                      <Phone className="h-4 w-4"/>
                      <span>+91 123456789</span>
                  </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
