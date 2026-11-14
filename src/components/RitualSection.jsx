import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Cleanse",
    description:
      "A gentle gel that respects your barrier while lifting the day away.",
  },
  {
    number: "02",
    title: "Treat",
    description:
      "Targeted serums and essences for glow, hydration and clarity.",
  },
  {
    number: "03",
    title: "Moisturise",
    description:
      "Ceramide-rich comfort that seals everything in.",
  },
  {
    number: "04",
    title: "Protect",
    description:
      "Invisible mineral SPF as the final, non-negotiable step.",
  },
];

function RitualSection() {
  return (
    <section className="overflow-hidden border-b border-white/60 bg-transparent">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-28">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* IMAGE */}
          <motion.div
            initial={{
              opacity: 0,
              x: -60,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(109,0,25,0.08),0_0_30px_rgba(244,194,194,0.3)] backdrop-blur-sm"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
              alt="Woman applying skincare"
              initial={{
                scale: 1.08,
              }}
              whileInView={{
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="aspect-[0.95] h-full w-full object-cover lg:aspect-[0.92]"
            />

            {/* IMAGE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311]/10 to-transparent" />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{
              opacity: 0,
              x: 60,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* LABEL */}
            <p className="inline-block rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#161311] shadow-sm backdrop-blur-md">
              The Luv03 ritual
            </p>

            {/* TITLE */}
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-[1.05] tracking-tight text-[#161311] md:text-4xl lg:text-5xl">
              Four honest steps, morning and night
            </h2>

            {/* STEPS */}
            <div className="mt-10">

              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 20,
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
                    delay: 0.2 + index * 0.1,
                  }}
                  className="grid grid-cols-[32px_1fr] gap-4 border-b border-[#E5DED3] py-5 first:border-t"
                >

                  {/* NUMBER */}
                  <span className="pt-1 text-[8px] font-medium tracking-[0.1em] text-[#C5A880]">
                    {step.number}
                  </span>

                  {/* TEXT */}
                  <div>
                    <h3 className="font-serif text-[15px] text-[#161311]">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-lg text-[10px] font-normal leading-5 text-[#2E2620]">
                      {step.description}
                    </p>
                  </div>

                </motion.div>
              ))}

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default RitualSection;