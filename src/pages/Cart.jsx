import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#f8f6f1]">

      {/* HEADER */}

      <section className="border-b border-[#ddd7ce]">
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]"
          >
            Your bag
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 font-serif text-4xl tracking-tight text-[#3d3028] md:text-5xl"
          >
            Shopping Bag
          </motion.h1>

        </div>
      </section>


      {/* EMPTY CART */}

      {cartItems.length === 0 ? (

        <section className="mx-auto flex min-h-[55vh] max-w-[1440px] items-center justify-center px-6 py-20 lg:px-10">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9df] text-[#584539]">

              <ShoppingBag
                size={25}
                strokeWidth={1.3}
              />

            </div>

            <h2 className="mt-6 font-serif text-3xl text-[#3d3028]">
              Your bag is empty
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#8a796c]">
              Your skincare ritual is waiting. Explore our collection
              and find something your skin will love.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center rounded-full bg-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
            >
              Continue shopping
            </Link>

          </motion.div>

        </section>

      ) : (

        /* CART */

        <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

            {/* PRODUCTS */}

            <div>

              <div className="mb-6 flex items-center justify-between border-b border-[#ddd7ce] pb-4">

                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#756960]">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "item" : "items"}
                </p>

                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960] transition hover:text-[#b56d43]"
                >
                  <ArrowLeft size={12} />

                  Continue shopping
                </Link>

              </div>


              <div className="divide-y divide-[#ddd7ce]">

                <AnimatePresence mode="popLayout">

                  {cartItems.map((item) => (

                    <motion.div
                      key={item.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -30,
                      }}
                      className="flex gap-5 py-6"
                    >

                      {/* IMAGE */}

                      <Link
                        to={`/product/${item.slug}`}
                        className="h-32 w-24 shrink-0 overflow-hidden bg-[#eee9df] sm:h-40 sm:w-32"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />

                      </Link>


                      {/* INFO */}

                      <div className="flex min-w-0 flex-1 flex-col">

                        <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#9a897c]">
                          {item.category}
                        </p>

                        <Link
                          to={`/product/${item.slug}`}
                          className="mt-1 font-serif text-lg leading-6 text-[#3d3028] hover:text-[#b56d43]"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-2 text-[11px] text-[#51463f]">
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>


                        {/* QUANTITY */}

                        <div className="mt-auto flex items-center gap-4 pt-4">

                          <div className="flex h-9 items-center rounded-full border border-[#d7cec5]">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                              className="flex h-full w-9 items-center justify-center text-[#756960] transition hover:text-[#b56d43]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="w-7 text-center text-[10px] text-[#3d3028]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              className="flex h-full w-9 items-center justify-center text-[#756960] transition hover:text-[#b56d43]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.12em] text-[#9a897c] transition hover:text-red-700"
                          >
                            <Trash2 size={12} />

                            Remove
                          </button>

                        </div>

                      </div>


                      {/* ITEM TOTAL */}

                      <div className="hidden text-right sm:block">

                        <p className="text-[11px] font-medium text-[#3d3028]">

                          ₹
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}

                        </p>

                      </div>

                    </motion.div>

                  ))}

                </AnimatePresence>

              </div>

            </div>


            {/* ORDER SUMMARY */}

            <motion.aside
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="h-fit rounded-[24px] bg-[#eee9df] p-7 lg:sticky lg:top-28"
            >

              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                Order summary
              </p>

              <h2 className="mt-3 font-serif text-2xl text-[#3d3028]">
                Your total
              </h2>


              <div className="mt-7 space-y-4 border-b border-[#d5ccc2] pb-6">

                <div className="flex justify-between text-xs text-[#756960]">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>

                </div>


                <div className="flex justify-between text-xs text-[#756960]">

                  <span>
                    Shipping
                  </span>

                  <span>
                    Free
                  </span>

                </div>

              </div>


              <div className="mt-5 flex items-center justify-between">

                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#51463f]">
                  Total
                </span>

                <span className="font-serif text-2xl text-[#3d3028]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>

              </div>


              {/* PROCEED TO CHECKOUT */}

              <motion.button
                type="button"
                onClick={handleCheckout}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-[#584539] text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
              >
                Proceed to checkout
              </motion.button>


              <p className="mt-4 text-center text-[8px] leading-5 text-[#8a796c]">
                Secure checkout · Easy returns · Made with care
              </p>

            </motion.aside>

          </div>

        </section>

      )}

    </main>
  );
}

export default Cart;