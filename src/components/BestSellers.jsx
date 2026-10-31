import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  {
    name: "Clear Balance Salicylic Cleanser",
    category: "Acne & Blemishes",
    price: "899.00",
    rating: "4.5 (148)",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Dew Drop Hyaluronic Essence",
    category: "Dull Skin",
    price: "1099.00",
    rating: "4.4 (53)",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85",
  },
];

function BestSellers() {
  return (
    <section className="border-b border-[#ddd7ce] bg-[#f8f6f1]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
            Loved most
          </p>

          <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#3d3028] md:text-4xl">
            Best sellers
          </h2>
        </motion.div>

        {/* PRODUCTS */}
        <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">

          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
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
