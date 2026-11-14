import { motion } from "framer-motion";

function About() {
  return (
    <main className="bg-transparent text-[#161311]">

      {/* HERO */}

      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8C7E72]">
              About Luv03
            </p>

            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Skincare that feels
              <br />
              like self-love.
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#524942]">
              Luv03 was created around one simple idea — skincare
              should feel personal, uncomplicated, and enjoyable.
            </p>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#524942]">
              We believe in thoughtful formulas, comfortable textures,
              and everyday rituals that make taking care of your skin
              feel a little more special.
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
            }}
            className="overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-b from-white/80 via-[#F2ECE1]/60 to-[#F2ECE1]/90 shadow-[0_20px_50px_rgba(109,0,25,0.06),0_0_40px_rgba(244,194,194,0.3)] backdrop-blur-sm"
          >
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85"
              alt="Luv03 skincare"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>

        </div>
      </section>


      {/* PHILOSOPHY */}

      <section className="bg-[#161311] text-[#FAF7F2]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-24">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#C5A880]">
              Our philosophy
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Less noise.
              <br />
              More ritual.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#E8D7BE]">
              Your skincare routine doesn't need to be complicated.
              We focus on simple products that fit naturally into your
              everyday life.
            </p>
          </motion.div>


          <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Thoughtful",
                text: "Products designed with purpose and everyday routines in mind.",
              },
              {
                number: "02",
                title: "Comfortable",
                text: "Textures and rituals that make skincare something you look forward to.",
              },
              {
                number: "03",
                title: "Everyday",
                text: "Simple skincare made to become part of your daily rhythm.",
              },
            ].map((item, index) => (

              <motion.div
                key={item.number}
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
                  delay: index * 0.12,
                  duration: 0.6,
                }}
                className="bg-[#161311] p-8 lg:p-10"
              >
                <span className="text-[9px] tracking-[0.15em] text-[#C5A880]">
                  {item.number}
                </span>

                <h3 className="mt-8 font-serif text-2xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-[#E8D7BE]">
                  {item.text}
                </p>
              </motion.div>

            ))}

          </div>

        </div>
      </section>


      {/* CLOSING */}

      <section className="mx-auto max-w-[900px] px-6 py-24 text-center">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8C7E72]"
        >
          Luv03
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-serif text-4xl leading-tight md:text-5xl"
        >
          Make your everyday
          <br />
          ritual a little more lovely.
        </motion.h2>

      </section>

    </main>
  );
}

export default About;