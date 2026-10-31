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
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1]">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="border-b border-[#ddd7ce]">

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

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
              Your favourites
            </p>


            <div className="mt-2 flex items-end justify-between gap-5">

              <h1 className="font-serif text-4xl tracking-tight text-[#3d3028] md:text-5xl">
                Wishlist
              </h1>


              {wishlistCount > 0 && (
                <p className="pb-1 text-[9px] uppercase tracking-[0.12em] text-[#9a897c]">
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

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8d0c7] text-[#8a796c]">

              <Heart
                size={25}
                strokeWidth={1.2}
              />

            </div>


            <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
              Nothing saved yet
            </p>


            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#3d3028]">
              Your wishlist is waiting
            </h2>


            <p className="mt-4 text-sm leading-6 text-[#756960]">
              Save the products you love and
              come back to them whenever
              you're ready.
            </p>


            <Link
              to="/shop"
              className="mx-auto mt-8 flex h-11 w-fit items-center gap-3 rounded-full bg-[#584539] px-7 text-[8px] font-medium uppercase tracking-[0.14em] text-[#f8f6f1] transition-all duration-300 hover:bg-[#3d3028]"
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

                    <div className="relative overflow-hidden bg-[#eee9df]">

                      <Link
                        to={`/product/${product.slug}`}
                      >

                        <motion.img
                          src={product.image}
                          alt={product.name}
                          whileHover={{
                            scale: 1.04,
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
                          className="aspect-[4/5] w-full object-cover"
                        />

                      </Link>


                      {/* REMOVE WISHLIST */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product.id
                          )
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f6f1]/90 text-[#b56d43] backdrop-blur-sm transition-all duration-300 hover:bg-[#f8f6f1] hover:text-[#3d3028]"
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

                      <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9a897c]">
                        {product.category}
                      </p>


                      <Link
                        to={`/product/${product.slug}`}
                        className="mt-1 block font-serif text-[17px] leading-5 text-[#3d3028] transition-colors hover:text-[#b56d43]"
                      >
                        {product.name}
                      </Link>


                      {/* RATING */}

                      <div className="mt-2 flex items-center gap-2">

                        <span className="text-[9px] tracking-wide text-[#8a796c]">
                          ★ {product.rating}
                        </span>


                        {product.reviews !==
                          undefined && (
                          <span className="text-[8px] text-[#b1a49b]">
                            ({product.reviews})
                          </span>
                        )}

                      </div>


                      {/* PRICE */}

                      <div className="mt-2 flex items-center gap-2">

                        <span className="text-[11px] font-medium text-[#3d3028]">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>


                        {product.originalPrice && (
                          <span className="text-[9px] text-[#aaa098] line-through">
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

                      <motion.button
                        type="button"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#584539] px-3 text-[8px] font-medium uppercase tracking-[0.14em] text-[#584539] transition-all duration-300 hover:bg-[#584539] hover:text-[#f8f6f1]"
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


                      {/* REMOVE TEXT */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product.id
                          )
                        }
                        className="mx-auto mt-3 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.12em] text-[#9a897c] transition-colors hover:text-[#b56d43]"
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

            <div className="mt-16 flex justify-center border-t border-[#ddd7ce] pt-10">

              <Link
                to="/shop"
                className="flex items-center gap-2 border-b border-[#65574e] pb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#51463f] transition-colors hover:text-[#b56d43]"
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