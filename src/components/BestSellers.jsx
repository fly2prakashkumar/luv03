import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { getStoredProducts } from "../data/products";

function BestSellers() {
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

  // Filter best sellers (or high-rated items), show up to 4
  const bestSellerList = products
    .filter((product) => product.bestSeller || Number(product.rating) >= 4.7)
    .slice(0, 4);

  return (
    <section className="border-b border-white/60 bg-transparent">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-block rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#161311] shadow-sm backdrop-blur-md">
            Loved most
          </p>

          <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#161311] md:text-4xl">
            Best sellers
          </h2>
        </motion.div>

        {/* PRODUCTS */}
        <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {bestSellerList.map((product, index) => (
            <motion.div
              key={product.id || product.slug || index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
