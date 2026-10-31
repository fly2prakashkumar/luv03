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

  };


  const closeSearch = () => {

    setSearchOpen(false);

    setSearch("");

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
            ? "bg-[#f8f6f1]/95 shadow-sm backdrop-blur-md"
            : "bg-[#f8f6f1]"
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
              className="relative z-10 font-serif text-2xl tracking-tight text-[#3d3028]"
            >

              Luv
              <span className="text-[#b56d43]">
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
                            ? "text-[#b56d43]"
                            : "text-[#51463f] group-hover:text-[#b56d43]"
                        }`}
                      >
                        {item.name}
                      </span>


                      <span
                        className={`absolute -bottom-2 left-0 h-px bg-[#b56d43] transition-all duration-300 ${
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
                className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#51463f] transition-colors hover:text-[#b56d43]"
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
                    className="absolute left-1/2 top-full mt-4 w-52 -translate-x-1/2 rounded-2xl border border-[#ddd7ce] bg-[#f8f6f1] p-2 shadow-lg"
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
                          className="flex items-center justify-between rounded-xl px-3 py-3 text-[9px] uppercase tracking-[0.1em] text-[#756960] transition-colors hover:bg-[#eee9df] hover:text-[#b56d43]"
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

          <div className="flex items-center gap-4 text-[#40352f]">


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
              className="transition-colors hover:text-[#b56d43]"
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
                  className="transition-colors hover:text-[#b56d43]"
                />


                {wishlistCount > 0 && (

                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b56d43] px-1 text-[7px] text-white">

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
                  className="transition-colors hover:text-[#b56d43]"
                />


                {cartCount > 0 && (

                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b56d43] px-1 text-[7px] text-white">

                    {cartCount}

                  </span>

                )}

              </motion.div>

            </Link>


            {/* PROFILE */}

            <Link
              to="/profile"
              aria-label="Profile"
            >

              <motion.div
                whileHover={{
                  scale: 1.12,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="hidden sm:block"
              >

                <UserRound
                  size={16}
                  strokeWidth={1.5}
                  className="transition-colors hover:text-[#b56d43]"
                />

              </motion.div>

            </Link>


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
              className="border-t border-[#ddd7ce] bg-[#f8f6f1]"
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
                    className="shrink-0 text-[#8a796c]"
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
                    className="h-11 flex-1 bg-transparent text-sm text-[#3d3028] outline-none placeholder:text-[#aaa098]"
                  />


                  {search && (

                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                      className="text-[#8a796c] hover:text-[#b56d43]"
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
                    className="text-[#8a796c] hover:text-[#b56d43]"
                  >

                    <X
                      size={17}
                      strokeWidth={1.4}
                    />

                  </button>

                </form>


                {/* SEARCH RESULTS */}

                {search.trim() && (

                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#ddd7ce] bg-[#eee9df]">

                    {searchResults.length > 0 ? (

                      <div className="divide-y divide-[#d8d0c6]">

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
                              className="flex w-full items-center gap-4 p-3 text-left transition-colors hover:bg-[#e5ded4]"
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

                                <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#9a897c]">
                                  {
                                    product.category
                                  }
                                </p>


                                <h3 className="mt-1 truncate font-serif text-[15px] text-[#3d3028]">
                                  {
                                    product.name
                                  }
                                </h3>


                                <div className="mt-1 flex items-center gap-2">

                                  <span className="text-[11px] font-medium text-[#3d3028]">
                                    ₹
                                    {Number(
                                      product.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>


                                  {product.originalPrice && (

                                    <span className="text-[9px] text-[#aaa098] line-through">
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


                              <span className="text-[#b56d43]">
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
                          className="mx-auto text-[#aaa098]"
                        />

                        <p className="mt-3 font-serif text-lg text-[#3d3028]">
                          No products found
                        </p>

                        <p className="mt-1 text-[10px] text-[#8a796c]">
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
                        className="w-full border-t border-[#d8d0c6] py-3 text-[8px] font-medium uppercase tracking-[0.16em] text-[#584539] transition-colors hover:bg-[#ddd5ca] hover:text-[#b56d43]"
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
              className="overflow-hidden border-t border-[#ddd7ce] bg-[#f8f6f1] px-6 py-5 md:hidden"
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
                    className="block border-b border-[#ddd7ce] py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#51463f]"
                  >

                    {item.name}

                  </Link>

                )
              )}


              {/* MOBILE CATEGORIES */}

              <div className="border-b border-[#ddd7ce]">

                <button
                  type="button"
                  onClick={() =>
                    setMobileCategoriesOpen(
                      !mobileCategoriesOpen
                    )
                  }
                  className="flex w-full items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#51463f]"
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
                            className="flex items-center justify-between px-2 py-3 text-[9px] uppercase tracking-[0.1em] text-[#756960] hover:text-[#b56d43]"
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
                className="flex w-full items-center gap-3 border-b border-[#ddd7ce] py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#51463f]"
              >

                <Search
                  size={15}
                  strokeWidth={1.4}
                />

                Search

              </button>


              {/* ACCOUNT */}

              <div className="flex flex-wrap gap-x-6 gap-y-4 pt-6">

                <Link
                  to="/login"
                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#756960] hover:text-[#b56d43]"
                >

                  <UserRound
                    size={15}
                    strokeWidth={1.4}
                  />

                  Account

                </Link>


                <Link
                  to="/wishlist"
                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#756960] hover:text-[#b56d43]"
                >

                  <Heart
                    size={15}
                    strokeWidth={1.4}
                  />

                  Wishlist

                  {wishlistCount > 0 && (

                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b56d43] px-1 text-[7px] text-white">
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
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#756960] hover:text-[#b56d43]"
                >

                  <ShoppingBag
                    size={15}
                    strokeWidth={1.4}
                  />

                  Cart

                  {cartCount > 0 && (

                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b56d43] px-1 text-[7px] text-white">
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