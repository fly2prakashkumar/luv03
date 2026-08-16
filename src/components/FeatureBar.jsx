import { motion } from "framer-motion";
import { Leaf, Droplets, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Thoughtfully Made",
    description: "Simple formulas made with intention.",
  },
  {
    icon: Droplets,
    title: "Deep Hydration",
    description: "Comfortable hydration for everyday skin.",
  },
  {
    icon: Sparkles,
    title: "Visible Glow",
    description: "Healthy-looking skin, naturally.",
  },
  {
    icon: Heart,
    title: "Made With Care",
    description: "Created for your everyday ritual.",
  },
];

function FeatureBar() {
  return (
    <section className="border-y border-[#ddd7ce] bg-[#f8f6f1]">
      <div className="mx-auto max-w-[1440px]">

        <div className="grid grid-cols-2 md:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className={`
                  flex
                  min-h-[150px]
                  flex-col
                  items-center
                  justify-center
                  px-6
                  py-8
                  text-center

                  ${
                    index !== 3
                      ? "md:border-r md:border-[#ddd7ce]"
                      : ""
                  }

                  ${
                    index < 2
                      ? "border-b border-[#ddd7ce] md:border-b-0"
                      : ""
                  }
                `}
              >
                {/* ICON */}
                <motion.div
                  whileHover={{
                    scale: 1.08,
                  }}
                  className="mb-5 text-[#a96f4b]"
                >
                  <Icon
                    size={27}
                    strokeWidth={1.25}
                  />
                </motion.div>

                {/* TITLE */}
                <h3 className="font-serif text-[17px] leading-none text-[#3d3028]">
                  {feature.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 text-[9px] leading-4 tracking-[0.04em] text-[#85776e]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FeatureBar;