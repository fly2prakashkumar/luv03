import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya R.",
    location: "Chennai",
    review:
      "The texture of the moisturiser is beautiful. My skin feels comfortable and hydrated without feeling heavy.",
  },
  {
    name: "Meera S.",
    location: "Bangalore",
    review:
      "I love how simple the routine feels now. The products are easy to use and my skin looks much more fresh.",
  },
  {
    name: "Nisha K.",
    location: "Mumbai",
    review:
      "The sunscreen has become my everyday essential. Lightweight, comfortable and perfect under makeup.",
  },
];

function Testimonials() {
  return (
    <section className="overflow-hidden border-b border-[#ddd7ce] bg-[#f5f2eb]">
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
          className="text-center"
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
            Kind words
          </p>

          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#3d3028] md:text-4xl">
            Loved by your skin.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-[10px] leading-5 text-[#756960]">
            Real routines, real experiences and a little more love for
            everyday skincare.
          </p>
        </motion.div>

        {/* TESTIMONIAL GRID */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">

          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{
                opacity: 0,
                y: 40,
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
                duration: 0.65,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -5,
              }}
              className="relative rounded-[22px] border border-[#ddd7ce] bg-[#f8f6f1] p-7 md:p-8"
            >

              {/* QUOTE ICON */}
              <div className="absolute right-6 top-6 text-[#c4a58e]">
                <Quote
                  size={25}
                  strokeWidth={1}
                />
              </div>

              {/* STARS */}
              <div className="flex gap-1 text-[#a96f4b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={11}
                    strokeWidth={1.2}
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* REVIEW */}
              <p className="mt-7 max-w-sm font-serif text-[16px] leading-7 text-[#4b3d35]">
                “{testimonial.review}”
              </p>

              {/* CUSTOMER */}
              <div className="mt-8 border-t border-[#ddd7ce] pt-5">

                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#51463f]">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                  {testimonial.location}
                </p>

              </div>

            </motion.article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;