import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-12 sm:py-16 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl rounded-[32px] border border-white/80 bg-white/60 p-7 shadow-[0_20px_50px_rgba(22,19,17,0.06)] backdrop-blur-xl sm:p-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-5 inline-block rounded-full border border-white/80 bg-white/85 px-3.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#161311] shadow-sm backdrop-blur-sm"
          >
            Premium skincare · Made for everyday
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="font-serif text-[48px] leading-[0.94] tracking-[-0.04em] text-[#161311] sm:text-[58px] lg:text-[70px]"
          >
            Your Skin.
            <br />
            Your Glow.
            <br />
            Your Luv<span className="text-[#C5A880]">o3.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-6 max-w-md text-[13px] font-normal leading-6 text-[#2E2620]"
          >
            Simple, effective skincare made for your everyday glow.
            Thoughtful formulas, comfortable textures, and routines
            you'll actually want to follow.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/shop"
              className="group flex items-center gap-2 rounded-full bg-[#161311] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#FAF7F2] shadow-[0_10px_25px_rgba(22,19,17,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#231F1C] hover:shadow-[0_14px_30px_rgba(197,168,128,0.25)]"
            >
              Shop now

              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/shop"
              onClick={(e) => {
                const el = document.getElementById("featured-products");
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="rounded-full border border-[#C5A880] bg-white/80 px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#161311] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#161311] hover:text-[#FAF7F2] hover:border-[#161311] hover:shadow-md"
            >
              Explore collection
            </Link>
          </motion.div>

          {/* RATING */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="flex gap-0.5 text-[#C5A880]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>

            <span className="text-[9px] font-medium text-[#2E2620]">
              4.8 average from 1,200+ Luv03 routines
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 25 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[430px]"
        >
          <div className="relative aspect-[0.9] overflow-hidden rounded-[30px] border border-white/60 bg-[#F2ECE1]/60 shadow-[0_20px_50px_rgba(109,0,25,0.08),0_0_30px_rgba(244,194,194,0.3)] backdrop-blur-sm">
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
              alt="Radiant, glowing skin with Luv03 rituals"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#161311]/10 via-transparent to-transparent" />
          </div>

          {/* RESULT BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="absolute -bottom-4 left-5 rounded-2xl border border-white/80 bg-white/75 px-5 py-3 shadow-[0_16px_40px_rgba(109,0,25,0.08)] backdrop-blur-xl sm:left-8"
          >
            <p className="font-serif text-xl leading-none text-[#161311]">
              96%
            </p>

            <p className="mt-1 text-[8px] text-[#8C7E72]">
              said skin felt calmer in 4 weeks
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;