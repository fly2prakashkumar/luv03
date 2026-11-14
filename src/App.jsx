import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";


function App() {

  const location = useLocation();

  // ==========================================================
  // HIDE CUSTOMER NAVBAR ON ADMIN PAGE
  // ==========================================================

  const isAdminPage =
    location.pathname.startsWith("/admin");


  return (

    <div className="relative min-h-screen text-[#161311]">

      {/* ======================================================
          FULLY FIXED & FULLY FITTED SITE-WIDE LUXURY BACKGROUND
      ====================================================== */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-[#FAF7F2]" 
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}
      >
        {/* Atmospheric blurred backdrop: gracefully extends the lilac & violet aesthetic to every screen ratio */}
        <img
          src="/site-bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-60 scale-110"
        />

        {/* The Full Image - 100% fitted, completely uncropped */}
        <img
          src="/site-bg.png"
          alt="Luv03 Luxury Brand Background"
          className="relative z-10 h-full w-full object-contain object-center scale-[1.14] md:scale-[1.16] transform-gpu origin-center will-change-transform transition-transform duration-500 drop-shadow-[0_15px_35px_rgba(62,46,82,0.2)]"
        />

        {/* Luminous frosted glass veil: balanced to give all headings, body text, and UI crystal-clear contrast while keeping the lilac silk & bottles radiant */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/60 via-white/45 to-white/60 backdrop-blur-[2.5px]" />

        {/* Subtle specular sheen overlay */}
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-70" />
      </div>

      <div className="relative z-10">

      {/* ======================================================
          CUSTOMER NAVBAR
          
          Navbar will appear on all customer pages.
          Navbar will NOT appear on /admin.
      ====================================================== */}

      {!isAdminPage && (
        <Navbar />
      )}


      <Routes>

        {/* ==================================================
            HOME
        ================================================== */}

        <Route
          path="/"
          element={
            <Home />
          }
        />


        {/* ==================================================
            SHOP
        ================================================== */}

        <Route
          path="/shop"
          element={
            <Shop />
          }
        />


        {/* ==================================================
            PRODUCT DETAILS
        ================================================== */}

        <Route
          path="/product/:slug"
          element={
            <ProductDetails />
          }
        />


        {/* ==================================================
            CART
        ================================================== */}

        <Route
          path="/cart"
          element={
            <Cart />
          }
        />


        {/* ==================================================
            CHECKOUT
        ================================================== */}

        <Route
          path="/checkout"
          element={
            <Checkout />
          }
        />


        {/* ==================================================
            ORDER SUCCESS
        ================================================== */}

        <Route
          path="/order-success"
          element={
            <OrderSuccess />
          }
        />


        {/* ==================================================
            WISHLIST
        ================================================== */}

        <Route
          path="/wishlist"
          element={
            <Wishlist />
          }
        />


        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* ==================================================
            PROFILE
        ================================================== */}

        <Route
          path="/profile"
          element={
            <Profile />
          }
        />


        {/* ==================================================
            ORDERS
        ================================================== */}

        <Route
          path="/orders"
          element={
            <Orders />
          }
        />


        {/* ==================================================
            ADMIN
        ================================================== */}

        <Route
          path="/admin"
          element={
            <Admin />
          }
        />


        {/* ==================================================
            ABOUT
        ================================================== */}

        <Route
          path="/about"
          element={
            <About />
          }
        />


        {/* ==================================================
            CONTACT
        ================================================== */}

        <Route
          path="/contact"
          element={
            <Contact />
          }
        />

      </Routes>
      </div>

    </div>

  );

}


export default App;