import { motion } from "framer-motion";
import {
  Leaf,
  Sparkles,
  HandHeart,
  ShieldCheck,
} from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Carefully Selected Ingredients",
    description:
      "Every formula starts with actives we trust and ingredients that work gently on your skin.",
  },
  {
    icon: Sparkles,
    title: "Skin-Friendly Formulas",
    description:
      "Fragrance-light textures, thoughtfully balanced and made for uncomplicated daily routines.",
  },
  {
    icon: HandHeart,
    title: "Cruelty-Free Approach",
    description:
      "Never tested on animals — from the first sample to the final batch.",
  },
  {
    icon: ShieldCheck,
    title: "Made for Everyday Skincare",
    description:
      "Routines that fit real mornings and quiet evenings, without complicated ten-step rules.",
  },
];

function WhyLuv03() {
  return (
    <section className="border-b border-[#ddd7ce] bg-[#f8f6f1]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">

        {/* HEADER */}
        <motion.div
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
            Why Luv03
          </p>

          <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#3d3028] md:text-4xl">
            Why choose Luv03
          </h2>
        </motion.div>

        {/* REASONS */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
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
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  border-[#ddd7ce]
                  px-5
                  py-6
                  lg:px-5
                  ${
                    index !== 3
                      ? "lg:border-r"
                      : ""
                  }
                  ${
                    index < 3
                      ? "border-b lg:border-b-0"
                      : ""
                  }
                `}
              >
                {/* ICON */}
                <motion.div
                  whileHover={{
                    y: -3,
                    scale: 1.08,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="mb-5 text-[#a96f4b]"
                >
                  <Icon
                    size={19}
                    strokeWidth={1.25}
                  />
                </motion.div>

                {/* TITLE */}
                <h3 className="max-w-[220px] font-serif text-[14px] leading-[1.3] text-[#3d3028]">
                  {reason.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 max-w-[235px] text-[9px] leading-5 text-[#756960]">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyLuv03;