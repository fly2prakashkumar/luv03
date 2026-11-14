import { motion } from "framer-motion";

const concerns = [
  "Acne & Blemishes",
  "Dry Skin",
  "Oily Skin",
  "Sensitive Skin",
  "Uneven Skin Tone",
  "Dull Skin",
  "Anti-Aging",
  "Sun Protection",
];

function SkinConcerns() {
  return (
    <section className="border-b border-white/60 bg-gradient-to-b from-white/30 via-[#EFE8DD]/40 to-transparent backdrop-blur-sm">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">

        {/* HEADER */}
        <motion.div
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="inline-block rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#161311] shadow-sm backdrop-blur-md">
            Find your focus
          </p>

          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#161311] md:text-4xl">
            Shop by skin concern
          </h2>

          <p className="mt-3 max-w-lg text-[11px] font-normal leading-5 text-[#2E2620]">
            Start where your skin is today. Each concern maps to formulas
            designed for daily, gentle use.
          </p>
        </motion.div>

        {/* CONCERNS */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">

          {concerns.map((concern, index) => (
            <motion.button
              key={concern}
              type="button"
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -4,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group rounded-[14px] border border-white/80 bg-white/70 px-5 py-5 text-left shadow-[0_4px_20px_rgba(109,0,25,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#C5A880] hover:bg-white/95 hover:shadow-[0_8px_25px_rgba(93,63,211,0.12)]"
            >
              <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
                Concern
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">

                <span className="font-serif text-[13px] text-[#161311]">
                  {concern}
                </span>

                <span className="text-sm text-[#C5A880] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>

              </div>
            </motion.button>
          ))}

        </div>

      </div>
    </section>
  );
}

export default SkinConcerns;