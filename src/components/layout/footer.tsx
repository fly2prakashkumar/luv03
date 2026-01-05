import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="font-bold text-2xl font-headline">
              Luv 03
            </Link>
            <p className="text-muted-foreground mt-2">Luxury Skincare, Redefined.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex space-x-6 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">About</Link>
              <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            <div className="flex space-x-6 text-muted-foreground">
              {/* Social Icons would go here */}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Luv 03. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
