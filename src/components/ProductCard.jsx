import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { requireLogin } from "../utils/auth";


function ProductCard({
  product,
}) {

  const navigate = useNavigate();

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useCart();


  // =================================================
  // ADD TO BAG
  // =================================================

  const handleAddToCart = () => {

    // User must be logged in
    if (!requireLogin(navigate)) {
      return;
    }

    addToCart(
      product,
      1
    );
  };


  // =================================================
  // WISHLIST
  // =================================================

  const handleWishlist = (
    event
  ) => {

    event.preventDefault();
    event.stopPropagation();


    // User must be logged in
    if (!requireLogin(navigate)) {
      return;
    }


    toggleWishlist(
      product
    );
  };


  const wishlisted =
    isWishlisted(
      product.id
    );


  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
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
      className="group min-w-0"
    >

      {/* =================================================
          IMAGE
      ================================================= */}

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


        {/* =================================================
            WISHLIST
        ================================================= */}

        <motion.button
          type="button"
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={
            handleWishlist
          }
          whileTap={{
            scale: 0.85,
          }}
          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 sm:right-3 sm:top-3 sm:h-8 sm:w-8 ${
            wishlisted
              ? "bg-[#b56d43] text-white"
              : "bg-[#f8f6f1]/90 text-[#51463f] hover:bg-[#f8f6f1] hover:text-[#b56d43]"
          }`}
        >

          <Heart
            size={13}
            strokeWidth={1.4}
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
            className="sm:h-[14px] sm:w-[14px]"
          />

        </motion.button>

      </div>


      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <div className="min-w-0 pt-3 sm:pt-4">

        {/* CATEGORY */}

        <p className="truncate text-[7px] font-medium uppercase tracking-[0.12em] text-[#9a897c] sm:text-[8px] sm:tracking-[0.16em]">
          {product.category}
        </p>


        {/* PRODUCT NAME */}

        <Link
          to={`/product/${product.slug}`}
          className="mt-1 block truncate font-serif text-[14px] leading-5 text-[#3d3028] transition-colors hover:text-[#b56d43] sm:text-[17px]"
          title={product.name}
        >
          {product.name}
        </Link>


        {/* =================================================
            RATING
        ================================================= */}

        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2 sm:gap-2">

          <span className="text-[8px] tracking-wide text-[#8a796c] sm:text-[9px]">

            ★ {product.rating}

          </span>


          <span className="text-[7px] text-[#b1a49b] sm:text-[8px]">

            ({product.reviews})

          </span>

        </div>


        {/* =================================================
            PRICE
        ================================================= */}

        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 sm:mt-2 sm:gap-2">

          <span className="shrink-0 text-[10px] font-medium text-[#3d3028] sm:text-[11px]">

            ₹
            {Number(
              product.price
            ).toLocaleString(
              "en-IN"
            )}

          </span>


          {product.originalPrice && (

            <span className="truncate text-[8px] text-[#aaa098] line-through sm:text-[9px]">

              ₹
              {Number(
                product.originalPrice
              ).toLocaleString(
                "en-IN"
              )}

            </span>

          )}

        </div>


        {/* =================================================
            ADD TO BAG
        ================================================= */}

        <motion.button
          type="button"
          onClick={
            handleAddToCart
          }
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            mt-3
            flex
            h-9
            w-full
            min-w-0
            items-center
            justify-center
            gap-1.5
            overflow-hidden
            rounded-full
            border
            border-[#584539]
            px-2
            text-[7px]
            font-medium
            uppercase
            tracking-[0.08em]
            text-[#584539]
            transition-all
            duration-300
            hover:bg-[#584539]
            hover:text-[#f8f6f1]

            sm:mt-4
            sm:h-10
            sm:gap-2
            sm:px-3
            sm:text-[8px]
            sm:tracking-[0.14em]
          "
        >

          <ShoppingBag
            size={11}
            strokeWidth={1.4}
            className="h-[11px] w-[11px] shrink-0 sm:h-[13px] sm:w-[13px]"
          />


          <span className="min-w-0 truncate whitespace-nowrap">
            Add to bag
          </span>

        </motion.button>

      </div>

    </motion.article>
  );
}


export default ProductCard;