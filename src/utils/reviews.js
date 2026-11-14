// ============================================================
// CUSTOMER REVIEWS & TESTIMONIALS SYSTEM
// Connects Delivered customer orders with Homepage Testimonials
// ============================================================

export const DEFAULT_TESTIMONIALS = [
  {
    id: "seed-1",
    name: "Ananya R.",
    location: "Chennai",
    rating: 5,
    review:
      "The texture of the moisturiser is beautiful. My skin feels comfortable and hydrated without feeling heavy.",
    productName: "Daily Moisturiser",
    isVerifiedBuyer: true,
    date: "2026-10-15T10:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Meera S.",
    location: "Bengaluru",
    rating: 5,
    review:
      "I love how simple the routine feels now. The products are easy to use and my skin looks much more fresh and radiant.",
    productName: "Hydrating Face Serum",
    isVerifiedBuyer: true,
    date: "2026-10-22T14:30:00.000Z",
  },
  {
    id: "seed-3",
    name: "Nisha K.",
    location: "Mumbai",
    rating: 5,
    review:
      "The sunscreen has become my everyday essential. Lightweight, comfortable and perfect under makeup with zero white cast.",
    productName: "Glow Sunscreen SPF 50",
    isVerifiedBuyer: true,
    date: "2026-11-01T09:15:00.000Z",
  },
  {
    id: "seed-4",
    name: "Priya V.",
    location: "Hyderabad",
    rating: 5,
    review:
      "The gentle face cleanser is so soft on the skin barrier. Leaves my face thoroughly cleansed with zero dryness or tightness.",
    productName: "Gentle Face Cleanser",
    isVerifiedBuyer: true,
    date: "2026-11-04T12:00:00.000Z",
  },
  {
    id: "seed-5",
    name: "Kavita M.",
    location: "Delhi NCR",
    rating: 5,
    review:
      "Brightening Essence gave an instant luminous glass skin sheen. After two weeks my complexion looks visibly more even.",
    productName: "Brightening Essence",
    isVerifiedBuyer: true,
    date: "2026-11-06T15:45:00.000Z",
  },
  {
    id: "seed-6",
    name: "Roshni T.",
    location: "Pune",
    rating: 5,
    review:
      "Ordered via COD and got tracking updates through Blue Dart. Packaging was so luxurious and the serum absorbed immediately!",
    productName: "Hydrating Face Serum",
    isVerifiedBuyer: true,
    date: "2026-11-08T18:20:00.000Z",
  },
  {
    id: "seed-7",
    name: "Shweta P.",
    location: "Kolkata",
    rating: 5,
    review:
      "Clear Balance cleanser worked wonders for hormonal breakouts along my jawline within two weeks. Gentle yet deeply clarifying.",
    productName: "Clear Balance Salicylic Cleanser",
    isVerifiedBuyer: true,
    date: "2026-11-10T11:10:00.000Z",
  },
  {
    id: "seed-8",
    name: "Divya N.",
    location: "Kochi",
    rating: 5,
    review:
      "Dew Drop essence is pure magic under moisturizer. My makeup stays glowing and hydrated all day long without any patchiness.",
    productName: "Dew Drop Hyaluronic Essence",
    isVerifiedBuyer: true,
    date: "2026-11-11T16:05:00.000Z",
  },
  {
    id: "seed-9",
    name: "Aadhya J.",
    location: "Ahmedabad",
    rating: 5,
    review:
      "Luv03 has completely elevated my morning ritual. Premium aesthetics, clean formulation, and truly visible skincare results.",
    productName: "Daily Moisturiser",
    isVerifiedBuyer: true,
    date: "2026-11-12T08:30:00.000Z",
  },
];

// Load all testimonials (combines custom reviews with defaults)
export const getStoredTestimonials = () => {
  if (typeof window === "undefined") return DEFAULT_TESTIMONIALS;

  try {
    const raw = localStorage.getItem("luv03-testimonials");
    if (!raw) {
      localStorage.setItem(
        "luv03-testimonials",
        JSON.stringify(DEFAULT_TESTIMONIALS)
      );
      return DEFAULT_TESTIMONIALS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with default seeds so that older local caches also get the full list
      const existingIds = new Set(parsed.map((p) => p.id || p.name));
      const missingSeeds = DEFAULT_TESTIMONIALS.filter(
        (s) => !existingIds.has(s.id) && !existingIds.has(s.name)
      );
      if (missingSeeds.length > 0) {
        const combined = [...parsed, ...missingSeeds];
        try {
          localStorage.setItem("luv03-testimonials", JSON.stringify(combined));
        } catch (e) {}
        return combined;
      }
      return parsed;
    }
    return DEFAULT_TESTIMONIALS;
  } catch (err) {
    console.error("Could not load testimonials:", err);
    return DEFAULT_TESTIMONIALS;
  }
};

// Save a customer review from a delivered order
export const saveCustomerReview = ({
  orderId,
  productId,
  productName,
  customerName,
  location,
  rating = 5,
  reviewText,
}) => {
  if (typeof window === "undefined") return false;

  try {
    const currentList = getStoredTestimonials();

    const newReview = {
      id: `rev-${Date.now()}`,
      orderId,
      productId,
      productName: productName || "Luv03 Luxury Ritual",
      name: customerName || "Verified Customer",
      location: location || "India",
      rating: Number(rating) || 5,
      review: reviewText.trim(),
      isVerifiedBuyer: true,
      date: new Date().toISOString(),
    };

    // Prepend so latest customer review appears first
    const updated = [newReview, ...currentList];
    localStorage.setItem("luv03-testimonials", JSON.stringify(updated));

    // Also mark the order as reviewed in luv03-orders
    try {
      const orders = JSON.parse(localStorage.getItem("luv03-orders") || "[]");
      const orderIdx = orders.findIndex((o) => o.id === orderId);
      if (orderIdx !== -1) {
        orders[orderIdx].reviewed = true;
        orders[orderIdx].reviewRating = Number(rating) || 5;
        orders[orderIdx].reviewText = reviewText.trim();
        localStorage.setItem("luv03-orders", JSON.stringify(orders));
        window.dispatchEvent(new Event("luv03-orders-change"));
      }
    } catch (orderErr) {
      console.warn("Could not mark order reviewed:", orderErr);
    }

    // Broadcast change
    window.dispatchEvent(new Event("luv03-reviews-change"));
    return true;
  } catch (error) {
    console.error("Could not save review:", error);
    return false;
  }
};
