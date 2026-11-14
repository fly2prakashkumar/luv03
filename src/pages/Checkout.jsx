import { motion } from "framer-motion";

import {
  ArrowLeft,
  Lock,
  ShoppingBag,
  CreditCard,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { getStoredProducts, saveStoredProducts } from "../data/products";

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
      paymentMethod: "Prepaid",
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

    const isCod = (formData.paymentMethod || "Prepaid") === "COD";

    const order = {
      id: orderId,
      customerEmail: currentUser.email,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim() || currentUser.name || "Customer",
        email: formData.email || currentUser.email,
        phone: formData.phone,
      },
      shipping: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      items: cartItems.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
      })),
      total: Number(cartTotal) || 0,
      paymentMethod: isCod ? "COD" : "Prepaid",
      paymentStatus: isCod ? "Pay on Delivery" : "Paid",
      status: "Order Confirmed",
      date: orderDate,
      createdAt: orderDate,
    };


    // ========================================================
    // SAVE ORDER TO ALL ORDERS
    // ========================================================

    const saved = saveOrder(order);

    // Deduct warehouse inventory stock
    try {
      const currentProducts = getStoredProducts();
      let updatedAny = false;
      const updatedProducts = currentProducts.map((p) => {
        const itemInCart = cartItems.find((ci) => ci.id === p.id || ci.slug === p.slug);
        if (itemInCart) {
          updatedAny = true;
          const qty = Number(itemInCart.quantity) || 1;
          return { ...p, stock: Math.max(0, (Number(p.stock) || 0) - qty) };
        }
        return p;
      });
      if (updatedAny) {
        saveStoredProducts(updatedProducts);
      }
    } catch (err) {
      console.error("Stock deduction error:", err);
    }

    // ========================================================
    // SYNC ORDER DIRECTLY TO GOOGLE SHEET
    // ========================================================
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbz6Uwk_617PXrfPNAgQmXiz2KMkTa1TIfM-iosBundJ07OuT4gTH7Dp8Dopl5Eizvs/exec";

    try {
      const orderParams = new URLSearchParams({
        action: "order",
        orderId: order.id,
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone || "",
        address: `${order.shipping.address || ""} ${order.shipping.apartment || ""}`.trim(),
        city: order.shipping.city || "",
        state: order.shipping.state || "",
        pincode: order.shipping.pincode || "",
        items: order.items.map((i) => `${i.name} (Qty: ${i.quantity}, ₹${i.price})`).join("; "),
        total: `₹${Number(order.total).toLocaleString("en-IN")}`,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        courier: "Blue Dart Express",
        trackingNumber: `BD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: orderDate,
      });

      fetch(`${GOOGLE_SCRIPT_URL}?${orderParams.toString()}`, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: orderParams.toString(),
      }).catch((e) => console.warn("Order Sheet sync notice:", e));
    } catch (sheetErr) {
      console.warn("Could not sync order to Sheet:", sheetErr);
    }


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

      <main className="min-h-screen bg-transparent">

        <section className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2ECE1] text-[#161311]">

              <ShoppingBag
                size={25}
                strokeWidth={1.3}
              />

            </div>


            <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8C7E72]">
              Checkout
            </p>


            <h1 className="mt-3 font-serif text-3xl text-[#161311]">
              Your bag is empty
            </h1>


            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#8C7E72]">
              Add something beautiful to your bag
              before continuing to checkout.
            </p>


            <Link
              to="/shop"
              className="mt-7 inline-flex rounded-full bg-[#161311] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-[#FAF7F2] transition hover:bg-[#161311]"
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

    <main className="min-h-screen bg-transparent">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="border-b border-[#E5DED3]">

        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#524942] transition hover:text-[#C5A880]"
          >

            <ArrowLeft
              size={12}
              strokeWidth={1.5}
            />

            Back to bag

          </Link>


          <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8C7E72]">
            Almost there
          </p>


          <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#161311] md:text-5xl">
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

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8C7E72]">
                  01
                </p>


                <h2 className="mt-2 font-serif text-2xl text-[#161311]">
                  Contact information
                </h2>


                <div className="mt-6 grid gap-5">


                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#524942]"
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* PHONE */}

                  <div>

                    <label
                      htmlFor="phone"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#524942]"
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
                    />

                  </div>

                </div>

              </div>


              {/* ==================================================
                  SHIPPING
              ================================================== */}

              <div className="mt-14 border-t border-[#E5DED3] pt-10">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8C7E72]">
                  02
                </p>


                <h2 className="mt-2 font-serif text-2xl text-[#161311]">
                  Delivery address
                </h2>


                <div className="mt-6 grid gap-5 sm:grid-cols-2">


                  {/* FIRST NAME */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* LAST NAME */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* ADDRESS */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* APARTMENT */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* CITY */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* STATE */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>


                  {/* PINCODE */}

                  <div>

                    <label className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[#524942]">
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
                      className="h-12 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs outline-none focus:border-[#161311]"
                    />

                  </div>

                </div>

              </div>


              {/* ==================================================
                  PAYMENT METHOD
              ================================================== */}

              <div className="mt-14 border-t border-[#E5DED3] pt-10">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8C7E72]">
                  03
                </p>

                <h2 className="mt-2 font-serif text-2xl text-[#161311]">
                  Payment Method
                </h2>

                <p className="mt-1 text-xs text-[#8C7E72]">
                  Choose how you would like to pay for your luxury order.
                </p>

                <div className="mt-6 space-y-4">

                  {/* PREPAID OPTION */}
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "Prepaid" }))}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${
                      formData.paymentMethod === "Prepaid"
                        ? "border-[#161311] bg-[#FAF7F2] shadow-sm"
                        : "border-[#E5DED3] bg-white hover:border-[#C5A880]"
                    }`}
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#161311]">
                      {formData.paymentMethod === "Prepaid" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#161311]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-[#161311]" />
                          <span className="font-medium text-sm text-[#161311]">
                            Prepaid (Online Payment)
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-800">
                          Instant Confirmation
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-[#6B5E55]">
                        Pay instantly via Google Pay, PhonePe, UPI QR, Cards, or Net Banking.
                      </p>
                    </div>
                  </div>

                  {/* CASH ON DELIVERY (COD) OPTION */}
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "COD" }))}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${
                      formData.paymentMethod === "COD"
                        ? "border-[#161311] bg-[#FAF7F2] shadow-sm"
                        : "border-[#E5DED3] bg-white hover:border-[#C5A880]"
                    }`}
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#161311]">
                      {formData.paymentMethod === "COD" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#161311]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Banknote size={18} className="text-[#161311]" />
                          <span className="font-medium text-sm text-[#161311]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <span className="rounded-full bg-[#161311]/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#161311]">
                          Pay on Delivery
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-[#6B5E55]">
                        Pay in cash or scan delivery agent's UPI QR code upon arrival at your doorstep.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-[#8C7E72]">
                  <ShieldCheck size={14} className="text-[#C5A880]" />
                  <span>256-bit SSL encrypted & verified luxury delivery guarantee.</span>
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
              className="h-fit rounded-[24px] border border-white/80 bg-white/70 p-7 shadow-[0_16px_40px_rgba(109,0,25,0.06)] backdrop-blur-xl lg:sticky lg:top-28"
            >

              <p className="text-[9px] uppercase tracking-[0.18em] text-[#8C7E72]">
                Your order
              </p>


              <h2 className="mt-3 font-serif text-2xl text-[#161311]">
                Order summary
              </h2>


              <div className="mt-7 space-y-5 border-b border-[#E5DED3] pb-6">

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

                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]">

                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            className="h-full w-full object-cover"
                          />


                          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#161311] px-1 text-[7px] text-white">
                            {quantity}
                          </span>

                        </div>


                        <div className="min-w-0 flex-1">

                          <p className="text-[8px] uppercase tracking-[0.12em] text-[#9E9084]">
                            {item.category}
                          </p>


                          <p className="mt-1 font-serif text-sm text-[#161311]">
                            {item.name}
                          </p>


                          <p className="mt-1 text-[10px] text-[#524942]">
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

              <div className="mt-5 flex justify-between text-xs text-[#524942]">

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

              <div className="mt-4 flex justify-between text-xs text-[#524942]">

                <span>
                  Shipping
                </span>


                <span>
                  Free
                </span>

              </div>


              {/* TOTAL */}

              <div className="mt-5 flex items-center justify-between border-t border-[#E5DED3] pt-5">

                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#38312B]">
                  Total
                </span>


                <span className="font-serif text-2xl text-[#161311]">
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
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#161311] text-[9px] font-medium uppercase tracking-[0.15em] text-[#FAF7F2] transition hover:bg-[#161311] disabled:opacity-60"
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