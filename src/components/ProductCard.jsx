import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { requireLogin } from "../utils/auth";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  // Stock check
  const isOutOfStock =
    product.stock !== undefined && Number(product.stock) <= 0;

  // Safe product slug
  const productSlug =
    product.slug ||
    (product.name
      ? product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      : product.id);

  // =================================================
  // ADD TO BAG
  // =================================================
  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    if (!requireLogin(navigate)) {
      return;
    }
    addToCart(product, 1);
  };

  // =================================================
  // WISHLIST
  // =================================================
  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!requireLogin(navigate)) {
      return;
    }

    toggleWishlist(product);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[26px] border border-white/20 bg-gradient-to-b from-[#1C1720]/85 via-[#161219]/90 to-[#0F0B13]/95 p-3.5 shadow-[0_16px_40px_rgba(15,11,19,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C5A880]/60 hover:shadow-[0_24px_50px_rgba(15,11,19,0.5)] sm:p-4"
    >
      {/* Top subtle gloss sheen reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />

      {/* =================================================
          IMAGE INSIDE SMOKY CARD
      ================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-inner">
        <Link to={`/product/${productSlug}`}>
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`aspect-[4/5] w-full object-cover transition-all duration-300 ${
              isOutOfStock ? "opacity-75 grayscale-[25%]" : ""
            }`}
          />
        </Link>

        {/* OUT OF STOCK BADGE / TAG */}
        {isOutOfStock && (
          <div className="pointer-events-none absolute left-2 top-2 z-10 sm:left-2.5 sm:top-2.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-black/85 px-2.5 py-1 text-[7.5px] font-bold uppercase tracking-[0.16em] text-rose-300 shadow-[0_4px_14px_rgba(0,0,0,0.6)] backdrop-blur-md sm:text-[8.5px]">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
              Out of stock
            </span>
          </div>
        )}

        {/* WISHLIST */}
        <motion.button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 sm:right-3 sm:top-3 sm:h-8 sm:w-8 ${
            wishlisted
              ? "bg-[#C5A880] text-[#161311] border border-[#C5A880]"
              : "bg-black/50 text-[#FAF7F2] hover:bg-[#C5A880] hover:text-[#161311] border border-white/20"
          }`}
        >
          <Heart
            size={13}
            strokeWidth={1.4}
            fill={wishlisted ? "currentColor" : "none"}
            className="sm:h-[14px] sm:w-[14px]"
          />
        </motion.button>
      </div>

      {/* =================================================
          PRODUCT INFORMATION ON SMOKY CARD
      ================================================= */}
      <div className="min-w-0 pt-3 sm:pt-4">
        {/* CATEGORY */}
        <p className="truncate text-[7px] font-medium uppercase tracking-[0.16em] text-[#C5A880] sm:text-[8px]">
          {product.category}
        </p>

        {/* PRODUCT NAME */}
        <Link
          to={`/product/${productSlug}`}
          className="mt-1 block truncate font-serif text-[14px] leading-5 text-[#FAF7F2] transition-colors hover:text-[#C5A880] sm:text-[17px]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* RATING */}
        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2 sm:gap-2">
          <span className="text-[8px] font-medium tracking-wide text-[#E8D7BE] sm:text-[9px]">
            ★ {product.rating || "4.8"}
          </span>
          <span className="text-[7px] text-white/50 sm:text-[8px]">
            ({product.reviews || "120"})
          </span>
        </div>

        {/* PRICE & STOCK STATUS */}
        <div className="mt-1.5 flex min-w-0 items-center justify-between gap-1.5 sm:mt-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="shrink-0 text-[11px] font-medium text-white sm:text-[12px]">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="truncate text-[8px] text-white/40 line-through sm:text-[9px]">
                ₹{Number(product.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <span className="text-[7.5px] font-semibold uppercase tracking-[0.1em] text-rose-400 sm:text-[8.5px]">
              Sold Out
            </span>
          ) : product.stock !== undefined && Number(product.stock) <= 5 ? (
            <span className="text-[7.5px] font-medium text-amber-300/90 sm:text-[8px]">
              {product.stock} left
            </span>
          ) : null}
        </div>

        {/* ADD TO BAG / OUT OF STOCK BUTTON */}
        <motion.button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          whileHover={isOutOfStock ? {} : { y: -2 }}
          whileTap={isOutOfStock ? {} : { scale: 0.97 }}
          className={`
            mt-3
            flex
            h-9
            w-full
            min-w-0
            items-center
            justify-center
            gap-1.5
            overflow-hidden
            rounded-full
            px-2
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.12em]
            transition-all
            duration-300
            sm:mt-4
            sm:h-10
            sm:gap-2
            sm:px-3
            sm:text-[8px]
            sm:tracking-[0.14em]
            ${
              isOutOfStock
                ? "cursor-not-allowed bg-white/10 text-white/40 border border-white/10 shadow-none hover:bg-white/10 hover:text-white/40"
                : "bg-gradient-to-r from-[#C5A880] via-[#D4BA92] to-[#C5A880] text-[#161311] shadow-[0_8px_20px_rgba(197,168,128,0.25)] hover:from-white hover:to-white hover:text-[#161311] hover:shadow-[0_10px_24px_rgba(255,255,255,0.3)]"
            }
          `}
        >
          {isOutOfStock ? (
            <span className="min-w-0 truncate whitespace-nowrap">
              Out of stock
            </span>
          ) : (
            <>
              <ShoppingBag
                size={11}
                strokeWidth={1.6}
                className="h-[11px] w-[11px] shrink-0 sm:h-[13px] sm:w-[13px]"
              />
              <span className="min-w-0 truncate whitespace-nowrap">
                Add to bag
              </span>
            </>
          )}
        </motion.button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
