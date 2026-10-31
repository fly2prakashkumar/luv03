import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Check,
  Truck,
  Box,
  MapPin,
} from "lucide-react";

import {
  getCurrentUser,
  getUserOrders,
  requireLogin,
} from "../utils/auth";


const ORDER_STATUSES = [
  "Order Confirmed",
  "Packed",
  "Package Shipped",
  "Out for Delivery",
  "Delivered",
];


function Orders() {

  const navigate =
    useNavigate();


  const [orders, setOrders] =
    useState([]);


  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = () => {

    if (
      !requireLogin(
        navigate
      )
    ) {

      return;

    }


    const userOrders =
      getUserOrders();


    setOrders(
      userOrders
    );

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadOrders();

  }, [navigate]);


  // ==========================================================
  // REFRESH WHEN CUSTOMER RETURNS TO PAGE
  // ==========================================================

  useEffect(() => {

    const handleFocus = () => {

      loadOrders();

    };


    window.addEventListener(
      "focus",
      handleFocus
    );


    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, [navigate]);


  // ==========================================================
  // CURRENT USER
  // ==========================================================

  const user =
    getCurrentUser();


  // ==========================================================
  // STATUS INDEX
  // ==========================================================

  const getStatusIndex = (
    status
  ) => {

    const index =
      ORDER_STATUSES.indexOf(
        status
      );


    if (index === -1) {

      return 0;

    }


    return index;

  };


  // ==========================================================
  // STATUS ICON
  // ==========================================================

  const getStatusIcon = (
    status
  ) => {

    if (
      status ===
      "Order Confirmed"
    ) {

      return (
        <Check
          size={13}
          strokeWidth={1.5}
        />
      );

    }


    if (
      status ===
      "Packed"
    ) {

      return (
        <Box
          size={13}
          strokeWidth={1.5}
        />
      );

    }


    if (
      status ===
      "Package Shipped"
    ) {

      return (
        <Package
          size={13}
          strokeWidth={1.5}
        />
      );

    }


    if (
      status ===
      "Out for Delivery"
    ) {

      return (
        <Truck
          size={13}
          strokeWidth={1.5}
        />
      );

    }


    return (
      <Check
        size={13}
        strokeWidth={1.5}
      />
    );

  };


  // ==========================================================
  // NO USER
  // ==========================================================

  if (!user) {

    return null;

  }


  return (

    <main className="min-h-screen bg-[#f8f6f1] px-5 py-10 sm:px-8 lg:py-16">

      <div className="mx-auto max-w-5xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-10">

          <Link
            to="/profile"
            className="mb-6 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[#8a796c] transition hover:text-[#584539]"
          >

            <ArrowLeft
              size={14}
              strokeWidth={1.3}
            />

            Back to account

          </Link>


          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9a897c]">
            My Account
          </p>


          <h1 className="mt-2 font-serif text-4xl text-[#3d3028] sm:text-5xl">
            My Orders
          </h1>


          <p className="mt-3 text-sm text-[#756960]">
            View your Luv03 order history and delivery status.
          </p>

        </div>


        {/* ==================================================
            NO ORDERS
        ================================================== */}

        {orders.length === 0 && (

          <section className="rounded-3xl border border-[#ddd7ce] bg-[#eee9df] px-6 py-16 text-center sm:px-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f6f1] text-[#584539]">

              <ShoppingBag
                size={25}
                strokeWidth={1.2}
              />

            </div>


            <h2 className="mt-6 font-serif text-2xl text-[#3d3028]">
              No orders yet
            </h2>


            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#756960]">
              You haven't placed an order yet. Explore our products and start your Luv03 skincare ritual.
            </p>


            <Link
              to="/shop"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#584539] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[#f8f6f1] transition hover:bg-[#45362e]"
            >

              Continue Shopping

            </Link>

          </section>

        )}


        {/* ==================================================
            ORDERS
        ================================================== */}

        {orders.length > 0 && (

          <section className="space-y-5">

            {orders
              .slice()
              .reverse()
              .map(
                (
                  order,
                  index
                ) => {

                  const status =
                    order.status ||
                    "Order Confirmed";


                  const statusIndex =
                    getStatusIndex(
                      status
                    );


                  return (

                    <article
                      key={
                        order.id ||
                        index
                      }
                      className="overflow-hidden rounded-3xl border border-[#ddd7ce] bg-[#eee9df]"
                    >


                      {/* ==================================================
                          ORDER HEADER
                      ================================================== */}

                      <div className="flex flex-col gap-4 border-b border-[#ddd7ce] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                        <div>

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f6f1] text-[#584539]">

                              <Package
                                size={18}
                                strokeWidth={1.3}
                              />

                            </div>


                            <div>

                              <p className="text-[8px] uppercase tracking-[0.16em] text-[#9a897c]">
                                Order
                              </p>


                              <p className="mt-1 font-medium text-sm text-[#3d3028]">
                                #{order.id || "LUV03"}
                              </p>

                            </div>

                          </div>

                        </div>


                        <span className="w-fit rounded-full bg-[#584539] px-4 py-2 text-[8px] font-medium uppercase tracking-[0.14em] text-[#f8f6f1]">
                          {status}
                        </span>

                      </div>


                      {/* ==================================================
                          ORDER BODY
                      ================================================== */}

                      <div className="p-5 sm:p-6">


                        {/* =================================================
                            ORDER DATE
                        ================================================= */}

                        {order.date && (

                          <div className="mb-7">

                            <p className="text-[8px] uppercase tracking-[0.14em] text-[#9a897c]">
                              Order Date
                            </p>


                            <p className="mt-1 text-xs text-[#3d3028]">

                              {new Date(
                                order.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day:
                                    "2-digit",
                                  month:
                                    "long",
                                  year:
                                    "numeric",
                                }
                              )}

                            </p>

                          </div>

                        )}


                        {/* =================================================
                            DELIVERY PROGRESS
                        ================================================= */}

                        <div className="mb-8">

                          <div className="flex items-center justify-between">

                            <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#8a796c]">
                              Delivery Progress
                            </p>


                            <span className="text-[8px] text-[#9a897c]">
                              {statusIndex + 1} /{" "}
                              {ORDER_STATUSES.length}
                            </span>

                          </div>


                          <div className="mt-5 overflow-x-auto pb-2">

                            <div className="flex min-w-[650px] items-start">

                              {ORDER_STATUSES.map(
                                (
                                  statusItem,
                                  statusItemIndex
                                ) => {

                                  const completed =
                                    statusItemIndex <=
                                    statusIndex;


                                  const current =
                                    statusItemIndex ===
                                    statusIndex;


                                  return (

                                    <div
                                      key={
                                        statusItem
                                      }
                                      className="flex flex-1 items-start"
                                    >


                                      <div className="flex min-w-0 flex-1 flex-col items-center">


                                        <div
                                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                            completed
                                              ? "bg-[#584539] text-[#f8f6f1]"
                                              : "bg-[#ddd7ce] text-[#9a897c]"
                                          }`}
                                        >

                                          {getStatusIcon(
                                            statusItem
                                          )}

                                        </div>


                                        <p
                                          className={`mt-3 text-center text-[7px] uppercase leading-4 tracking-[0.08em] ${
                                            current
                                              ? "font-semibold text-[#584539]"
                                              : completed
                                                ? "text-[#584539]"
                                                : "text-[#9a897c]"
                                          }`}
                                        >

                                          {statusItem}

                                        </p>

                                      </div>


                                      {statusItemIndex <
                                        ORDER_STATUSES.length -
                                          1 && (

                                        <div
                                          className={`mt-4 h-px flex-1 ${
                                            statusItemIndex <
                                            statusIndex
                                              ? "bg-[#584539]"
                                              : "bg-[#d5ccc2]"
                                          }`}
                                        />

                                      )}

                                    </div>

                                  );

                                }
                              )}

                            </div>

                          </div>

                        </div>


                        {/* =================================================
                            PRODUCTS
                        ================================================= */}

                        <div className="space-y-4">

                          {(order.items || []).map(
                            (
                              item,
                              itemIndex
                            ) => (

                              <div
                                key={
                                  item.id ||
                                  itemIndex
                                }
                                className="flex gap-4"
                              >

                                {/* IMAGE */}

                                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#ddd7ce]">

                                  {item.image && (

                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="h-full w-full object-cover"
                                    />

                                  )}

                                </div>


                                {/* INFO */}

                                <div className="min-w-0 flex-1">

                                  <p className="font-serif text-base text-[#3d3028]">
                                    {item.name ||
                                      "Product"}
                                  </p>


                                  {item.category && (

                                    <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                                      {item.category}
                                    </p>

                                  )}


                                  <div className="mt-2 flex items-center gap-4 text-[9px] text-[#756960]">

                                    <span>
                                      Qty:{" "}
                                      {item.quantity ||
                                        1}
                                    </span>


                                    {item.price !==
                                      undefined && (

                                      <span>

                                        ₹
                                        {Number(
                                          item.price
                                        ).toLocaleString(
                                          "en-IN"
                                        )}

                                      </span>

                                    )}

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        </div>


                        {/* =================================================
                            DELIVERY ADDRESS
                        ================================================= */}

                        {order.shipping && (

                          <div className="mt-7 border-t border-[#ddd7ce] pt-6">

                            <div className="flex items-center gap-2">

                              <MapPin
                                size={14}
                                strokeWidth={1.3}
                                className="text-[#584539]"
                              />

                              <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#8a796c]">
                                Delivery Address
                              </p>

                            </div>


                            <p className="mt-3 text-xs leading-6 text-[#51463f]">

                              {order.shipping.address}

                              {order.shipping.apartment &&
                                `, ${order.shipping.apartment}`}

                              <br />

                              {order.shipping.city}

                              {order.shipping.city &&
                                order.shipping.state
                                ? ", "
                                : ""}

                              {order.shipping.state}

                              <br />

                              {order.shipping.pincode}

                            </p>

                          </div>

                        )}


                        {/* =================================================
                            TOTAL
                        ================================================= */}

                        <div className="mt-7 flex items-center justify-between border-t border-[#ddd7ce] pt-5">

                          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#8a796c]">
                            Total
                          </span>


                          <span className="font-serif text-xl text-[#3d3028]">

                            ₹
                            {Number(
                              order.total ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </span>

                        </div>

                      </div>

                    </article>

                  );

                }
              )}

          </section>

        )}

      </div>

    </main>

  );

}


export default Orders;