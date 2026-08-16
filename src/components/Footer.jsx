import { motion } from "framer-motion";
import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const shopLinks = [
  "All Products",
  "Best Sellers",
  "Skincare",
  "New Arrivals",
];

const helpLinks = [
  "Contact Us",
  "Shipping & Delivery",
  "Returns & Refunds",
  "FAQs",
];

const companyLinks = [
  "About Luv03",
  "Our Story",
  "Ingredients",
  "Privacy Policy",
];

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#2f2520] text-[#f8f6f1]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">

        {/* TOP FOOTER */}
        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">

          {/* BRAND */}
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <a
              href="#"
              className="font-serif text-3xl tracking-tight"
            >
              Luv<span className="text-[#c58b65]">03</span>
            </a>

            <p className="mt-5 max-w-xs text-[10px] leading-5 text-[#bcaea4]">
              Thoughtfully made skincare for simple routines,
              comfortable skin and everyday glow.
            </p>

            {/* CONTACT */}
            <div className="mt-7 space-y-3">

              <div className="flex items-center gap-3 text-[#bcaea4]">
                <Mail size={13} strokeWidth={1.3} />

                <span className="text-[9px]">
                  hello@luv03.com
                </span>
              </div>

              <div className="flex items-center gap-3 text-[#bcaea4]">
                <Phone size={13} strokeWidth={1.3} />

                <span className="text-[9px]">
                  +91 00000 00000
                </span>
              </div>

              <div className="flex items-center gap-3 text-[#bcaea4]">
                <MapPin size={13} strokeWidth={1.3} />

                <span className="text-[9px]">
                  Chennai, India
                </span>
              </div>

            </div>
          </motion.div>

          {/* SHOP */}
          <FooterColumn
            title="Shop"
            links={shopLinks}
            delay={0.1}
          />

          {/* HELP */}
          <FooterColumn
            title="Help"
            links={helpLinks}
            delay={0.2}
          />

          {/* COMPANY */}
          <FooterColumn
            title="Company"
            links={companyLinks}
            delay={0.3}
          />

        </div>

        {/* SOCIAL + BOTTOM */}
        <div className="flex flex-col gap-7 py-7 md:flex-row md:items-center md:justify-between">

          {/* SOCIAL */}
          <div className="flex items-center gap-5">

            <a
              href="#"
              aria-label="Instagram"
              className="text-[9px] uppercase tracking-[0.12em] text-[#bcaea4] transition hover:text-[#f8f6f1]"
            >
              Instagram
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="text-[9px] uppercase tracking-[0.12em] text-[#bcaea4] transition hover:text-[#f8f6f1]"
            >
              Facebook
            </a>

            <a
              href="#"
              aria-label="Pinterest"
              className="text-[9px] uppercase tracking-[0.12em] text-[#bcaea4] transition hover:text-[#f8f6f1]"
            >
              Pinterest
            </a>

          </div>

          {/* COPYRIGHT */}
          <p className="text-[8px] tracking-[0.05em] text-[#8f8178]">
            © {new Date().getFullYear()} Luv03. All rights reserved.
          </p>

          {/* BACK TO TOP */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 self-start text-[8px] uppercase tracking-[0.14em] text-[#bcaea4] transition hover:text-[#f8f6f1] md:self-auto"
          >
            Back to top

            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 transition group-hover:border-white/40">
              <ArrowUp
                size={12}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </span>
          </button>

        </div>

      </div>
    </footer>
  );
}

/* FOOTER COLUMN */

function FooterColumn({ title, links, delay }) {
  return (
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        delay,
      }}
    >
      <h3 className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#f8f6f1]">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-[9px] text-[#bcaea4] transition hover:text-[#f8f6f1]"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default Footer;