import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex h-full flex-col"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-[#eee9df]">
        <Link to={`/product/${product.slug}`}>
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{
              scale: 1.04,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="aspect-[4/5] w-full object-cover"
          />
        </Link>

        {/* WISHLIST */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f6f1]/90 text-[#51463f] backdrop-blur-sm transition hover:bg-[#f8f6f1] hover:text-[#b56d43]"
        >
          <Heart
            size={14}
            strokeWidth={1.4}
          />
        </button>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="flex flex-1 flex-col pt-4">

        {/* CATEGORY */}
        <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9a897c]">
          {product.category}
        </p>

        {/* PRODUCT NAME */}
        <Link
          to={`/product/${product.slug}`}
          className="mt-1 block min-h-[40px] font-serif text-[17px] leading-5 text-[#3d3028] transition-colors hover:text-[#b56d43]"
        >
          {product.name}
        </Link>

        {/* RATING */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[9px] tracking-wide text-[#8a796c]">
            ★ {product.rating}
          </span>

          <span className="text-[8px] text-[#b1a49b]">
            ({product.reviews})
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-2 flex min-h-[18px] items-center gap-2">
          <span className="text-[11px] font-medium text-[#3d3028]">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <span className="text-[9px] text-[#aaa098] line-through">
              ₹{Number(product.originalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* ADD TO BAG */}
        <motion.button
          type="button"
          onClick={handleAddToCart}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            mt-4
            flex
            h-11
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#584539]
            px-3
            text-[8px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-[#584539]
            transition-all
            duration-300
            hover:bg-[#584539]
            hover:text-[#f8f6f1]
          "
        >
          <ShoppingBag
            size={13}
            strokeWidth={1.4}
            className="shrink-0"
          />

          <span className="whitespace-nowrap">
            Add to bag
          </span>
        </motion.button>
      </div>
    </motion.article>
  );
}

export default ProductCard;