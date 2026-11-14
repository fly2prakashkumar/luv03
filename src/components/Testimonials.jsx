import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getStoredTestimonials } from "../utils/reviews";

function Testimonials() {
  const [testimonialList, setTestimonialList] = useState(getStoredTestimonials());
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const handleUpdate = () => {
      setTestimonialList(getStoredTestimonials());
    };

    window.addEventListener("luv03-reviews-change", handleUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "luv03-testimonials" || !e.key) {
        handleUpdate();
      }
    });

    return () => {
      window.removeEventListener("luv03-reviews-change", handleUpdate);
    };
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  return (
    <section className="overflow-hidden border-b border-white/60 bg-gradient-to-b from-white/30 via-[#EFE8DD]/30 to-transparent backdrop-blur-sm">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="inline-block rounded-full border border-white/80 bg-white/85 px-3.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#161311] shadow-sm backdrop-blur-md">
            Verified Experiences
          </p>

          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#161311] md:text-4xl">
            Loved by your skin.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-[10px] leading-5 text-[#524942]">
            Real customer rituals, verified delivery feedback, and authentic skincare journeys.
          </p>
        </motion.div>

        {/* TESTIMONIAL GRID */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialList.slice(0, visibleCount).map((testimonial, index) => {
            const stars = Array.from({ length: testimonial.rating || 5 });

            return (
              <motion.article
                key={testimonial.id || testimonial.name + index}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 3) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -5 }}
                className="relative flex flex-col justify-between rounded-[24px] border border-white/80 bg-white/80 p-7 shadow-[0_12px_32px_rgba(22,19,17,0.06)] backdrop-blur-xl md:p-8"
              >
                <div>
                  {/* QUOTE ICON */}
                  <div className="absolute right-6 top-6 text-[#C5A880]/60">
                    <Quote size={24} strokeWidth={1} />
                  </div>

                  {/* STARS & VERIFIED BADGE */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-1 text-[#C5A880]">
                      {stars.map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          strokeWidth={1.2}
                          fill="currentColor"
                        />
                      ))}
                    </div>

                    {testimonial.isVerifiedBuyer && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#C5A880]/15 px-2.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#73582A]">
                        <ShieldCheck size={11} className="text-[#C5A880]" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* PRODUCT NAME TAG */}
                  {testimonial.productName && (
                    <p className="mt-3 text-[10px] font-medium text-[#C5A880] uppercase tracking-wider">
                      {testimonial.productName}
                    </p>
                  )}

                  {/* REVIEW TEXT */}
                  <p className="mt-4 font-serif text-[15px] leading-7 text-[#161311]">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* CUSTOMER FOOTER */}
                <div className="mt-8 border-t border-[#E5DED3] pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161311]">
                        {testimonial.name}
                      </p>
                      <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-[#524942]">
                        {testimonial.location || "India"}
                      </p>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#161311]/5 text-[#C5A880]">
                      <Sparkles size={12} />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* AFTER 6 REVIEWS: VIEW MORE REVIEWS BUTTON */}
        {testimonialList.length > 6 && (
          <div className="mt-12 flex justify-center">
            {visibleCount < testimonialList.length ? (
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewMore}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#161311] bg-[#161311] px-8 py-3.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#FAF7F2] shadow-[0_8px_20px_rgba(22,19,17,0.15)] transition-all duration-300 hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#161311] hover:shadow-[0_10px_25px_rgba(197,168,128,0.3)]"
              >
                <span>View more reviews</span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[8px] font-bold text-white">
                  +{testimonialList.length - visibleCount}
                </span>
                <ChevronDown size={14} strokeWidth={2} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShowLess}
                className="inline-flex items-center gap-2 rounded-full border border-[#161311] bg-transparent px-8 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#161311] transition-all duration-300 hover:bg-[#161311] hover:text-[#FAF7F2]"
              >
                <span>Show less</span>
                <ChevronUp size={14} strokeWidth={2} />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
