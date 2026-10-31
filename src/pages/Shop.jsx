import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  useSearchParams,
} from "react-router-dom";

import products from "../data/products";
import ProductCard from "../components/ProductCard";


const categories = [
  "All",
  "Serum",
  "Moisturiser",
  "Sunscreen",
  "Cleanser",
  "Essence",
  "Mask",
];


const concerns = [
  "All concerns",
  "Dull Skin",
  "Dry Skin",
  "Sun Protection",
  "Sensitive Skin",
  "Acne & Blemishes",
  "Uneven Skin Tone",
  "Anti-Aging",
];


function Shop() {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const urlCategory =
    searchParams.get("category") ||
    "All";


  const urlSearch =
    searchParams.get("search") ||
    "";


  const initialCategory =
    categories.includes(
      urlCategory
    )
      ? urlCategory
      : "All";


  const [category, setCategory] =
    useState(initialCategory);


  const [concern, setConcern] =
    useState("All concerns");


  const [search, setSearch] =
    useState(urlSearch);


  const [sort, setSort] =
    useState("featured");


  const [showFilters, setShowFilters] =
    useState(false);


  // ==========================================
  // SYNC URL WITH PAGE
  // ==========================================

  useEffect(() => {

    const currentCategory =
      searchParams.get(
        "category"
      ) || "All";


    const currentSearch =
      searchParams.get(
        "search"
      ) || "";


    if (
      categories.includes(
        currentCategory
      )
    ) {

      setCategory(
        currentCategory
      );

    } else {

      setCategory("All");

    }


    setSearch(
      currentSearch
    );

  }, [searchParams]);


  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (
    newCategory
  ) => {

    setCategory(
      newCategory
    );


    const params = {};


    if (
      newCategory !== "All"
    ) {

      params.category =
        newCategory;

    }


    if (
      search.trim()
    ) {

      params.search =
        search.trim();

    }


    setSearchParams(
      params
    );

  };


  // ==========================================
  // SEARCH CHANGE
  // ==========================================

  const handleSearchChange = (
    value
  ) => {

    setSearch(value);


    const params = {};


    if (
      category !== "All"
    ) {

      params.category =
        category;

    }


    if (
      value.trim()
    ) {

      params.search =
        value.trim();

    }


    setSearchParams(
      params
    );

  };


  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts =
    useMemo(() => {

      let result = [
        ...products,
      ];


      // CATEGORY

      if (
        category !== "All"
      ) {

        result =
          result.filter(
            (product) =>
              product.category ===
              category
          );

      }


      // CONCERN

      if (
        concern !==
        "All concerns"
      ) {

        result =
          result.filter(
            (product) =>
              product.concern ===
              concern
          );

      }


      // SEARCH

      if (
        search.trim()
      ) {

        const query =
          search
            .toLowerCase()
            .trim();


        result =
          result.filter(
            (product) => {

              const name =
                String(
                  product.name ||
                    ""
                ).toLowerCase();


              const productCategory =
                String(
                  product.category ||
                    ""
                ).toLowerCase();


              const productConcern =
                String(
                  product.concern ||
                    ""
                ).toLowerCase();


              const description =
                String(
                  product.description ||
                    ""
                ).toLowerCase();


              return (
                name.includes(
                  query
                ) ||
                productCategory.includes(
                  query
                ) ||
                productConcern.includes(
                  query
                ) ||
                description.includes(
                  query
                )
              );

            }
          );

      }


      // PRICE LOW

      if (
        sort ===
        "price-low"
      ) {

        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );

      }


      // PRICE HIGH

      if (
        sort ===
        "price-high"
      ) {

        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );

      }


      // RATING

      if (
        sort ===
        "rating"
      ) {

        result.sort(
          (a, b) =>
            Number(b.rating) -
            Number(a.rating)
        );

      }


      // FEATURED

      if (
        sort ===
        "featured"
      ) {

        result.sort(
          (a, b) => {

            if (
              a.featured ===
              b.featured
            ) {

              return 0;

            }


            return a.featured
              ? -1
              : 1;

          }
        );

      }


      return result;

    }, [
      category,
      concern,
      search,
      sort,
    ]);


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setCategory(
      "All"
    );

    setConcern(
      "All concerns"
    );

    setSearch("");

    setSort(
      "featured"
    );

    setSearchParams(
      {}
    );

  };


  const hasFilters =
    category !==
      "All" ||
    concern !==
      "All concerns" ||
    search.trim() !== "";


  return (
    <main className="min-h-screen bg-[#f8f6f1]">

      {/* ==========================================
          SHOP HERO
      ========================================== */}

      <section className="border-b border-[#ddd7ce]">

        <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-14 lg:px-10 lg:pb-20 lg:pt-20">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8a796c]">
              The Luv03 shop
            </p>


            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-[#3d3028] md:text-6xl">

              Skincare for your

              <br />

              everyday ritual.

            </h1>


            <p className="mt-5 max-w-lg text-xs leading-6 text-[#756960]">

              Thoughtfully selected essentials designed to make your
              skincare routine feel simple, comfortable and beautiful.

            </p>

          </motion.div>

        </div>

      </section>


      {/* ==========================================
          CONTROLS
      ========================================== */}

      <section className="sticky top-0 z-20 border-b border-[#ddd7ce] bg-[#f8f6f1]/95 backdrop-blur-md">

        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">

          <div className="flex min-h-[68px] items-center justify-between gap-4">

            {/* DESKTOP CATEGORIES */}

            <div className="hidden items-center gap-6 overflow-x-auto md:flex">

              {categories.map(
                (item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        item
                      )
                    }
                    className={`whitespace-nowrap border-b pb-1 text-[9px] font-medium uppercase tracking-[0.12em] transition ${
                      category === item
                        ? "border-[#3d3028] text-[#3d3028]"
                        : "border-transparent text-[#8a796c] hover:text-[#3d3028]"
                    }`}
                  >

                    {item}

                  </button>

                )
              )}

            </div>


            {/* MOBILE FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  true
                )
              }
              className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#51463f] md:hidden"
            >

              <SlidersHorizontal
                size={14}
                strokeWidth={1.4}
              />

              Filters

            </button>


            {/* RIGHT CONTROLS */}

            <div className="ml-auto flex items-center gap-3">

              {/* DESKTOP SEARCH */}

              <div className="relative hidden sm:block">

                <Search
                  size={14}
                  strokeWidth={1.4}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a796c]"
                />


                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(
                      event.target.value
                    )
                  }
                  placeholder="Search"
                  className="h-9 w-36 rounded-full border border-[#d8d0c7] bg-transparent pl-9 pr-3 text-[9px] text-[#3d3028] outline-none placeholder:text-[#9a897c] focus:border-[#8a796c]"
                />

              </div>


              {/* SORT */}

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="h-9 rounded-full border border-[#d8d0c7] bg-transparent px-3 text-[9px] text-[#51463f] outline-none"
              >

                <option value="featured">
                  Featured
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Top Rated
                </option>

              </select>

            </div>

          </div>


          {/* MOBILE SEARCH */}

          <div className="pb-4 sm:hidden">

            <div className="relative">

              <Search
                size={14}
                strokeWidth={1.4}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a796c]"
              />


              <input
                type="search"
                value={search}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value
                  )
                }
                placeholder="Search products"
                className="h-10 w-full rounded-full border border-[#d8d0c7] bg-transparent pl-9 pr-4 text-[9px] text-[#3d3028] outline-none placeholder:text-[#9a897c]"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          PRODUCT AREA
      ========================================== */}

      <section>

        <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-16">


          {/* RESULTS HEADER */}

          <div className="mb-8 flex items-center justify-between">

            <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a796c]">

              {filteredProducts.length}{" "}

              {filteredProducts.length ===
              1
                ? "product"
                : "products"}

            </p>


            {hasFilters && (

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-[9px] uppercase tracking-[0.12em] text-[#8a796c] underline underline-offset-4 transition hover:text-[#3d3028]"
              >

                Clear filters

              </button>

            )}

          </div>


          {/* PRODUCTS */}

          {filteredProducts.length >
          0 ? (

            <motion.div
              layout
              className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5"
            >

              {filteredProducts.map(
                (
                  product,
                  index
                ) => (

                  <motion.div
                    layout
                    key={product.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(
                        index *
                          0.04,
                        0.25
                      ),
                    }}
                  >

                    <ProductCard
                      product={
                        product
                      }
                    />

                  </motion.div>

                )
              )}

            </motion.div>

          ) : (

            /* EMPTY STATE */

            <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
                Nothing found
              </p>


              <h2 className="mt-3 font-serif text-3xl text-[#3d3028]">
                No products match your search.
              </h2>


              <p className="mt-3 max-w-sm text-[10px] leading-5 text-[#756960]">

                Try another search or
                remove some filters to
                explore the full Luv03
                collection.

              </p>


              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-6 rounded-full bg-[#3d3028] px-6 py-3 text-[8px] font-medium uppercase tracking-[0.14em] text-[#f8f6f1] transition hover:bg-[#584539]"
              >

                View all products

              </button>

            </div>

          )}

        </div>

      </section>


      {/* ==========================================
          MOBILE FILTER DRAWER
      ========================================== */}

      {showFilters && (

        <div className="fixed inset-0 z-50 md:hidden">

          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setShowFilters(
                false
              )
            }
            className="absolute inset-0 bg-black/30"
          />


          {/* DRAWER */}

          <motion.div
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              duration: 0.35,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[#f8f6f1] p-6"
          >

            <div className="flex items-center justify-between">

              <h2 className="font-serif text-2xl text-[#3d3028]">
                Filters
              </h2>


              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    false
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8d0c7]"
              >

                <X
                  size={14}
                  strokeWidth={1.4}
                />

              </button>

            </div>


            {/* CATEGORY */}

            <div className="mt-8">

              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#8a796c]">
                Category
              </p>


              <div className="mt-4 flex flex-wrap gap-2">

                {categories.map(
                  (item) => (

                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          item
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-[9px] transition ${
                        category === item
                          ? "border-[#3d3028] bg-[#3d3028] text-[#f8f6f1]"
                          : "border-[#d8d0c7] text-[#51463f]"
                      }`}
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* CONCERN */}

            <div className="mt-7">

              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#8a796c]">
                Skin concern
              </p>


              <div className="mt-4 flex flex-wrap gap-2">

                {concerns.map(
                  (item) => (

                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setConcern(
                          item
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-[9px] transition ${
                        concern === item
                          ? "border-[#3d3028] bg-[#3d3028] text-[#f8f6f1]"
                          : "border-[#d8d0c7] text-[#51463f]"
                      }`}
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* APPLY */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  false
                )
              }
              className="mt-8 w-full rounded-full bg-[#3d3028] py-4 text-[9px] font-medium uppercase tracking-[0.15em] text-[#f8f6f1]"
            >

              Show{" "}
              {filteredProducts.length}{" "}
              products

            </button>

          </motion.div>

        </div>

      )}

    </main>
  );
}


export default Shop;