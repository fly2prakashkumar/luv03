import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getStoredProducts } from "../data/products";

function FeaturedProducts() {
  const [products, setProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener("luv03-products-change", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("luv03-products-change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Get the first 4 products marked as featured
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  return (
    <section id="featured-products" className="bg-transparent">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
        {/* HEADING */}
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="inline-block rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#161311] shadow-sm backdrop-blur-md">
              Featured
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#161311] md:text-4xl">
              The everyday edit
            </h2>
          </div>

          {/* DESKTOP VIEW ALL */}
          <Link
            to="/shop"
            className="hidden border-b border-[#38312B] pb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#38312B] transition-colors duration-300 hover:text-[#C5A880] sm:block"
          >
            View all products
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-5">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
            />
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <Link
          to="/shop"
          className="mx-auto mt-10 block border-b border-[#38312B] pb-1 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-[#38312B] transition-colors duration-300 hover:text-[#C5A880] sm:hidden"
        >
          View all products
        </Link>
      </div>
    </section>
  );
}

export default FeaturedProducts;
