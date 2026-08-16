import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Shop",
    path: "/shop",
  },
  {
    name: "Categories",
    path: "/#categories",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu whenever page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleCategoriesClick = (e) => {
    e.preventDefault();

    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById("categories");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);

      return;
    }

    const section = document.getElementById("categories");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const isActive = (item) => {
    if (item.name === "Home") {
      return location.pathname === "/";
    }

    if (item.name === "Shop") {
      return location.pathname === "/shop";
    }

    if (item.name === "About") {
      return location.pathname === "/about";
    }

    if (item.name === "Contact") {
      return location.pathname === "/contact";
    }

    if (item.name === "Categories") {
      return false;
    }

    return false;
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <motion.header
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-[#ddd7ce]/80 bg-[#f8f6f1]/90 shadow-[0_8px_30px_rgba(61,48,40,0.05)] backdrop-blur-xl"
            : "border-b border-transparent bg-[#f8f6f1]"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">

          {/* ================= LOGO ================= */}

          <Link to="/">
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative z-10 font-serif text-2xl tracking-tight text-[#3d3028]"
            >
              Luv<span className="text-[#b56d43]">03</span>
            </motion.div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => {
              const active = isActive(item);

              if (item.name === "Categories") {
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    onClick={handleCategoriesClick}
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                      duration: 0.5,
                    }}
                    className="group relative cursor-pointer text-[11px] font-medium uppercase tracking-[0.12em] text-[#51463f]"
                  >
                    <span className="transition-colors duration-300 group-hover:text-[#b56d43]">
                      {item.name}
                    </span>

                    <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#b56d43] transition-all duration-300 group-hover:w-full" />
                  </motion.button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                      duration: 0.5,
                    }}
                    className="group relative cursor-pointer text-[11px] font-medium uppercase tracking-[0.12em]"
                  >
                    <span
                      className={`transition-colors duration-300 ${
                        active
                          ? "text-[#b56d43]"
                          : "text-[#51463f] group-hover:text-[#b56d43]"
                      }`}
                    >
                      {item.name}
                    </span>

                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-[#b56d43] transition-all duration-300 ${
                        active
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* ================= RIGHT ICONS ================= */}

          <div className="flex items-center gap-4 text-[#40352f]">

            {/* SEARCH */}

            <motion.button
              type="button"
              whileHover={{
                scale: 1.15,
                rotate: -5,
              }}
              whileTap={{
                scale: 0.9,
              }}
              aria-label="Search"
              className="transition-colors duration-300 hover:text-[#b56d43]"
            >
              <Search
                size={16}
                strokeWidth={1.5}
              />
            </motion.button>

            {/* WISHLIST */}

            <motion.button
              type="button"
              whileHover={{
                scale: 1.15,
              }}
              whileTap={{
                scale: 0.9,
              }}
              aria-label="Wishlist"
              className="hidden transition-colors duration-300 hover:text-[#b56d43] sm:block"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
              />
            </motion.button>

            {/* ================= CART ================= */}

            <Link
              to="/cart"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <motion.div
                whileHover={{
                  scale: 1.12,
                  y: -1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="relative cursor-pointer transition-colors duration-300 hover:text-[#b56d43]"
              >
                <ShoppingBag
                  size={16}
                  strokeWidth={1.5}
                />

                {/* CART COUNT */}

                <AnimatePresence mode="popLayout">
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        y: 3,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className="absolute -right-2 -top-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#b56d43] px-1 text-[7px] font-medium text-white"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* ACCOUNT */}

            <motion.button
              type="button"
              whileHover={{
                scale: 1.12,
              }}
              whileTap={{
                scale: 0.9,
              }}
              aria-label="Account"
              className="hidden transition-colors duration-300 hover:text-[#b56d43] sm:block"
            >
              <UserRound
                size={16}
                strokeWidth={1.5}
              />
            </motion.button>

            {/* ================= MOBILE MENU ================= */}

            <motion.button
              type="button"
              whileTap={{
                scale: 0.9,
              }}
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              className="relative z-10 md:hidden"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{
                      opacity: 0,
                      rotate: -90,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 90,
                    }}
                  >
                    <X
                      size={20}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{
                      opacity: 0,
                      rotate: 90,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: -90,
                    }}
                  >
                    <Menu
                      size={20}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed left-0 right-0 top-20 z-40 overflow-hidden border-b border-[#ddd7ce] bg-[#f8f6f1]/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col px-6 py-6">

              {navItems.map((item, index) => {
                const active = isActive(item);

                if (item.name === "Categories") {
                  return (
                    <motion.button
                      key={item.name}
                      type="button"
                      onClick={handleCategoriesClick}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.07,
                        duration: 0.4,
                      }}
                      className="border-b border-[#ddd7ce] py-4 text-left text-[11px] font-medium uppercase tracking-[0.15em] text-[#51463f] transition-colors duration-300 hover:text-[#b56d43]"
                    >
                      {item.name}
                    </motion.button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                  >
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.07,
                        duration: 0.4,
                      }}
                      className={`border-b border-[#ddd7ce] py-4 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                        active
                          ? "text-[#b56d43]"
                          : "text-[#51463f] hover:text-[#b56d43]"
                      }`}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                );
              })}

              {/* MOBILE ACCOUNT / WISHLIST / BAG */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.4,
                }}
                className="flex flex-wrap items-center gap-5 pt-6"
              >
                <button
                  type="button"
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#756960]"
                >
                  <UserRound
                    size={15}
                    strokeWidth={1.4}
                  />
                  Account
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#756960]"
                >
                  <Heart
                    size={15}
                    strokeWidth={1.4}
                  />
                  Wishlist
                </button>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#756960]"
                >
                  <ShoppingBag
                    size={15}
                    strokeWidth={1.4}
                  />

                  Bag ({cartCount})
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}

      <div className="h-20" />
    </>
  );
}

export default Navbar;