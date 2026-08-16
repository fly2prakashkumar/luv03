import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
  };

  return (
    <section className="overflow-hidden bg-[#584539]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{
              opacity: 0,
              x: -45,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.15,
                duration: 0.5,
              }}
              className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#d8c5b8]"
            >
              Stay in the loop
            </motion.p>

            <motion.h2
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
              }}
              transition={{
                delay: 0.25,
                duration: 0.7,
              }}
              className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] tracking-tight text-[#f8f6f1] md:text-5xl"
            >
              A little more Luv
              <br />
              in your inbox.
            </motion.h2>

            <motion.p
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
              }}
              transition={{
                delay: 0.4,
                duration: 0.6,
              }}
              className="mt-5 max-w-md text-xs leading-6 text-[#d8c9bf]"
            >
              Get skincare tips, new product launches, exclusive offers,
              and little reminders to take care of your skin.
            </motion.p>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{
              opacity: 0,
              x: 45,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              delay: 0.15,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:pl-10"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit}>

                <label
                  htmlFor="newsletter-email"
                  className="mb-3 block text-[9px] font-medium uppercase tracking-[0.15em] text-[#d8c5b8]"
                >
                  Your email
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* INPUT */}
                  <motion.input
                    whileFocus={{
                      scale: 1.01,
                    }}
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-xs text-white outline-none placeholder:text-[#c7b6aa] transition-all duration-300 focus:border-white/50 focus:bg-white/15"
                  />

                  {/* BUTTON */}
                  <motion.button
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="submit"
                    className="group flex h-12 items-center justify-center gap-2 rounded-full bg-[#f8f6f1] px-7 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#584539] transition-all duration-300 hover:bg-white hover:shadow-lg"
                  >
                    Subscribe

                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </motion.button>

                </div>

                <p className="mt-4 text-[8px] leading-5 text-[#c7b6aa]">
                  By subscribing, you agree to receive emails from Luv03.
                  You can unsubscribe anytime.
                </p>
              </form>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-[24px] border border-white/15 bg-white/10 p-8 backdrop-blur-sm"
              >
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 180,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8f6f1] text-[#584539]"
                >
                  <Check size={18} strokeWidth={1.5} />
                </motion.div>

                <h3 className="mt-5 font-serif text-2xl text-[#f8f6f1]">
                  You're on the list.
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#d8c9bf]">
                  Welcome to the Luv03 community. Keep an eye on your inbox
                  for something lovely.
                </p>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Newsletter;