import { useEffect, useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

import products from "../data/products";
import { isLoggedIn } from "../utils/auth";


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
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];


const categories = [
  {
    name: "All Products",
    value: "All",
  },
  {
    name: "Serums",
    value: "Serum",
  },
  {
    name: "Moisturisers",
    value: "Moisturiser",
  },
  {
    name: "Sunscreens",
    value: "Sunscreen",
  },
  {
    name: "Cleansers",
    value: "Cleanser",
  },
  {
    name: "Essences",
    value: "Essence",
  },
];


function Navbar() {

  const [scrolled, setScrolled] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [categoriesOpen, setCategoriesOpen] =
    useState(false);

  const [mobileCategoriesOpen, setMobileCategoriesOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());


  const location =
    useLocation();

  const navigate =
    useNavigate();


  const {
    cartCount,
    wishlistCount,
  } = useCart();


  /* =========================================================
     LIVE SEARCH
  ========================================================= */

  const searchResults =
    search.trim().length > 0
      ? products
          .filter((product) => {

            const query =
              search
                .trim()
                .toLowerCase();

            return (
              product.name
                .toLowerCase()
                .includes(query) ||

              product.category
                .toLowerCase()
                .includes(query) ||

              product.description
                .toLowerCase()
                .includes(query)
            );

          })
          .slice(0, 5)
      : [];


  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(
        window.scrollY > 20
      );
    };


    handleScroll();


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  /* =========================================================
     ROUTE CHANGE
  ========================================================= */

  useEffect(() => {

    setMenuOpen(false);
    setCategoriesOpen(false);
    setMobileCategoriesOpen(false);
    setSearch("");
    setLoggedIn(isLoggedIn());

  }, [
    location.pathname,
    location.search,
  ]);


  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchSubmit = (
    event
  ) => {

    event.preventDefault();

    const query =
      search.trim();


    if (!query) {

      navigate("/shop");

      setSearchOpen(false);

      return;

    }


    navigate(
      `/shop?search=${encodeURIComponent(
        query
      )}`
    );


    setSearchOpen(false);

  };


  const openSearch = () => {

    setSearchOpen(true);

    setMenuOpen(false);

    setSearch("");
    setLoggedIn(isLoggedIn());

  };


  const closeSearch = () => {

    setSearchOpen(false);

    setSearch("");
    setLoggedIn(isLoggedIn());

  };


  const getCategoryLink = (
    category
  ) => {

    if (
      category.value === "All"
    ) {
      return "/shop";
    }


    return `/shop?category=${encodeURIComponent(
      category.value
    )}`;

  };


  const handleProductClick = (
    slug
  ) => {

    setSearch("");
    setLoggedIn(isLoggedIn());

    setSearchOpen(false);

    navigate(
      `/product/${slug}`
    );

  };


  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`fixed left-0 top-0 z-50 h-20 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/80 bg-white/85 shadow-[0_8px_32px_rgba(22,19,17,0.06)] backdrop-blur-xl"
            : "border-b border-white/60 bg-white/70 backdrop-blur-lg shadow-sm"
        }`}
      >

        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            aria-label="Luv03 Home"
          >

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="relative z-10 font-serif text-2xl tracking-tight text-[#161311]"
            >

              Luv
              <span className="text-[#C5A880]">
                03
              </span>

            </motion.div>

          </Link>


          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav className="hidden items-center gap-8 md:flex">

            {navItems.map(
              (
                item,
                index
              ) => {

                const isActive =
                  location.pathname ===
                  item.path;


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
                        delay:
                          0.15 +
                          index *
                            0.08,
                        duration: 0.5,
                      }}
                      className="group relative cursor-pointer text-[11px] font-medium uppercase tracking-[0.12em]"
                    >

                      <span
                        className={`transition-colors duration-300 ${
                          isActive
                            ? "text-[#C5A880]"
                            : "text-[#38312B] group-hover:text-[#C5A880]"
                        }`}
                      >
                        {item.name}
                      </span>


                      <span
                        className={`absolute -bottom-2 left-0 h-px bg-[#C5A880] transition-all duration-300 ${
                          isActive
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />

                    </motion.div>

                  </Link>

                );

              }
            )}


            {/* =================================================
                CATEGORIES
            ================================================= */}

            <div
              className="relative"
              onMouseEnter={() =>
                setCategoriesOpen(true)
              }
              onMouseLeave={() =>
                setCategoriesOpen(false)
              }
            >

              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#38312B] transition-colors hover:text-[#C5A880]"
              >

                Categories

                <ChevronDown
                  size={12}
                  strokeWidth={1.5}
                />

              </button>


              <AnimatePresence>

                {categoriesOpen && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 8,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="absolute left-1/2 top-full mt-4 w-52 -translate-x-1/2 rounded-2xl border border-[#E5DED3] bg-[#FAF7F2] p-2 shadow-lg"
                  >

                    {categories.map(
                      (category) => (

                        <Link
                          key={
                            category.value
                          }
                          to={getCategoryLink(
                            category
                          )}
                          className="flex items-center justify-between rounded-xl px-3 py-3 text-[9px] uppercase tracking-[0.1em] text-[#524942] transition-colors hover:bg-[#F2ECE1] hover:text-[#C5A880]"
                        >

                          {category.name}

                          <span>
                            →
                          </span>

                        </Link>

                      )
                    )}

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </nav>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-4 text-[#161311]">


            {/* SEARCH */}

            <motion.button
              type="button"
              onClick={openSearch}
              whileHover={{
                scale: 1.15,
              }}
              whileTap={{
                scale: 0.9,
              }}
              aria-label="Search"
              className="transition-colors hover:text-[#C5A880]"
            >

              <Search
                size={16}
                strokeWidth={1.5}
              />

            </motion.button>


            {/* WISHLIST */}

            <Link
              to="/wishlist"
              aria-label="Wishlist"
            >

              <motion.div
                whileHover={{
                  scale: 1.15,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="relative hidden sm:block"
              >

                <Heart
                  size={16}
                  strokeWidth={1.5}
                  className="transition-colors hover:text-[#C5A880]"
                />


                {wishlistCount > 0 && (

                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#161311] border border-[#C5A880]/50 px-1 text-[7px] text-[#C5A880]">

                    {wishlistCount}

                  </span>

                )}

              </motion.div>

            </Link>


            {/* CART */}

            <Link
              to="/cart"
              aria-label="Shopping bag"
            >

              <motion.div
                whileHover={{
                  scale: 1.12,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="relative"
              >

                <ShoppingBag
                  size={16}
                  strokeWidth={1.5}
                  className="transition-colors hover:text-[#C5A880]"
                />


                {cartCount > 0 && (

                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#161311] border border-[#C5A880]/50 px-1 text-[7px] text-[#C5A880]">

                    {cartCount}

                  </span>

                )}

              </motion.div>

            </Link>


            {/* AUTH: PROFILE ICON IF LOGGED IN, LOGIN BUTTON IF NOT */}
            {loggedIn ? (
              <Link
                to="/profile"
                aria-label="Profile"
                title="Your profile"
              >
                <motion.div
                  whileHover={{
                    scale: 1.12,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="block"
                >
                  <UserRound
                    size={16}
                    strokeWidth={1.5}
                    className="transition-colors hover:text-[#C5A880]"
                  />
                </motion.div>
              </Link>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="inline-flex items-center justify-center rounded-full bg-[#161311] px-3.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#FAF7F2] shadow-[0_4px_12px_rgba(22,19,17,0.18)] transition-all duration-300 hover:bg-[#C5A880] hover:text-[#161311] hover:shadow-md sm:px-4 sm:py-1.5 sm:text-[9px]"
              >
                Login
              </Link>
            )}


            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              className="md:hidden"
              aria-label="Menu"
            >

              {menuOpen ? (

                <X
                  size={20}
                  strokeWidth={1.4}
                />

              ) : (

                <Menu
                  size={20}
                  strokeWidth={1.4}
                />

              )}

            </button>

          </div>

        </div>


        {/* =====================================================
            SEARCH PANEL
        ===================================================== */}

        <AnimatePresence>

          {searchOpen && (

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
              className="border-t border-[#E5DED3] bg-[#FAF7F2]"
            >

              <div className="mx-auto max-w-[850px] px-6 py-5">

                <form
                  onSubmit={
                    handleSearchSubmit
                  }
                  className="flex items-center gap-4"
                >

                  <Search
                    size={18}
                    strokeWidth={1.4}
                    className="shrink-0 text-[#8C7E72]"
                  />


                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search products..."
                    autoFocus
                    className="h-11 flex-1 bg-transparent text-sm text-[#161311] outline-none placeholder:text-[#B3A69A]"
                  />


                  {search && (

                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                      className="text-[#8C7E72] hover:text-[#C5A880]"
                    >

                      <X
                        size={17}
                        strokeWidth={1.4}
                      />

                    </button>

                  )}


                  <button
                    type="button"
                    onClick={
                      closeSearch
                    }
                    aria-label="Close search"
                    className="text-[#8C7E72] hover:text-[#C5A880]"
                  >

                    <X
                      size={17}
                      strokeWidth={1.4}
                    />

                  </button>

                </form>


                {/* SEARCH RESULTS */}

                {search.trim() && (

                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#F2ECE1]">

                    {searchResults.length > 0 ? (

                      <div className="divide-y divide-[#E5DED3]">

                        {searchResults.map(
                          (product) => (

                            <button
                              key={
                                product.id
                              }
                              type="button"
                              onClick={() =>
                                handleProductClick(
                                  product.slug
                                )
                              }
                              className="flex w-full items-center gap-4 p-3 text-left transition-colors hover:bg-[#E8E0D2]"
                            >

                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                className="h-16 w-14 shrink-0 rounded-xl object-cover"
                              />


                              <div className="min-w-0 flex-1">

                                <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#9E9084]">
                                  {
                                    product.category
                                  }
                                </p>


                                <h3 className="mt-1 truncate font-serif text-[15px] text-[#161311]">
                                  {
                                    product.name
                                  }
                                </h3>


                                <div className="mt-1 flex items-center gap-2">

                                  <span className="text-[11px] font-medium text-[#161311]">
                                    ₹
                                    {Number(
                                      product.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>


                                  {product.originalPrice && (

                                    <span className="text-[9px] text-[#B3A69A] line-through">
                                      ₹
                                      {Number(
                                        product.originalPrice
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>

                                  )}

                                </div>

                              </div>


                              <span className="text-[#C5A880]">
                                →
                              </span>

                            </button>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="px-5 py-8 text-center">

                        <Search
                          size={22}
                          strokeWidth={1.2}
                          className="mx-auto text-[#B3A69A]"
                        />

                        <p className="mt-3 font-serif text-lg text-[#161311]">
                          No products found
                        </p>

                        <p className="mt-1 text-[10px] text-[#8C7E72]">
                          Try another product or category.
                        </p>

                      </div>

                    )}


                    {searchResults.length > 0 && (

                      <button
                        type="button"
                        onClick={
                          handleSearchSubmit
                        }
                        className="w-full border-t border-[#E5DED3] py-3 text-[8px] font-medium uppercase tracking-[0.16em] text-[#161311] transition-colors hover:bg-[#E8E0D2] hover:text-[#C5A880]"
                      >
                        View all search results →
                      </button>

                    )}

                  </div>

                )}

              </div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        <AnimatePresence>

          {menuOpen && (

            <motion.nav
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
              className="overflow-hidden border-t border-[#E5DED3] bg-[#FAF7F2] px-6 py-5 md:hidden"
            >

              {navItems.map(
                (item) => (

                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                    className="block border-b border-[#E5DED3] py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#38312B]"
                  >

                    {item.name}

                  </Link>

                )
              )}


              {/* MOBILE CATEGORIES */}

              <div className="border-b border-[#E5DED3]">

                <button
                  type="button"
                  onClick={() =>
                    setMobileCategoriesOpen(
                      !mobileCategoriesOpen
                    )
                  }
                  className="flex w-full items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#38312B]"
                >

                  Categories

                  <ChevronDown
                    size={14}
                    strokeWidth={1.4}
                    className={`transition-transform ${
                      mobileCategoriesOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                <AnimatePresence>

                  {mobileCategoriesOpen && (

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
                      className="overflow-hidden pb-3"
                    >

                      {categories.map(
                        (category) => (

                          <Link
                            key={
                              category.value
                            }
                            to={getCategoryLink(
                              category
                            )}
                            onClick={() =>
                              setMenuOpen(
                                false
                              )
                            }
                            className="flex items-center justify-between px-2 py-3 text-[9px] uppercase tracking-[0.1em] text-[#524942] hover:text-[#C5A880]"
                          >

                            {category.name}

                            <span>
                              →
                            </span>

                          </Link>

                        )
                      )}

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>


              {/* MOBILE SEARCH */}

              <button
                type="button"
                onClick={openSearch}
                className="flex w-full items-center gap-3 border-b border-[#E5DED3] py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#38312B]"
              >

                <Search
                  size={15}
                  strokeWidth={1.4}
                />

                Search

              </button>


              {/* ACCOUNT */}

              <div className="flex flex-wrap gap-x-6 gap-y-4 pt-6">

                {loggedIn ? (
                  <Link
                    to="/profile"
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                    className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#524942] hover:text-[#C5A880]"
                  >
                    <UserRound
                      size={15}
                      strokeWidth={1.4}
                    />
                    Profile
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                    className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#161311] hover:text-[#C5A880]"
                  >
                    <UserRound
                      size={15}
                      strokeWidth={1.4}
                    />
                    Login
                  </Link>
                )}


                <Link
                  to="/wishlist"
                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#524942] hover:text-[#C5A880]"
                >

                  <Heart
                    size={15}
                    strokeWidth={1.4}
                  />

                  Wishlist

                  {wishlistCount > 0 && (

                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#161311] border border-[#C5A880]/50 px-1 text-[7px] text-[#C5A880]">
                      {wishlistCount}
                    </span>

                  )}

                </Link>


                <Link
                  to="/cart"
                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#524942] hover:text-[#C5A880]"
                >

                  <ShoppingBag
                    size={15}
                    strokeWidth={1.4}
                  />

                  Cart

                  {cartCount > 0 && (

                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#161311] border border-[#C5A880]/50 px-1 text-[7px] text-[#C5A880]">
                      {cartCount}
                    </span>

                  )}

                </Link>

              </div>

            </motion.nav>

          )}

        </AnimatePresence>

      </header>

      {/* 
        IMPORTANT:
        Navbar is fixed, so this spacer reserves exactly
        the navbar's 80px height.
      */}

      <div className="h-20" />

    </>
  );
}


export default Navbar;