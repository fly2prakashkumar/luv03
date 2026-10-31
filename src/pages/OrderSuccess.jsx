import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";


function OrderSuccess() {

  const savedOrder =
    localStorage.getItem("luv03-last-order");


  let order = null;

  try {
    order = savedOrder
      ? JSON.parse(savedOrder)
      : null;
  } catch (error) {
    console.error(
      "Could not load order:",
      error
    );
  }


  // =================================================
  // NO ORDER FOUND
  // =================================================

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8f6f1]">

        <section className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eee9df] text-[#584539]">

              <ShoppingBag
                size={30}
                strokeWidth={1.3}
              />

            </div>


            <p className="mt-8 text-[9px] uppercase tracking-[0.2em] text-[#8a796c]">
              Order
            </p>


            <h1 className="mt-3 font-serif text-4xl text-[#3d3028]">
              No recent order found
            </h1>


            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#756960]">
              Start shopping and place an order
              to see your confirmation here.
            </p>


            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#584539] px-7 py-3 text-[9px] uppercase tracking-[0.14em] text-[#f8f6f1]"
            >
              Start shopping

              <ArrowRight
                size={13}
              />
            </Link>

          </div>

        </section>

      </main>
    );
  }


  const customer =
    order.customer || {};

  const shipping =
    order.shipping || {};

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const total =
    Number(order.total) || 0;


  return (
    <main className="min-h-screen bg-[#f8f6f1]">

      <section className="px-6 py-16 lg:px-10 lg:py-24">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-[850px]"
        >

          {/* =================================================
              SUCCESS
          ================================================= */}

          <div className="text-center">

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
                delay: 0.2,
                duration: 0.5,
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#584539] text-[#f8f6f1]"
            >

              <Check
                size={35}
                strokeWidth={1.5}
              />

            </motion.div>


            <p className="mt-9 text-[9px] font-medium uppercase tracking-[0.22em] text-[#8a796c]">
              Order confirmed
            </p>


            <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#3d3028] md:text-5xl">
              Thank you for your order.
            </h1>


            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#756960]">
              Your order has been successfully
              placed. We have received your order
              details and will prepare your products
              with care.
            </p>

          </div>


          {/* =================================================
              ORDER ID
          ================================================= */}

          <div className="mt-12 rounded-[24px] bg-[#eee9df] p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9a897c]">
                  Order number
                </p>

                <p className="mt-2 font-serif text-xl text-[#3d3028]">
                  {order.id}
                </p>

              </div>


              <div className="rounded-full bg-[#f8f6f1] px-4 py-2 text-[8px] font-medium uppercase tracking-[0.14em] text-[#584539]">
                {order.status || "Order confirmed"}
              </div>

            </div>

          </div>


          {/* =================================================
              CUSTOMER DETAILS
          ================================================= */}

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* CUSTOMER */}

            <div className="rounded-[24px] border border-[#ddd7ce] p-7">

              <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9a897c]">
                Customer
              </p>


              <p className="mt-3 font-serif text-lg text-[#3d3028]">
                {customer.firstName}{" "}
                {customer.lastName}
              </p>


              <div className="mt-4 space-y-2">

                <p className="flex items-center gap-2 text-[9px] text-[#756960]">

                  <Mail size={12} />

                  {customer.email}

                </p>


                <p className="flex items-center gap-2 text-[9px] text-[#756960]">

                  <Phone size={12} />

                  {customer.phone}

                </p>

              </div>

            </div>


            {/* DELIVERY */}

            <div className="rounded-[24px] border border-[#ddd7ce] p-7">

              <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9a897c]">
                Delivery address
              </p>


              <div className="mt-4 flex gap-3">

                <MapPin
                  size={15}
                  className="mt-1 shrink-0 text-[#584539]"
                />


                <p className="text-[10px] leading-6 text-[#756960]">

                  {shipping.address}

                  {shipping.apartment && (
                    <>
                      <br />
                      {shipping.apartment}
                    </>
                  )}

                  <br />

                  {shipping.city},{" "}
                  {shipping.state}

                  <br />

                  {shipping.pincode}

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              ORDER ITEMS
          ================================================= */}

          <div className="mt-5 rounded-[24px] bg-[#eee9df] p-7">

            <div className="flex items-center justify-between">

              <h2 className="font-serif text-2xl text-[#3d3028]">
                Your order
              </h2>


              <span className="text-[9px] uppercase tracking-[0.14em] text-[#8a796c]">
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}
              </span>

            </div>


            <div className="mt-7 space-y-5">

              {items.map((item) => {

                const price =
                  Number(item.price) || 0;

                const quantity =
                  Number(item.quantity) || 0;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-[#d5ccc2] pb-5 last:border-0 last:pb-0"
                  >

                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f8f6f1]">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                    </div>


                    <div className="flex-1">

                      <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                        {item.category}
                      </p>


                      <p className="mt-1 font-serif text-base text-[#3d3028]">
                        {item.name}
                      </p>


                      <p className="mt-2 text-[9px] text-[#756960]">
                        Qty: {quantity}
                      </p>

                    </div>


                    <p className="text-[10px] font-medium text-[#3d3028]">

                      ₹
                      {(
                        price * quantity
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </p>

                  </div>
                );
              })}

            </div>


            {/* TOTAL */}

            <div className="mt-7 flex items-center justify-between border-t border-[#d5ccc2] pt-6">

              <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#51463f]">
                Total
              </span>


              <span className="font-serif text-2xl text-[#3d3028]">
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/shop"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#584539] px-8 text-[9px] font-medium uppercase tracking-[0.14em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
            >

              Continue shopping

              <ArrowRight
                size={13}
                strokeWidth={1.4}
              />

            </Link>


            <Link
              to="/"
              className="flex h-12 items-center justify-center rounded-full border border-[#584539] px-8 text-[9px] font-medium uppercase tracking-[0.14em] text-[#584539] transition hover:bg-[#584539] hover:text-[#f8f6f1]"
            >
              Back to home
            </Link>

          </div>


          <p className="mt-10 text-center text-[8px] uppercase tracking-[0.16em] text-[#aaa098]">
            Thank you for choosing Luv03
          </p>

        </motion.div>

      </section>

    </main>
  );
}


export default OrderSuccess;