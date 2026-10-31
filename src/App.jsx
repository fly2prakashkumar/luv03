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

    <div className="min-h-screen bg-[#f8f6f1]">

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

  );

}


export default App;