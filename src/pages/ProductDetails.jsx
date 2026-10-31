import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Check,
} from "lucide-react";

import products from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { slug } = useParams();

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Find product using slug
  const product = products.find(
    (item) => item.slug === slug
  );

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f6f1] px-6 py-32">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#9a897c]">
            Product
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#3d3028]">
            We couldn't find that product.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#8a796c]">
            The product you're looking for may have
            been moved or is no longer available.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.14em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.4}
            />

            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const wishlisted = isWishlisted(product.id);


  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };


  // ==========================================
  // WISHLIST
  // ==========================================

  const handleWishlist = () => {
    toggleWishlist(product);
  };


  // ==========================================
  // QUANTITY
  // ==========================================

  const increaseQuantity = () => {
    setQuantity(
      (current) => current + 1
    );
  };


  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        Math.max(1, current - 1)
    );
  };


  return (
    <main className="min-h-screen bg-[#f8f6f1]">

      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-10 lg:px-10 lg:pt-14">

        {/* ==========================================
            BACK TO SHOP
        ========================================== */}

        <Link
          to="/shop"
          className="mb-10 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.15em] text-[#756960] transition-colors hover:text-[#b56d43]"
        >
          <ArrowLeft
            size={13}
            strokeWidth={1.4}
          />

          Back to shop
        </Link>


        {/* ==========================================
            PRODUCT
        ========================================== */}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ========================================
              PRODUCT IMAGE
          ======================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="relative overflow-hidden bg-[#eee9df]"
          >

            <motion.img
              src={product.image}
              alt={product.name}
              initial={{
                scale: 1.03,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="aspect-[4/5] w-full object-cover"
            />


            {/* =====================================
                WISHLIST
            ===================================== */}

            <motion.button
              type="button"
              onClick={handleWishlist}
              whileTap={{
                scale: 0.85,
              }}
              aria-label={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
                wishlisted
                  ? "bg-[#b56d43] text-white"
                  : "bg-[#f8f6f1]/90 text-[#51463f] hover:bg-[#f8f6f1] hover:text-[#b56d43]"
              }`}
            >
              <Heart
                size={17}
                strokeWidth={1.4}
                fill={
                  wishlisted
                    ? "currentColor"
                    : "none"
                }
              />
            </motion.button>

          </motion.div>


          {/* ========================================
              PRODUCT INFORMATION
          ======================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="flex flex-col justify-center"
          >

            {/* CATEGORY */}

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#9a897c]">
              {product.category}
            </p>


            {/* NAME */}

            <h1 className="mt-3 max-w-xl font-serif text-4xl leading-[1.08] tracking-tight text-[#3d3028] md:text-5xl">
              {product.name}
            </h1>


            {/* RATING */}

            <div className="mt-5 flex items-center gap-3">

              <span className="text-[10px] tracking-wide text-[#8a796c]">
                ★ {product.rating}
              </span>

              <span className="text-[9px] text-[#b1a49b]">
                ({product.reviews} reviews)
              </span>

            </div>


            {/* PRICE */}

            <div className="mt-5 flex items-center gap-3">

              <span className="text-lg font-medium text-[#3d3028]">
                ₹
                {Number(
                  product.price
                ).toLocaleString("en-IN")}
              </span>

              {product.originalPrice && (
                <span className="text-sm text-[#aaa098] line-through">
                  ₹
                  {Number(
                    product.originalPrice
                  ).toLocaleString("en-IN")}
                </span>
              )}

            </div>


            {/* DESCRIPTION */}

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#756960]">
              {product.description}
            </p>


            {/* BENEFITS */}

            {product.benefits?.length > 0 && (
              <div className="mt-8 border-y border-[#ddd7ce] py-6">

                <p className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#8a796c]">
                  Benefits
                </p>

                <div className="mt-4 space-y-3">

                  {product.benefits.map(
                    (benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-3"
                      >

                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8e1d8] text-[#584539]">
                          <Check
                            size={11}
                            strokeWidth={1.6}
                          />
                        </span>

                        <span className="text-xs text-[#65574e]">
                          {benefit}
                        </span>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}


            {/* =====================================
                QUANTITY + ADD TO BAG
            ===================================== */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              {/* QUANTITY */}

              <div className="flex h-12 items-center justify-between rounded-full border border-[#584539] px-4 sm:w-36">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  aria-label="Decrease quantity"
                  className="flex h-7 w-7 items-center justify-center text-[#584539] transition hover:text-[#b56d43]"
                >
                  <Minus
                    size={13}
                    strokeWidth={1.4}
                  />
                </button>


                <span className="text-xs text-[#3d3028]">
                  {quantity}
                </span>


                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  aria-label="Increase quantity"
                  className="flex h-7 w-7 items-center justify-center text-[#584539] transition hover:text-[#b56d43]"
                >
                  <Plus
                    size={13}
                    strokeWidth={1.4}
                  />
                </button>

              </div>


              {/* ADD TO BAG */}

              <motion.button
                type="button"
                onClick={
                  handleAddToCart
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#584539] px-7 text-[9px] font-medium uppercase tracking-[0.14em] text-[#f8f6f1] transition-all duration-300 hover:bg-[#3d3028]"
              >

                {added ? (
                  <>
                    <Check
                      size={14}
                      strokeWidth={1.5}
                    />

                    Added to bag
                  </>
                ) : (
                  <>
                    <ShoppingBag
                      size={14}
                      strokeWidth={1.4}
                    />

                    Add to bag
                  </>
                )}

              </motion.button>

            </div>


            {/* SMALL INFO */}

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#ddd7ce] pt-6">

              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#9a897c]">
                  Everyday care
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#756960]">
                  Designed for your daily
                  skincare ritual.
                </p>
              </div>


              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#9a897c]">
                  Luv03
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#756960]">
                  Simple skincare made
                  with intention.
                </p>
              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;