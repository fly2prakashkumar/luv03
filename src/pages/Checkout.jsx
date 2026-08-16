import { motion } from "framer-motion";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const {
    createOrder,
  } = useOrders();


  const [formData, setFormData] = useState({
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


  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      navigate("/shop");
      return;
    }

    setIsSubmitting(true);


    // Create and save the order
    const order = createOrder({
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },

      shippingAddress: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },

      items: cartItems,

      subtotal: cartTotal,

      shipping: 0,

      total: cartTotal,

      paymentMethod: "online",

      paymentStatus: "pending",
    });


    // Small delay for the processing animation
    setTimeout(() => {
      clearCart();

      navigate(
        `/order-success?orderId=${encodeURIComponent(order.id)}`
      );
    }, 800);
  };


  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f6f1]">

        <section className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-6 py-20 lg:px-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9df] text-[#584539]">

              <ShoppingBag
                size={25}
                strokeWidth={1.3}
              />

            </div>


            <h1 className="mt-6 font-serif text-3xl text-[#3d3028]">
              Your bag is empty
            </h1>


            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#8a796c]">
              Add something beautiful to your bag before continuing
              to checkout.
            </p>


            <Link
              to="/shop"
              className="mt-7 inline-flex items-center rounded-full bg-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
            >
              Continue shopping
            </Link>

          </motion.div>

        </section>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f8f6f1]">

      {/* ================= HEADER ================= */}

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


          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]"
          >
            Almost there
          </motion.p>


          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="mt-3 font-serif text-4xl tracking-tight text-[#3d3028] md:text-5xl"
          >
            Checkout
          </motion.h1>

        </div>

      </section>


      {/* ================= CHECKOUT ================= */}

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">


            {/* ================= CUSTOMER DETAILS ================= */}

            <div>


              {/* CONTACT */}

              <div>

                <div className="mb-6">

                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                    01
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#3d3028]">
                    Contact information
                  </h2>

                </div>


                <div className="grid gap-5 sm:grid-cols-2">


                  <div className="sm:col-span-2">

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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  <div className="sm:col-span-2">

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
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>

                </div>

              </div>


              {/* SHIPPING */}

              <div className="mt-14 border-t border-[#ddd7ce] pt-10">

                <div className="mb-6">

                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                    02
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#3d3028]">
                    Delivery address
                  </h2>

                </div>


                <div className="grid gap-5 sm:grid-cols-2">


                  {/* FIRST NAME */}

                  <div>

                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  {/* LAST NAME */}

                  <div>

                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  {/* ADDRESS */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="address"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      Address
                    </label>

                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House no., street, area"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  {/* APARTMENT */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="apartment"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      Apartment / Landmark

                      <span className="ml-1 normal-case tracking-normal text-[#aaa098]">
                        (optional)
                      </span>

                    </label>

                    <input
                      id="apartment"
                      name="apartment"
                      type="text"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  {/* CITY */}

                  <div>

                    <label
                      htmlFor="city"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  {/* STATE */}

                  <div>

                    <label
                      htmlFor="state"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>


                  {/* PINCODE */}

                  <div>

                    <label
                      htmlFor="pincode"
                      className="mb-2 block text-[9px] font-medium uppercase tracking-[0.12em] text-[#756960]"
                    >
                      Pincode
                    </label>

                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="600001"
                      className="h-12 w-full rounded-xl border border-[#d7cec5] bg-transparent px-4 text-xs text-[#3d3028] outline-none transition focus:border-[#584539]"
                    />

                  </div>

                </div>

              </div>


              {/* PAYMENT */}

              <div className="mt-14 border-t border-[#ddd7ce] pt-10">

                <div className="mb-6">

                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
                    03
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#3d3028]">
                    Payment
                  </h2>

                </div>


                <div className="rounded-2xl border border-[#d7cec5] bg-[#eee9df]/50 p-5">

                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#584539]">

                      <div className="h-2.5 w-2.5 rounded-full bg-[#584539]" />

                    </div>


                    <div>

                      <p className="text-[10px] font-medium text-[#3d3028]">
                        Online payment
                      </p>

                      <p className="mt-1 text-[9px] leading-5 text-[#8a796c]">
                        Secure payment options will be available at
                        the next step.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* ================= ORDER SUMMARY ================= */}

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
                Your order
              </p>


              <h2 className="mt-3 font-serif text-2xl text-[#3d3028]">
                Order summary
              </h2>


              {/* ITEMS */}

              <div className="mt-7 max-h-[360px] space-y-5 overflow-y-auto border-b border-[#d5ccc2] pb-6">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f8f6f1]">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#584539] px-1 text-[7px] text-white">
                        {item.quantity}
                      </span>

                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                        {item.category}
                      </p>

                      <p className="mt-1 font-serif text-sm leading-5 text-[#3d3028]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#756960]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                    </div>


                    <p className="text-[10px] font-medium text-[#3d3028]">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                ))}

              </div>


              {/* TOTAL */}

              <div className="mt-5 space-y-4">

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


              <div className="mt-5 flex items-center justify-between border-t border-[#d5ccc2] pt-5">

                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#51463f]">
                  Total
                </span>

                <span className="font-serif text-2xl text-[#3d3028]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>

              </div>


              {/* PLACE ORDER */}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#584539] text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Lock
                  size={12}
                  strokeWidth={1.5}
                />

                {isSubmitting
                  ? "Processing..."
                  : "Place order"}

              </motion.button>


              <p className="mt-4 text-center text-[8px] leading-5 text-[#8a796c]">
                Secure checkout · Easy returns · Made with care
              </p>

            </motion.aside>

          </div>

        </form>

      </section>

    </main>
  );
}

export default Checkout;