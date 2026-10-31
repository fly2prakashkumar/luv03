import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "luv03-cart";
const WISHLIST_STORAGE_KEY = "luv03-wishlist";


export function CartProvider({ children }) {

  // =================================================
  // CART
  // =================================================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch (error) {
      console.error(
        "Could not load cart:",
        error
      );

      return [];
    }
  });


  // =================================================
  // WISHLIST
  // =================================================

  const [wishlistItems, setWishlistItems] =
    useState(() => {
      try {
        const savedWishlist =
          localStorage.getItem(
            WISHLIST_STORAGE_KEY
          );

        return savedWishlist
          ? JSON.parse(savedWishlist)
          : [];
      } catch (error) {
        console.error(
          "Could not load wishlist:",
          error
        );

        return [];
      }
    });


  // =================================================
  // SAVE CART
  // =================================================

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  // =================================================
  // SAVE WISHLIST
  // =================================================

  useEffect(() => {
    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);


  // =================================================
  // ADD TO CART
  // =================================================

  const addToCart = (
    product,
    quantity = 1
  ) => {
    setCartItems(
      (currentItems) => {

        const existingItem =
          currentItems.find(
            (item) =>
              item.id === product.id
          );


        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      quantity,
                  }
                : item
          );
        }


        return [
          ...currentItems,
          {
            ...product,
            quantity,
          },
        ];
      }
    );
  };


  // =================================================
  // REMOVE FROM CART
  // =================================================

  const removeFromCart = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== productId
        )
    );
  };


  // =================================================
  // INCREASE CART QUANTITY
  // =================================================

  const increaseQuantity = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        )
    );
  };


  // =================================================
  // DECREASE CART QUANTITY
  // =================================================

  const decreaseQuantity = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems
          .map(
            (item) =>
              item.id === productId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };


  // =================================================
  // CLEAR CART
  // =================================================

  const clearCart = () => {
    setCartItems([]);
  };


  // =================================================
  // ADD / REMOVE WISHLIST
  // =================================================

  const toggleWishlist = (
    product
  ) => {
    setWishlistItems(
      (currentItems) => {

        const alreadyWishlisted =
          currentItems.some(
            (item) =>
              item.id === product.id
          );


        if (alreadyWishlisted) {
          return currentItems.filter(
            (item) =>
              item.id !== product.id
          );
        }


        return [
          ...currentItems,
          product,
        ];
      }
    );
  };


  // =================================================
  // CHECK WISHLIST
  // =================================================

  const isWishlisted = (
    productId
  ) => {
    return wishlistItems.some(
      (item) =>
        item.id === productId
    );
  };


  // =================================================
  // REMOVE FROM WISHLIST
  // =================================================

  const removeFromWishlist = (
    productId
  ) => {
    setWishlistItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== productId
        )
    );
  };


  // =================================================
  // CLEAR WISHLIST
  // =================================================

  const clearWishlist = () => {
    setWishlistItems([]);
  };


  // =================================================
  // CART COUNT
  // =================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);


  // =================================================
  // CART TOTAL
  // =================================================

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    );
  }, [cartItems]);


  // =================================================
  // WISHLIST COUNT
  // =================================================

  const wishlistCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);


  // =================================================
  // CONTEXT VALUE
  // =================================================

  const value = {

    // Cart
    cartItems,
    cartCount,
    cartTotal,

    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,


    // Wishlist
    wishlistItems,
    wishlistCount,

    toggleWishlist,
    isWishlisted,
    removeFromWishlist,
    clearWishlist,
  };


  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}


// =================================================
// CUSTOM HOOK
// =================================================

export function useCart() {

  const context =
    useContext(CartContext);


  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }


  return context;
}