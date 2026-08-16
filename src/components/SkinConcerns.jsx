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
    <section className="border-b border-[#ddd7ce] bg-[#f5f2eb]">
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
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
            Find your focus
          </p>

          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#3d3028] md:text-4xl">
            Shop by skin concern
          </h2>

          <p className="mt-3 max-w-lg text-[10px] leading-5 text-[#756960]">
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
              className="group rounded-[14px] border border-[#ddd7ce] bg-[#f8f6f1] px-5 py-5 text-left transition-colors duration-300 hover:border-[#b99a83] hover:bg-[#eee9df]"
            >
              <p className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#9a897c]">
                Concern
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">

                <span className="font-serif text-[13px] text-[#3d3028]">
                  {concern}
                </span>

                <span className="text-sm text-[#a96f4b] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
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