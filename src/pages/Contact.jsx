import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, MessageCircle } from "lucide-react";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-[#3d3028]">

      {/* HEADER */}

      <section className="border-b border-[#ddd7ce]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8a796c]"
          >
            Get in touch
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl"
          >
            We'd love to
            <br />
            hear from you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-sm leading-7 text-[#756960]"
          >
            Have a question about a product, your order, or your
            skincare routine? Send us a message and we'll get back
            to you.
          </motion.p>

        </div>
      </section>


      {/* CONTACT CONTENT */}

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">

        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
              Contact details
            </p>

            <div className="mt-8 space-y-7">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee9df]">
                  <Mail size={15} strokeWidth={1.4} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#9a897c]">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-[#51463f]">
                    hello@luv03.com
                  </p>
                </div>

              </div>


              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee9df]">
                  <MessageCircle
                    size={15}
                    strokeWidth={1.4}
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#9a897c]">
                    Support
                  </p>

                  <p className="mt-1 text-sm text-[#51463f]">
                    Monday – Friday
                  </p>

                  <p className="mt-1 text-xs text-[#8a796c]">
                    10:00 AM – 6:00 PM
                  </p>
                </div>

              </div>

            </div>

          </motion.div>


          {/* FORM */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            {!submitted ? (

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                <div className="grid gap-6 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#756960]">
                      Name
                    </label>

                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className="h-12 w-full border-b border-[#d5ccc2] bg-transparent px-1 text-sm text-[#3d3028] outline-none transition placeholder:text-[#aaa098] focus:border-[#584539]"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#756960]">
                      Email
                    </label>

                    <input
                      required
                      type="email"
                      placeholder="Your email"
                      className="h-12 w-full border-b border-[#d5ccc2] bg-transparent px-1 text-sm text-[#3d3028] outline-none transition placeholder:text-[#aaa098] focus:border-[#584539]"
                    />
                  </div>

                </div>


                <div>
                  <label className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#756960]">
                    Subject
                  </label>

                  <input
                    required
                    type="text"
                    placeholder="How can we help?"
                    className="h-12 w-full border-b border-[#d5ccc2] bg-transparent px-1 text-sm text-[#3d3028] outline-none transition placeholder:text-[#aaa098] focus:border-[#584539]"
                  />
                </div>


                <div>
                  <label className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#756960]">
                    Message
                  </label>

                  <textarea
                    required
                    rows="6"
                    placeholder="Tell us a little more..."
                    className="w-full resize-none border-b border-[#d5ccc2] bg-transparent px-1 py-3 text-sm text-[#3d3028] outline-none transition placeholder:text-[#aaa098] focus:border-[#584539]"
                  />
                </div>


                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="group flex h-12 items-center justify-center gap-2 rounded-full bg-[#584539] px-8 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
                >
                  Send message

                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.button>

              </form>

            ) : (

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="rounded-[24px] bg-[#eee9df] p-10"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#584539] text-[#f8f6f1]">
                  <Check size={19} strokeWidth={1.5} />
                </div>

                <h2 className="mt-6 font-serif text-3xl">
                  Message received.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#756960]">
                  Thank you for reaching out to Luv03. We'll get
                  back to you as soon as possible.
                </p>

              </motion.div>

            )}

          </motion.div>

        </div>

      </section>

    </main>
  );
}

export default Contact;