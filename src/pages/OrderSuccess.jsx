import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { useOrders } from "../context/OrderContext";

function OrderSuccess() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  const {
    getOrderById,
  } = useOrders();


  // Find the real order
  const order = orderId
    ? getOrderById(orderId)
    : null;


  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8f6f1]">

        <section className="mx-auto flex min-h-[75vh] max-w-[1440px] items-center justify-center px-6 py-20 lg:px-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="max-w-md text-center"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9df] text-[#584539]">

              <Package
                size={25}
                strokeWidth={1.3}
              />

            </div>


            <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
              Order unavailable
            </p>


            <h1 className="mt-3 font-serif text-3xl text-[#3d3028]">
              We couldn't find that order
            </h1>


            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-[#8a796c]">
              This order may have expired or the order link may
              be incorrect.
            </p>


            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
              >
                Continue shopping

                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                />

              </Link>


              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-[#584539] transition hover:bg-[#584539] hover:text-[#f8f6f1]"
              >
                Back home
              </Link>

            </div>

          </motion.div>

        </section>

      </main>
    );
  }


  // =========================
  // FORMAT DATE
  // =========================

  const formattedDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  return (
    <main className="min-h-screen bg-[#f8f6f1]">


      {/* =========================
          SUCCESS HERO
      ========================= */}

      <section className="border-b border-[#ddd7ce]">

        <div className="mx-auto max-w-[1440px] px-6 py-20 text-center lg:px-10">

          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#584539] text-[#f8f6f1]"
          >

            <Check
              size={27}
              strokeWidth={1.5}
            />

          </motion.div>


          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="mt-8 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]"
          >
            Order confirmed
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
              delay: 0.25,
            }}
            className="mt-3 font-serif text-4xl tracking-tight text-[#3d3028] md:text-5xl"
          >
            Thank you for your order.
          </motion.h1>


          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.35,
            }}
            className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#8a796c]"
          >
            Your order has been received. We'll take good care
            of it and prepare it for delivery.
          </motion.p>


          {/* ORDER ID */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.45,
            }}
            className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full bg-[#eee9df] px-5 py-3"
          >

            <span className="text-[8px] uppercase tracking-[0.15em] text-[#8a796c]">
              Order
            </span>

            <span className="font-medium text-[10px] tracking-[0.08em] text-[#3d3028]">
              #{order.id}
            </span>

          </motion.div>

        </div>

      </section>


      {/* =========================
          ORDER DETAILS
      ========================= */}

      <section className="mx-auto max-w-[1000px] px-6 py-16 lg:px-10">

        <div className="grid gap-8 md:grid-cols-2">


          {/* =========================
              CUSTOMER DETAILS
          ========================= */}

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
              delay: 0.5,
            }}
            className="rounded-[24px] bg-[#eee9df] p-7"
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
              Delivery
            </p>


            <h2 className="mt-3 font-serif text-2xl text-[#3d3028]">
              Shipping details
            </h2>


            <div className="mt-7 space-y-5">


              <div>

                <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                  Customer
                </p>

                <p className="mt-1 text-xs text-[#3d3028]">
                  {order.customer.firstName}{" "}
                  {order.customer.lastName}
                </p>

              </div>


              <div>

                <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                  Email
                </p>

                <p className="mt-1 text-xs text-[#3d3028]">
                  {order.customer.email}
                </p>

              </div>


              <div>

                <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                  Phone
                </p>

                <p className="mt-1 text-xs text-[#3d3028]">
                  {order.customer.phone}
                </p>

              </div>


              <div>

                <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                  Address
                </p>

                <p className="mt-1 text-xs leading-6 text-[#3d3028]">

                  {order.shippingAddress.address}

                  {order.shippingAddress.apartment && (
                    <>
                      <br />
                      {order.shippingAddress.apartment}
                    </>
                  )}

                  <br />

                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}

                  <br />

                  {order.shippingAddress.pincode}

                </p>

              </div>

            </div>

          </motion.div>


          {/* =========================
              ORDER SUMMARY
          ========================= */}

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
              delay: 0.6,
            }}
            className="rounded-[24px] border border-[#ddd7ce] bg-[#f8f6f1] p-7"
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8a796c]">
              Summary
            </p>


            <h2 className="mt-3 font-serif text-2xl text-[#3d3028]">
              Your order
            </h2>


            {/* ITEMS */}

            <div className="mt-7 space-y-5">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4"
                >

                  <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-xl bg-[#eee9df]">

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

                    <p className="mt-1 text-[9px] text-[#8a796c]">
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

            <div className="mt-7 border-t border-[#ddd7ce] pt-5">

              <div className="flex justify-between text-xs text-[#756960]">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </span>

              </div>


              <div className="mt-3 flex justify-between text-xs text-[#756960]">

                <span>
                  Shipping
                </span>

                <span>
                  Free
                </span>

              </div>


              <div className="mt-5 flex items-center justify-between border-t border-[#ddd7ce] pt-5">

                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#51463f]">
                  Total
                </span>

                <span className="font-serif text-2xl text-[#3d3028]">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>

              </div>

            </div>

          </motion.div>

        </div>


        {/* =========================
            ORDER DATE
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.7,
          }}
          className="mt-8 text-center"
        >

          <p className="text-[9px] text-[#9a897c]">
            Order placed on {formattedDate}
          </p>

        </motion.div>


        {/* =========================
            ACTIONS
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >

          <Link
            to="/shop"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#584539] px-7 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
          >

            <ShoppingBag
              size={13}
              strokeWidth={1.5}
            />

            Continue shopping

          </Link>


          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#584539] px-7 text-[9px] font-medium uppercase tracking-[0.15em] text-[#584539] transition hover:bg-[#584539] hover:text-[#f8f6f1]"
          >

            Back home

            <ArrowRight
              size={13}
              strokeWidth={1.5}
            />

          </Link>

        </motion.div>

      </section>

    </main>
  );
}

export default OrderSuccess;