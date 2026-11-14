import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getStoredProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { requireLogin } from "../utils/auth";
import { getStoredTestimonials } from "../utils/reviews";

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [productList, setProductList] = useState(() => getStoredProducts());
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewsList, setReviewsList] = useState(() => getStoredTestimonials());
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(6);

  // Real-time synchronization for products
  useEffect(() => {
    const syncProducts = () => {
      setProductList(getStoredProducts());
    };
    const syncReviews = () => {
      setReviewsList(getStoredTestimonials());
    };

    window.addEventListener("luv03-products-change", syncProducts);
    window.addEventListener("luv03-reviews-change", syncReviews);
    window.addEventListener("storage", syncProducts);
    window.addEventListener("storage", syncReviews);

    return () => {
      window.removeEventListener("luv03-products-change", syncProducts);
      window.removeEventListener("luv03-reviews-change", syncReviews);
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener("storage", syncReviews);
    };
  }, []);

  // Reset state and scroll on route change
  useEffect(() => {
    setSelectedImage(null);
    setQuantity(1);
    setAdded(false);
    setVisibleReviewsCount(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Find product using slug or id
  const product = productList.find(
    (item) =>
      String(item.slug) === String(slug) ||
      String(item.id) === String(slug)
  );

  // If product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-transparent px-6 py-32">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#9E9084]">
            Product Catalogue
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#161311]">
            We couldn't find that product.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#8C7E72]">
            The product you're looking for may have been moved, renamed or is temporarily unavailable.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#161311] px-7 py-3 text-[9px] font-medium uppercase tracking-[0.14em] text-[#FAF7F2] transition hover:bg-[#25201C]"
          >
            <ArrowLeft size={13} strokeWidth={1.4} />
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const isOutOfStock =
    product.stock !== undefined && Number(product.stock) <= 0;

  const wishlisted = isWishlisted(product.id);

  // Active hero image
  const activeImage =
    selectedImage || (product.images && product.images[0]) || product.image;

  // Filter reviews matching this product, or show verified community reviews
  const productReviews = reviewsList.filter(
    (r) =>
      !r.productName ||
      r.productName.toLowerCase().includes(product.name.toLowerCase()) ||
      product.name.toLowerCase().includes(r.productName.toLowerCase()) ||
      r.isVerifiedBuyer
  );

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!requireLogin(navigate)) {
      return;
    }

    addToCart(product, quantity);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  // ==========================================
  // WISHLIST
  // ==========================================
  const handleWishlist = () => {
    if (!requireLogin(navigate)) {
      return;
    }
    toggleWishlist(product);
  };

  // ==========================================
  // QUANTITY CONTROLS
  // ==========================================
  const increaseQuantity = () => {
    if (isOutOfStock) return;
    if (product.stock !== undefined && quantity >= Number(product.stock)) return;
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    if (isOutOfStock) return;
    setQuantity((current) => Math.max(1, current - 1));
  };

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-10 lg:px-10 lg:pt-14">
        {/* ==========================================
            BACK TO SHOP
        ========================================== */}
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.15em] text-[#524942] transition-colors hover:text-[#C5A880]"
        >
          <ArrowLeft size={13} strokeWidth={1.4} />
          Back to shop
        </Link>

        {/* ==========================================
            PRODUCT GRID
        ========================================== */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ========================================
              PRODUCT IMAGE & GALLERY
          ======================================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-b from-white/80 via-[#F2ECE1]/60 to-[#F2ECE1]/90 shadow-[0_20px_50px_rgba(22,19,17,0.06)] backdrop-blur-sm">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                initial={{ opacity: 0.8, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className={`aspect-[4/5] w-full object-cover transition-all duration-500 ${
                  isOutOfStock ? "opacity-75 grayscale-[25%]" : ""
                }`}
              />

              {/* OUT OF STOCK BADGE ON IMAGE */}
              {isOutOfStock && (
                <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/50 bg-black/85 px-3.5 py-1.5 text-[8.5px] font-bold uppercase tracking-[0.18em] text-rose-300 shadow-[0_8px_20px_rgba(0,0,0,0.5)] backdrop-blur-md sm:text-[9.5px]">
                    <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                    Out of stock
                  </span>
                </div>
              )}

              {/* WISHLIST */}
              <motion.button
                type="button"
                onClick={handleWishlist}
                whileTap={{ scale: 0.85 }}
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 sm:right-5 sm:top-5 ${
                  wishlisted
                    ? "bg-[#C5A880] text-white shadow-md"
                    : "bg-[#FAF7F2]/90 text-[#38312B] hover:bg-[#FAF7F2] hover:text-[#C5A880]"
                }`}
              >
                <Heart
                  size={17}
                  strokeWidth={1.4}
                  fill={wishlisted ? "currentColor" : "none"}
                />
              </motion.button>
            </div>

            {/* MULTI-IMAGE THUMBNAILS */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {product.images.map((img, idx) => {
                  const isCurrent = activeImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                        isCurrent
                          ? "border-[#C5A880] shadow-md scale-105 ring-2 ring-[#C5A880]/30"
                          : "border-white/80 opacity-75 hover:opacity-100 hover:border-white"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ========================================
              PRODUCT INFORMATION
          ======================================== */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-center"
          >
            {/* CATEGORY */}
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#9E9084]">
              {product.category}
            </p>

            {/* NAME */}
            <h1 className="mt-3 max-w-xl font-serif text-3xl leading-[1.08] tracking-tight text-[#161311] sm:text-4xl md:text-5xl">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#161311]">
                <Star
                  size={13}
                  className="fill-[#C5A880] text-[#C5A880]"
                  strokeWidth={1}
                />
                {product.rating || "4.8"}
              </span>

              <span className="text-[10px] text-[#8C7E72]">
                ({product.reviews || "120"} verified reviews)
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-serif text-[#161311] sm:text-3xl">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.originalPrice && (
                <span className="text-sm text-[#B3A69A] line-through sm:text-base">
                  ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                </span>
              )}

              {product.originalPrice && (
                <span className="rounded-full bg-[#C5A880]/15 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#8A6F48]">
                  Save ₹
                  {Number(
                    product.originalPrice - product.price
                  ).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* STOCK AVAILABILITY BADGE */}
            <div className="mt-4">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1.5 text-[9.5px] font-semibold text-rose-800 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  Currently Out of Stock
                </span>
              ) : Number(product.stock) <= 5 ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-[9.5px] font-semibold text-amber-800 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Low Stock: Only {product.stock} units left
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-[9.5px] font-semibold text-emerald-800 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  In Stock ({product.stock} units ready to ship)
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#524942]">
              {product.description}
            </p>

            {/* BENEFITS */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-7 border-y border-[#E5DED3] py-5">
                <p className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#8C7E72]">
                  Key Benefits & Clinical Results
                </p>

                <div className="mt-3 space-y-2.5">
                  {product.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F2ECE1] text-[#161311]">
                        <Check size={11} strokeWidth={1.8} />
                      </span>
                      <span className="text-xs text-[#38312B]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =====================================
                QUANTITY + ADD TO BAG
            ===================================== */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {/* QUANTITY */}
              <div
                className={`flex h-12 items-center justify-between rounded-full border px-4 sm:w-36 transition-opacity ${
                  isOutOfStock
                    ? "border-stone-300 opacity-40 cursor-not-allowed bg-stone-100/50"
                    : "border-[#161311]"
                }`}
              >
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                  className="flex h-7 w-7 items-center justify-center text-[#161311] transition hover:text-[#C5A880] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={13} strokeWidth={1.4} />
                </button>

                <span className="text-xs font-semibold text-[#161311]">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    isOutOfStock ||
                    (product.stock !== undefined &&
                      quantity >= Number(product.stock))
                  }
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="flex h-7 w-7 items-center justify-center text-[#161311] transition hover:text-[#C5A880] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={13} strokeWidth={1.4} />
                </button>
              </div>

              {/* ADD TO BAG */}
              <motion.button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                whileHover={isOutOfStock ? {} : { y: -2 }}
                whileTap={isOutOfStock ? {} : { scale: 0.98 }}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-7 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-stone-200 text-stone-500 border border-stone-300 shadow-none"
                    : "bg-[#161311] text-[#FAF7F2] hover:bg-[#25201C] shadow-md hover:shadow-lg"
                }`}
              >
                {isOutOfStock ? (
                  <span>Out of stock</span>
                ) : added ? (
                  <>
                    <Check size={14} strokeWidth={1.6} />
                    Added to bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} strokeWidth={1.5} />
                    Add to bag
                  </>
                )}
              </motion.button>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#E5DED3] pt-6 text-center">
              <div className="flex flex-col items-center">
                <Truck size={16} strokeWidth={1.5} className="text-[#C5A880]" />
                <p className="mt-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#161311]">
                  Fast Dispatch
                </p>
                <p className="text-[7.5px] text-[#8C7E72]">Within 24 Hours</p>
              </div>

              <div className="flex flex-col items-center">
                <ShieldCheck
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#C5A880]"
                />
                <p className="mt-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#161311]">
                  100% Authentic
                </p>
                <p className="text-[7.5px] text-[#8C7E72]">Derm Approved</p>
              </div>

              <div className="flex flex-col items-center">
                <RefreshCw
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#C5A880]"
                />
                <p className="mt-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#161311]">
                  Easy COD
                </p>
                <p className="text-[7.5px] text-[#8C7E72]">Cash On Delivery</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ==========================================
            CUSTOMER REVIEWS & TESTIMONIALS SECTION
        ========================================== */}
        {productReviews.length > 0 && (
          <section className="mt-20 border-t border-[#E5DED3] pt-12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#9E9084]">
                  Community Reviews
                </p>
                <h3 className="mt-1 font-serif text-2xl text-[#161311] sm:text-3xl">
                  Real experiences from verified buyers
                </h3>
              </div>
              <span className="rounded-full bg-[#161311] px-3.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#FAF7F2]">
                {productReviews.length} Reviews
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productReviews.slice(0, visibleReviewsCount).map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#C5A880]">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={11}
                          className={
                            s < (rev.rating || 5)
                              ? "fill-current"
                              : "text-stone-300"
                          }
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    {rev.isVerifiedBuyer || rev.verified ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[7.5px] font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                        Verified Purchase
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-xs font-semibold text-[#161311]">
                    "{rev.title || rev.review || rev.feedback || "Wonderful product!"}"
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#524942]">
                    {rev.review || rev.feedback || rev.comment || rev.text}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-200/60 pt-3 text-[9px] text-[#8C7E72]">
                    <span className="font-medium text-[#161311]">
                      {rev.name || "Happy Customer"}
                    </span>
                    <span>
                      {rev.date
                        ? new Date(rev.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Verified Buyer"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* AFTER 6 REVIEWS: VIEW MORE REVIEWS BUTTON */}
            {productReviews.length > 6 && (
              <div className="mt-10 flex justify-center">
                {visibleReviewsCount < productReviews.length ? (
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVisibleReviewsCount((prev) => prev + 6)}
                    className="inline-flex items-center gap-2.5 rounded-full border border-[#161311] bg-[#161311] px-8 py-3.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#FAF7F2] shadow-[0_8px_20px_rgba(22,19,17,0.12)] transition-all duration-300 hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#161311] hover:shadow-[0_10px_25px_rgba(197,168,128,0.25)]"
                  >
                    <span>View more reviews</span>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[8px] font-bold text-white">
                      +{productReviews.length - visibleReviewsCount}
                    </span>
                    <ChevronDown size={14} strokeWidth={2} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVisibleReviewsCount(6)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#161311] bg-transparent px-8 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#161311] transition-all duration-300 hover:bg-[#161311] hover:text-[#FAF7F2]"
                  >
                    <span>Show less</span>
                    <ChevronUp size={14} strokeWidth={2} />
                  </motion.button>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetails;
