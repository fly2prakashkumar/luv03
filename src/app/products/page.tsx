import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";

export const metadata = {
  title: "Shop All Products - Luv 03",
  description: "Explore our collection of luxury skincare products.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Our Collection
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover skincare that understands you. Each product is crafted with the finest ingredients for visible results.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
