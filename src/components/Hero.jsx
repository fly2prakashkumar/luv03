import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="overflow-hidden bg-[#f8f6f1]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-12 sm:py-16 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-5 text-[9px] font-medium uppercase tracking-[0.28em] text-[#8a7567]"
          >
            Premium skincare · Made for everyday
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="font-serif text-[48px] leading-[0.94] tracking-[-0.04em] text-[#382d27] sm:text-[58px] lg:text-[70px]"
          >
            Your Skin.
            <br />
            Your Glow.
            <br />
            Your Luv<span className="text-[#b56d43]">03.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-7 max-w-md text-[13px] leading-6 text-[#756960]"
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
            <button className="group flex items-center gap-2 rounded-full bg-[#584539] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352c] hover:shadow-lg">
              Shop now

              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button className="rounded-full border border-[#d4cdc4] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#584b43] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
              Explore collection
            </button>
          </motion.div>

          {/* RATING */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="flex gap-0.5 text-[#c77a4c]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>

            <span className="text-[9px] text-[#766a62]">
              4.8 average from 1,200+ Luv03 routines
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 25 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[620px]"
        >
          <div className="relative aspect-[0.9] overflow-hidden rounded-[30px] bg-[#ded5ca]">
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=90"
              alt="Luv03 skincare products"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#3d3028]/10 via-transparent to-transparent" />
          </div>

          {/* RESULT BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="absolute -bottom-4 left-5 rounded-2xl border border-[#e2dcd4] bg-[#f8f6f1]/95 px-5 py-3 shadow-[0_12px_35px_rgba(60,45,35,0.08)] backdrop-blur-sm sm:left-8"
          >
            <p className="font-serif text-xl leading-none text-[#3c3029]">
              96%
            </p>

            <p className="mt-1 text-[8px] text-[#766a62]">
              said skin felt calmer in 4 weeks
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;