import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";

import {
  getCurrentUser,
  getUserOrders,
  requireLogin,
  updateOrder,
} from "../utils/auth";
import {
  findCourier,
  getCourierTrackingUrl,
  getNextDeliveryStatus,
} from "../utils/courier";
import { saveCustomerReview } from "../utils/reviews";

const ORDER_STATUSES = [
  "Order Confirmed",
  "Packed",
  "Package Shipped",
  "Out for Delivery",
  "Delivered",
];

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  // Sync animation state
  const [isSyncingCourier, setIsSyncingCourier] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const loadOrders = () => {
    if (!requireLogin(navigate)) {
      return;
    }
    const userOrders = getUserOrders();
    setOrders(userOrders);

    // If modal is open, refresh selected order too
    if (selectedOrder) {
      const refreshed = userOrders.find((o) => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [navigate]);

  useEffect(() => {
    const handleSync = () => {
      loadOrders();
    };

    window.addEventListener("focus", handleSync);
    window.addEventListener("luv03-orders-change", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("luv03-orders-change", handleSync);
    };
  }, [navigate, selectedOrder]);

  const user = getCurrentUser();

  const getStatusIndex = (status) => {
    const index = ORDER_STATUSES.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const getStatusIcon = (status) => {
    if (status === "Order Confirmed") return <Check size={14} strokeWidth={1.8} />;
    if (status === "Packed") return <Box size={14} strokeWidth={1.8} />;
    if (status === "Package Shipped") return <Package size={14} strokeWidth={1.8} />;
    if (status === "Out for Delivery") return <Truck size={14} strokeWidth={1.8} />;
    return <CheckCircle2 size={14} strokeWidth={1.8} />;
  };

  // Courier Auto-Sync Simulation
  const handleSyncCourierStatus = (order) => {
    setIsSyncingCourier(true);

    setTimeout(() => {
      setIsSyncingCourier(false);
      const nextStatus = getNextDeliveryStatus(order.status || "Order Confirmed");

      if (nextStatus === order.status) {
        showToast(`Shipment is already ${order.status}. Verified with ${order.carrier || "Courier"}.`);
        return;
      }

      const updated = {
        ...order,
        status: nextStatus,
        paymentStatus: nextStatus === "Delivered" ? "Paid" : order.paymentStatus,
        deliveredAt: nextStatus === "Delivered" ? new Date().toISOString() : order.deliveredAt,
      };

      updateOrder(updated);
      setSelectedOrder(updated);
      showToast(`Courier status updated to "${nextStatus}" via ${order.carrier || "Courier"} tracking!`);
    }, 900);
  };

  // Submit Customer Review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert("Please write a few words about your experience with the product.");
      return;
    }

    const items = reviewModalOrder.items || [];
    const item = items[selectedProductIndex] || items[0] || {};

    const saved = saveCustomerReview({
      orderId: reviewModalOrder.id,
      productId: item.id || item.slug,
      productName: item.name || "Luv03 Luxury Ritual",
      customerName:
        reviewModalOrder.customer?.name ||
        `${reviewModalOrder.customer?.firstName || ""} ${reviewModalOrder.customer?.lastName || ""}`.trim() ||
        user?.name ||
        "Verified Customer",
      location: reviewModalOrder.shipping?.city || "India",
      rating: reviewRating,
      reviewText: reviewText.trim(),
    });

    if (saved) {
      setReviewModalOrder(null);
      setReviewText("");
      setReviewRating(5);
      showToast("Thank you! Your verified review has been published to Testimonials.");
      loadOrders();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-transparent px-5 py-10 sm:px-8 lg:py-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#161311] px-5 py-3.5 text-xs text-[#FAF7F2] shadow-2xl backdrop-blur-xl"
          >
            <Sparkles size={16} className="text-[#C5A880]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-10">
          <Link
            to="/profile"
            className="mb-6 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[#8C7E72] transition hover:text-[#161311]"
          >
            <ArrowLeft size={14} strokeWidth={1.3} />
            Back to account
          </Link>

          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9084]">
            My Account
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#161311] sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 text-sm text-[#524942]">
            View order status, tracking via our delivery partners, and leave verified reviews.
          </p>
        </div>

        {/* NO ORDERS */}
        {orders.length === 0 && (
          <section className="rounded-3xl border border-white/80 bg-white/70 px-6 py-16 text-center shadow-[0_16px_40px_rgba(109,0,25,0.06)] backdrop-blur-xl sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF7F2] text-[#161311]">
              <ShoppingBag size={25} strokeWidth={1.2} />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-[#161311]">
              No orders placed yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#524942]">
              You haven't placed an order yet. Explore our skincare catalog and start your Luv03 ritual.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#161311] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[#FAF7F2] transition hover:bg-[#38312B]"
            >
              Continue Shopping
            </Link>
          </section>
        )}

        {/* ====================================================
            REQUIREMENT 2: SHOW ORDERS LIST FIRST
        ==================================================== */}
        {orders.length > 0 && (
          <section className="space-y-4">
            {orders.slice().map((order) => {
              const status = order.status || "Order Confirmed";
              const isDelivered = status === "Delivered";
              const isCod = (order.paymentMethod || "").toLowerCase() === "cod";
              const courier = findCourier(order.carrier || "Blue Dart Express");
              const isReviewed = !!order.reviewed;

              return (
                <article
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition hover:border-[#161311]/40 hover:shadow-md sm:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Order ID & Courier */}
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#161311] border border-[#E5DED3]">
                        <Package size={20} strokeWidth={1.3} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[#161311]">
                            #{order.id}
                          </p>
                          {order.carrier && (
                            <span className="rounded-full bg-[#FAF7F2] border border-[#E5DED3] px-2.5 py-0.5 text-[9px] font-semibold text-[#524942]">
                              {courier.name}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-[#8C7E72]">
                          Placed on{" "}
                          {order.date
                            ? new Date(order.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </p>
                      </div>
                    </div>

                    {/* Status & Payment Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                          isDelivered
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#161311] text-[#FAF7F2]"
                        }`}
                      >
                        {status}
                      </span>
                      <span className="rounded-full border border-[#E5DED3] bg-[#FAF7F2] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#524942]">
                        {isCod ? "COD" : "Prepaid"}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview Row */}
                  <div className="mt-5 flex flex-col gap-4 border-t border-[#E5DED3] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {(order.items || []).slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            title={item.name}
                            className="h-10 w-10 rounded-xl border-2 border-white object-cover shadow-sm"
                          />
                        ))}
                      </div>
                      <div className="text-xs">
                        <p className="font-medium text-[#161311]">
                          {(order.items || []).map((i) => i.name).join(", ")}
                        </p>
                        <p className="text-[11px] text-[#8C7E72]">
                          {(order.items || []).reduce((s, i) => s + (Number(i.quantity) || 1), 0)} items &bull; Total: ₹{Number(order.total || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                      {isDelivered && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isReviewed) {
                              setReviewModalOrder(order);
                            }
                          }}
                          className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide shadow-sm transition ${
                            isReviewed
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                              : "bg-[#C5A880] text-white hover:bg-[#b0936b]"
                          }`}
                        >
                          {isReviewed ? "✓ Review Submitted" : "★ Write a Review"}
                        </button>
                      )}

                      <div className="flex items-center gap-1 text-xs font-medium text-[#161311] group-hover:translate-x-1 transition">
                        <span>View Details & Tracking</span>
                        <ChevronRight size={15} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* ====================================================
          REQUIREMENT 2 & 3: ORDER DETAILS & COURIER TRACKING MODAL
      ==================================================== */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white p-7 shadow-2xl sm:p-9"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E5DED3]">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl text-[#161311]">
                      Order #{selectedOrder.id}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                        selectedOrder.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#161311] text-[#FAF7F2]"
                      }`}
                    >
                      {selectedOrder.status || "Order Confirmed"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#8C7E72]">
                    Placed on{" "}
                    {selectedOrder.date
                      ? new Date(selectedOrder.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recent"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DED3] text-[#8C7E72] hover:text-[#161311]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Delivery Progress Stepper */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
                    Delivery Timeline
                  </p>
                  <span className="text-[10px] text-[#8C7E72]">
                    Step {getStatusIndex(selectedOrder.status || "Order Confirmed") + 1} of {ORDER_STATUSES.length}
                  </span>
                </div>

                <div className="mt-5 overflow-x-auto pb-2">
                  <div className="flex min-w-[500px] items-center">
                    {ORDER_STATUSES.map((st, i) => {
                      const completed = i <= getStatusIndex(selectedOrder.status || "Order Confirmed");
                      const current = i === getStatusIndex(selectedOrder.status || "Order Confirmed");

                      return (
                        <div key={st} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center flex-1">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                                completed
                                  ? "bg-[#161311] text-[#FAF7F2]"
                                  : "bg-[#FAF7F2] border border-[#E5DED3] text-[#8C7E72]"
                              }`}
                            >
                              {getStatusIcon(st)}
                            </div>
                            <span
                              className={`mt-2 text-center text-[8px] uppercase tracking-wider ${
                                current
                                  ? "font-bold text-[#161311]"
                                  : completed
                                  ? "text-[#161311]"
                                  : "text-[#8C7E72]"
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                          {i < ORDER_STATUSES.length - 1 && (
                            <div
                              className={`h-0.5 flex-1 mb-5 transition ${
                                i < getStatusIndex(selectedOrder.status || "Order Confirmed")
                                  ? "bg-[#161311]"
                                  : "bg-[#E5DED3]"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* REQUIREMENT 3: RESPECTED COURIER TRACKING CARD */}
              <div className="mt-6 rounded-2xl border border-[#E5DED3] bg-[#FAF7F2]/60 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Truck size={17} className="text-[#C5A880]" />
                      <p className="font-semibold text-xs text-[#161311]">
                        Delivery Partner: {findCourier(selectedOrder.carrier).name}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-[#524942]">
                      AWB / Tracking Number:{" "}
                      <span className="font-mono font-medium text-[#161311]">
                        {selectedOrder.trackingNumber || "Assigned upon dispatch"}
                      </span>
                    </p>
                  </div>

                  {/* Tracking Portal Link & Auto-Sync Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedOrder.trackingNumber && (
                      <a
                        href={getCourierTrackingUrl(selectedOrder.carrier, selectedOrder.trackingNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#161311] bg-white px-3.5 py-1.5 text-xs font-medium text-[#161311] hover:bg-[#161311] hover:text-white transition"
                      >
                        <span>Track on {findCourier(selectedOrder.carrier).shortCode}</span>
                        <ExternalLink size={12} />
                      </a>
                    )}

                    {/* Auto-sync with carrier */}
                    <button
                      type="button"
                      onClick={() => handleSyncCourierStatus(selectedOrder)}
                      disabled={isSyncingCourier || selectedOrder.status === "Delivered"}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#161311] px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#38312B] disabled:opacity-40"
                    >
                      <RefreshCw size={12} className={isSyncingCourier ? "animate-spin" : ""} />
                      <span>{isSyncingCourier ? "Syncing..." : "Sync Live Status"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DELIVERED ORDER: WRITE REVIEW PROMPT */}
              {selectedOrder.status === "Delivered" && (
                <div className="mt-6 rounded-2xl border border-[#C5A880]/50 bg-gradient-to-r from-[#FAF7F2] to-[#FAF7F2]/80 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#C5A880]">
                        <Star size={15} fill="currentColor" />
                        <span className="text-xs font-semibold text-[#161311]">
                          Package Delivered! How is your skin feeling?
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#6B5E55]">
                        Share your authentic skincare ritual with our community. Your review will appear in Testimonials!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(null);
                        setReviewModalOrder(selectedOrder);
                      }}
                      className="rounded-full bg-[#161311] px-5 py-2.5 text-xs font-medium text-[#FAF7F2] hover:bg-[#38312B] shadow-sm shrink-0"
                    >
                      ★ {selectedOrder.reviewed ? "Update Review" : "Write a Review"}
                    </button>
                  </div>
                </div>
              )}

              {/* Items in Order */}
              <div className="mt-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
                  Purchased Products
                </p>
                <div className="mt-3 divide-y divide-[#E5DED3] rounded-2xl border border-[#E5DED3]">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl border border-[#E5DED3] object-cover"
                        />
                        <div>
                          <p className="font-medium text-xs text-[#161311]">{item.name}</p>
                          <p className="text-[11px] text-[#8C7E72]">
                            Qty: {item.quantity} &bull; ₹{Number(item.price || 0).toLocaleString("en-IN")} each
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-medium text-xs text-[#161311]">
                        ₹{(Number(item.price || 0) * (Number(item.quantity) || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Summary */}
              <div className="mt-7 grid gap-5 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-[#E5DED3] p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7E72]">
                    Delivery Address
                  </p>
                  <p className="mt-2 text-[#161311] leading-5">
                    {selectedOrder.shipping?.address || "Address not specified"}
                    {selectedOrder.shipping?.apartment && <>, {selectedOrder.shipping.apartment}</>}
                    <br />
                    {selectedOrder.shipping?.city}, {selectedOrder.shipping?.state} - {selectedOrder.shipping?.pincode}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E5DED3] p-4 space-y-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7E72]">
                    Payment Breakdown
                  </p>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8C7E72]">Mode:</span>
                    <span className="font-semibold text-[#161311]">
                      {(selectedOrder.paymentMethod || "").toLowerCase() === "cod" ? "Cash on Delivery" : "Prepaid (Online)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7E72]">Status:</span>
                    <span className="text-[#161311]">{selectedOrder.paymentStatus || "Paid"}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5DED3] pt-2 font-serif text-sm font-semibold text-[#161311]">
                    <span>Grand Total:</span>
                    <span>₹{Number(selectedOrder.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
          REQUIREMENT 1: PRODUCT REVIEW & TESTIMONIAL MODAL
      ==================================================== */}
      <AnimatePresence>
        {reviewModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/80 bg-white p-7 shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-5 border-b border-[#E5DED3]">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                    Verified Buyer Review
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-[#161311]">
                    Leave a Testimonial
                  </h3>
                </div>
                <button
                  onClick={() => setReviewModalOrder(null)}
                  className="rounded-full p-1.5 text-[#8C7E72] hover:text-[#161311]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                {/* Select Product to Review (if order has multiple) */}
                {(reviewModalOrder.items || []).length > 1 && (
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                      Select Product to Review
                    </label>
                    <select
                      value={selectedProductIndex}
                      onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-3 text-xs outline-none focus:border-[#161311]"
                    >
                      {(reviewModalOrder.items || []).map((item, idx) => (
                        <option key={idx} value={idx}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Star Rating Selector */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                    Your Rating *
                  </label>
                  <div className="mt-2 flex items-center gap-1.5 text-[#C5A880]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition hover:scale-110"
                      >
                        <Star
                          size={24}
                          strokeWidth={1.2}
                          fill={
                            (reviewHoverRating || reviewRating) >= star
                              ? "currentColor"
                              : "transparent"
                          }
                          className={
                            (reviewHoverRating || reviewRating) >= star
                              ? "text-[#C5A880]"
                              : "text-[#E5DED3]"
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-serif text-sm font-medium text-[#161311]">
                      {reviewHoverRating || reviewRating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Message Textarea */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                    Your Skincare Experience & Ritual *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How does your skin feel? Mention texture, hydration, finish, or barrier comfort..."
                    className="mt-1.5 w-full rounded-2xl border border-[#E5DED3] bg-transparent p-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#8C7E72]">
                  <Sparkles size={14} className="text-[#C5A880]" />
                  <span>
                    Your review will be verified and featured on the Luv03 Homepage Testimonials section.
                  </span>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DED3]">
                  <button
                    type="button"
                    onClick={() => setReviewModalOrder(null)}
                    className="rounded-full border border-[#E5DED3] px-5 py-2.5 text-xs font-medium text-[#524942]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#161311] px-7 py-2.5 text-xs font-medium uppercase tracking-wider text-[#FAF7F2] hover:bg-[#38312B]"
                  >
                    Submit Testimonial
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Orders;
