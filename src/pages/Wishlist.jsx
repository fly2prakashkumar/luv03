import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";


function Wishlist() {

  // =================================================
  // CART / WISHLIST
  // =================================================

  const {
    wishlistItems,
    wishlistCount,
    removeFromWishlist,
    addToCart,
  } = useCart();


  // =================================================
  // ADD TO CART
  // =================================================

  const handleAddToCart = (product) => {
    addToCart(product, 1);

    // Remove from wishlist after adding to bag
    removeFromWishlist(product.id);
  };


  return (
    <main className="min-h-[calc(100vh-5rem)] bg-transparent">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="border-b border-[#E5DED3]">

        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10 lg:py-20">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8C7E72]">
              Your favourites
            </p>


            <div className="mt-2 flex items-end justify-between gap-5">

              <h1 className="font-serif text-4xl tracking-tight text-[#161311] md:text-5xl">
                Wishlist
              </h1>


              {wishlistCount > 0 && (
                <p className="pb-1 text-[9px] uppercase tracking-[0.12em] text-[#9E9084]">
                  {wishlistCount}{" "}
                  {wishlistCount === 1
                    ? "item"
                    : "items"}
                </p>
              )}

            </div>

          </motion.div>

        </div>

      </section>


      {/* =================================================
          EMPTY WISHLIST
      ================================================= */}

      {wishlistItems.length === 0 ? (

        <section className="flex min-h-[55vh] items-center justify-center px-6">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto max-w-md text-center"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#E5DED3] text-[#8C7E72]">

              <Heart
                size={25}
                strokeWidth={1.2}
              />

            </div>


            <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8C7E72]">
              Nothing saved yet
            </p>


            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#161311]">
              Your wishlist is waiting
            </h2>


            <p className="mt-4 text-sm leading-6 text-[#524942]">
              Save the products you love and
              come back to them whenever
              you're ready.
            </p>


            <Link
              to="/shop"
              className="mx-auto mt-8 flex h-11 w-fit items-center gap-3 rounded-full bg-[#161311] px-7 text-[8px] font-medium uppercase tracking-[0.14em] text-[#FAF7F2] transition-all duration-300 hover:bg-[#161311]"
            >
              Explore products

              <ArrowRight
                size={13}
                strokeWidth={1.4}
              />
            </Link>

          </motion.div>

        </section>

      ) : (

        /* =================================================
           WISHLIST PRODUCTS
        ================================================= */

        <section>

          <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-16">

            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

              {wishlistItems.map(
                (product, index) => (

                  <motion.article
                    key={product.id}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="group"
                  >

                    {/* IMAGE */}

                    <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-b from-white/85 via-[#F2ECE1]/60 to-[#F2ECE1]/90 shadow-[0_8px_24px_rgba(109,0,25,0.04)] backdrop-blur-sm">

                      <Link to={`/product/${product.slug || product.id}`}>
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          whileHover={{
                            scale: (product.stock !== undefined && Number(product.stock) <= 0) ? 1 : 1.04,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          className={`aspect-[4/5] w-full object-cover transition-all duration-300 ${
                            (product.stock !== undefined && Number(product.stock) <= 0) ? "opacity-75 grayscale-[25%]" : ""
                          }`}
                        />
                      </Link>

                      {(product.stock !== undefined && Number(product.stock) <= 0) && (
                        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-black/85 px-2.5 py-1 text-[7.5px] font-bold uppercase tracking-[0.16em] text-rose-300 shadow backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                            Out of stock
                          </span>
                        </div>
                      )}


                      {/* REMOVE WISHLIST */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product.id
                          )
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF7F2]/90 text-[#C5A880] backdrop-blur-sm transition-all duration-300 hover:bg-[#FAF7F2] hover:text-[#161311]"
                      >

                        <Heart
                          size={14}
                          strokeWidth={1.4}
                          fill="currentColor"
                        />

                      </button>

                    </div>


                    {/* PRODUCT INFORMATION */}

                    <div className="pt-4">

                      <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9E9084]">
                        {product.category}
                      </p>


                      <Link
                        to={`/product/${product.slug}`}
                        className="mt-1 block font-serif text-[17px] leading-5 text-[#161311] transition-colors hover:text-[#C5A880]"
                      >
                        {product.name}
                      </Link>


                      {/* RATING */}

                      <div className="mt-2 flex items-center gap-2">

                        <span className="text-[9px] tracking-wide text-[#8C7E72]">
                          ★ {product.rating}
                        </span>


                        {product.reviews !==
                          undefined && (
                          <span className="text-[8px] text-[#9E9084]">
                            ({product.reviews})
                          </span>
                        )}

                      </div>


                      {/* PRICE */}

                      <div className="mt-2 flex items-center gap-2">

                        <span className="text-[11px] font-medium text-[#161311]">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>


                        {product.originalPrice && (
                          <span className="text-[9px] text-[#B3A69A] line-through">
                            ₹
                            {Number(
                              product.originalPrice
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}

                      </div>


                      {/* ADD TO BAG */}

                      {(() => {
      const isOut = product.stock !== undefined && Number(product.stock) <= 0;
      return (
        <motion.button
          type="button"
          disabled={isOut}
          onClick={() => !isOut && handleAddToCart(product)}
          whileHover={isOut ? {} : { y: -2 }}
          whileTap={isOut ? {} : { scale: 0.97 }}
          className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full px-3 text-[8px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
            isOut
              ? "cursor-not-allowed bg-stone-200 text-stone-500 border border-stone-300 shadow-none"
              : "border border-[#161311] text-[#161311] hover:bg-[#161311] hover:text-[#FAF7F2]"
          }`}
        >
          {isOut ? (
            <span>Out of stock</span>
          ) : (
            <>
              <ShoppingBag size={13} strokeWidth={1.4} className="shrink-0" />
              Add to bag
            </>
          )}
        </motion.button>
      );
    })()}


                      {/* REMOVE TEXT */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product.id
                          )
                        }
                        className="mx-auto mt-3 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.12em] text-[#9E9084] transition-colors hover:text-[#C5A880]"
                      >

                        <Trash2
                          size={11}
                          strokeWidth={1.3}
                        />

                        Remove

                      </button>

                    </div>

                  </motion.article>

                )
              )}

            </div>


            {/* CONTINUE SHOPPING */}

            <div className="mt-16 flex justify-center border-t border-[#E5DED3] pt-10">

              <Link
                to="/shop"
                className="flex items-center gap-2 border-b border-[#38312B] pb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#38312B] transition-colors hover:text-[#C5A880]"
              >

                Continue shopping

                <ArrowRight
                  size={12}
                  strokeWidth={1.3}
                />

              </Link>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}


export default Wishlist;