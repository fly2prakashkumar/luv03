import { motion } from "framer-motion";

import {
  ArrowLeft,
  Lock,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useCart } from "../context/CartContext";

import {
  getCurrentUser,
  requireLogin,
  saveOrder,
} from "../utils/auth";


function Checkout() {

  const navigate =
    useNavigate();


  // ==========================================================
  // CART
  // ==========================================================

  const {
    cartItems = [],
    cartTotal = 0,
    clearCart,
  } = useCart();


  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] =
    useState({

      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pincode: "",

    });


  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // ==========================================================
  // CHECK LOGIN
  // ==========================================================

  const user =
    getCurrentUser();


  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (current) => ({

        ...current,

        [name]:
          value,

      })
    );

  };


  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    // --------------------------------------------------------
    // REQUIRE LOGIN
    // --------------------------------------------------------

    if (
      !requireLogin(
        navigate
      )
    ) {

      return;

    }


    // --------------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------------

    if (
      cartItems.length === 0
    ) {

      navigate("/shop");

      return;

    }


    // --------------------------------------------------------
    // USER CHECK
    // --------------------------------------------------------

    const currentUser =
      getCurrentUser();


    if (
      !currentUser
    ) {

      navigate("/login");

      return;

    }


    setIsSubmitting(
      true
    );


    // --------------------------------------------------------
    // ORDER ID
    // --------------------------------------------------------

    const orderId =
      `LUV03-${Math.floor(
        100000 +
        Math.random() *
        900000
      )}`;


    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    const orderDate =
      new Date().toISOString();


    // --------------------------------------------------------
    // ORDER
    // --------------------------------------------------------

    const order = {

      id:
        orderId,


      // ------------------------------------------------------
      // CUSTOMER EMAIL
      // Used by getUserOrders()
      // ------------------------------------------------------

      customerEmail:
        currentUser.email,


      // ------------------------------------------------------
      // CUSTOMER
      // ------------------------------------------------------

      customer: {

        firstName:
          formData.firstName,

        lastName:
          formData.lastName,

        email:
          formData.email ||
          currentUser.email,

        phone:
          formData.phone,

      },


      // ------------------------------------------------------
      // SHIPPING
      // ------------------------------------------------------

      shipping: {

        address:
          formData.address,

        apartment:
          formData.apartment,

        city:
          formData.city,

        state:
          formData.state,

        pincode:
          formData.pincode,

      },


      // ------------------------------------------------------
      // PRODUCTS
      // ------------------------------------------------------

      items:
        cartItems.map(
          (item) => ({

            ...item,

            quantity:
              Number(
                item.quantity
              ) || 1,

          })
        ),


      // ------------------------------------------------------
      // TOTAL
      // ------------------------------------------------------

      total:
        Number(
          cartTotal
        ) || 0,


      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

      status:
        "Order confirmed",


      // ------------------------------------------------------
      // DATE
      // ------------------------------------------------------

      date:
        orderDate,


      // Keep createdAt as well
      // for compatibility

      createdAt:
        orderDate,

    };


    // ========================================================
    // SAVE ORDER TO ALL ORDERS
    // ========================================================

    const saved =
      saveOrder(
        order
      );


    // --------------------------------------------------------
    // IF SAVE FAILED
    // --------------------------------------------------------

    if (!saved) {

      setIsSubmitting(
        false
      );

      alert(
        "Something went wrong while placing your order. Please try again."
      );

      return;

    }


    // ========================================================
    // SAVE LAST ORDER
    // Used by OrderSuccess page
    // ========================================================

    localStorage.setItem(
      "luv03-last-order",
      JSON.stringify(
        order
      )
    );


    // ========================================================
    // PAYMENT
    // ========================================================
    //
    // Payment integration can be connected later.
    //
    // For now this completes the test order flow.
    //
    // ========================================================

    setTimeout(
      () => {

        // ----------------------------------------------------
        // CLEAR CART
        // ----------------------------------------------------

        clearCart();


        // ----------------------------------------------------
        // GO TO SUCCESS PAGE
        // ----------------------------------------------------

        navigate(
          "/order-success"
        );

      },
      800
    );

  };


  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    cartItems.length === 0
  ) {

    return (

      <main className="min-h-screen bg-[#f8f6f1]">

        <section className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9df] text-[#584539]">

              <ShoppingBag
                size={25}
                strokeWidth={1.3}
              />

            </div>


            <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
              Checkout
            </p>


            <h1 className="mt-3 font-serif text-3xl text-[#3d3028]">
              Your bag is empty
            </h1>


            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#8a796c]">
              Add something beautiful to your bag
              before continuing to checkout.
            </p>


            <Link
              to="/shop"
              className="mt-7 inline-flex rounded-full bg-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
            >
              Continue shopping
            </Link>

          </div>

        </section>

      </main>

    );

  }


  // ==========================================================
  // SAFE TOTAL
  // ==========================================================

  const safeCartTotal =
    Number(
      cartTotal
    ) || 0;


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main className="min-h-screen bg-[#f8f6f1]">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="border-b border-[#ddd7ce]">

        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960] transition hover:text-[#b56d43]"
          >

            <ArrowLeft
              size={12}
              strokeWidth={1.5}
            />

            Back to bag

          </Link>


          <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
            Almost there
          </p>


          <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#3d3028] md:text-5xl">
            Checkout
          </h1>

        </div>

      </section>


      {/* ====================================================
          CHECKOUT
      ==================================================== */}

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">


            {/* ==================================================
                CUSTOMER INFORMATION
            ================================================== */}

            <div>


              {/* ==================================================
                  CONTACT
              ================================================== */}

              <div>

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                  01
                </p>


                <h2 className="mt-2 font-serif text-2xl text-[#3d3028]">
                  Contact information
                </h2>


                <div className="mt-6 grid gap-5">


                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      Email address
                    </label>


                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* PHONE */}

                  <div>

                    <label
                      htmlFor="phone"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      Phone number
                    </label>


                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="+91 98765 43210"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none focus:border-[#584539]"
                    />

                  </div>

                </div>

              </div>


              {/* ==================================================
                  SHIPPING
              ================================================== */}

              <div className="mt-14 border-t border-[#ddd7ce] pt-10">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                  02
                </p>


                <h2 className="mt-2 font-serif text-2xl text-[#3d3028]">
                  Delivery address
                </h2>


                <div className="mt-6 grid gap-5 sm:grid-cols-2">


                  {/* FIRST NAME */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      First name
                    </label>


                    <input
                      name="firstName"
                      type="text"
                      required
                      value={
                        formData.firstName
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* LAST NAME */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      Last name
                    </label>


                    <input
                      name="lastName"
                      type="text"
                      required
                      value={
                        formData.lastName
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* ADDRESS */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      Address
                    </label>


                    <input
                      name="address"
                      type="text"
                      required
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="House no., street, area"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* APARTMENT */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      Apartment / Landmark
                    </label>


                    <input
                      name="apartment"
                      type="text"
                      value={
                        formData.apartment
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* CITY */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      City
                    </label>


                    <input
                      name="city"
                      type="text"
                      required
                      value={
                        formData.city
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* STATE */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      State
                    </label>


                    <input
                      name="state"
                      type="text"
                      required
                      value={
                        formData.state
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>


                  {/* PINCODE */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#756960]">
                      Pincode
                    </label>


                    <input
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      value={
                        formData.pincode
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs outline-none focus:border-[#584539]"
                    />

                  </div>

                </div>

              </div>


              {/* ==================================================
                  PAYMENT
              ================================================== */}

              <div className="mt-14 border-t border-[#ddd7ce] pt-10">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                  03
                </p>


                <h2 className="mt-2 font-serif text-2xl text-[#3d3028]">
                  Payment
                </h2>


                <div className="mt-6 rounded-2xl border border-[#d7cec5] bg-[#eee9df]/50 p-5">

                  <div className="flex gap-3">

                    <div className="mt-1 h-4 w-4 shrink-0 rounded-full border border-[#584539] p-[3px]">

                      <div className="h-full w-full rounded-full bg-[#584539]" />

                    </div>


                    <div>

                      <p className="text-[10px] font-medium text-[#3d3028]">
                        Payment integration coming soon
                      </p>


                      <p className="mt-1 text-[9px] leading-5 text-[#8a796c]">
                        Online payment will be connected
                        later. For now, you can test the
                        complete order experience.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}

            <motion.aside
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="h-fit rounded-[24px] bg-[#eee9df] p-7 lg:sticky lg:top-28"
            >

              <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a796c]">
                Your order
              </p>


              <h2 className="mt-3 font-serif text-2xl text-[#3d3028]">
                Order summary
              </h2>


              <div className="mt-7 space-y-5 border-b border-[#d5ccc2] pb-6">

                {cartItems.map(
                  (
                    item
                  ) => {

                    const price =
                      Number(
                        item.price
                      ) || 0;


                    const quantity =
                      Number(
                        item.quantity
                      ) || 0;


                    return (

                      <div
                        key={
                          item.id
                        }
                        className="flex gap-4"
                      >

                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f8f6f1]">

                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            className="h-full w-full object-cover"
                          />


                          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#584539] px-1 text-[7px] text-white">
                            {quantity}
                          </span>

                        </div>


                        <div className="min-w-0 flex-1">

                          <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                            {item.category}
                          </p>


                          <p className="mt-1 font-serif text-sm text-[#3d3028]">
                            {item.name}
                          </p>


                          <p className="mt-1 text-[10px] text-[#756960]">
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>


              {/* SUBTOTAL */}

              <div className="mt-5 flex justify-between text-xs text-[#756960]">

                <span>
                  Subtotal
                </span>


                <span>
                  ₹
                  {safeCartTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              {/* SHIPPING */}

              <div className="mt-4 flex justify-between text-xs text-[#756960]">

                <span>
                  Shipping
                </span>


                <span>
                  Free
                </span>

              </div>


              {/* TOTAL */}

              <div className="mt-5 flex items-center justify-between border-t border-[#d5ccc2] pt-5">

                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#51463f]">
                  Total
                </span>


                <span className="font-serif text-2xl text-[#3d3028]">
                  ₹
                  {safeCartTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              {/* PLACE ORDER */}

              <motion.button
                type="submit"
                disabled={
                  isSubmitting
                }
                whileTap={{
                  scale: 0.98,
                }}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#584539] text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028] disabled:opacity-60"
              >

                <Lock
                  size={12}
                  strokeWidth={1.5}
                />


                {isSubmitting
                  ? "Processing..."
                  : "Place order"}

              </motion.button>

            </motion.aside>

          </div>

        </form>

      </section>

    </main>

  );

}


export default Checkout;