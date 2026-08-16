import ProductCard from "./ProductCard";
import products from "../data/products";

function FeaturedProducts() {
  // Get the first 4 products marked as featured
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  return (
    <section className="bg-[#f8f6f1]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10">

        {/* HEADING */}
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a796c]">
              Featured
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#3d3028] md:text-4xl">
              The everyday edit
            </h2>
          </div>

          {/* DESKTOP VIEW ALL */}
          <button
            type="button"
            className="hidden border-b border-[#65574e] pb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#51463f] transition-colors duration-300 hover:text-[#b56d43] sm:block"
          >
            View all products
          </button>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-5">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <button
          type="button"
          className="mx-auto mt-10 block border-b border-[#65574e] pb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#51463f] transition-colors duration-300 hover:text-[#b56d43] sm:hidden"
        >
          View all products
        </button>

      </div>
    </section>
  );
}

export default FeaturedProducts;