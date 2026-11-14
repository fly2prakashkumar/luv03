import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
  logoutUser,
  requireLogin,
} from "../utils/auth";

import { useCart } from "../context/CartContext";


function Profile() {

  const navigate =
    useNavigate();


  const user =
    getCurrentUser();


  const {
    cartItems,
    wishlist,
  } = useCart();


  // ==========================================================
  // LOGIN CHECK
  // ==========================================================

  if (!user) {

    requireLogin(navigate);

    return null;

  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    logoutUser();

    navigate("/login");

  };


  return (

    <main className="min-h-screen bg-transparent px-5 py-10 sm:px-8 lg:px-10 lg:py-16">

      <div className="mx-auto max-w-5xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="rounded-[28px] border border-white/80 bg-white/70 p-7 shadow-[0_16px_40px_rgba(109,0,25,0.06)] backdrop-blur-xl sm:p-10">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">


            {/* PROFILE ICON */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#161311] text-[#FAF7F2]">

              <User
                size={30}
                strokeWidth={1.2}
              />

            </div>


            {/* USER DETAILS */}

            <div className="min-w-0">

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#9E9084]">
                My account
              </p>


              <h1 className="mt-2 truncate font-serif text-3xl text-[#161311] sm:text-4xl">
                {user.name}
              </h1>


              <p className="mt-2 break-all text-xs text-[#524942]">
                {user.email}
              </p>


              {user.role === "admin" && (

                <span className="mt-3 inline-flex rounded-full bg-[#161311] px-3 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-[#FAF7F2]">
                  Administrator
                </span>

              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            ACCOUNT OPTIONS
        ================================================== */}

        <section className="mt-8">


          {/* ==================================================
              MY ORDERS
          ================================================== */}

          <Link
            to="/orders"
            className="group flex items-center justify-between border-b border-[#E5DED3] py-6"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2ECE1] text-[#161311]">

                <ShoppingBag
                  size={18}
                  strokeWidth={1.3}
                />

              </div>


              <div>

                <h2 className="font-serif text-lg text-[#161311]">
                  My Orders
                </h2>


                <p className="mt-1 text-[9px] text-[#8C7E72]">
                  View your order history
                </p>

              </div>

            </div>


            <ChevronRight
              size={17}
              strokeWidth={1.2}
              className="text-[#9E9084] transition group-hover:translate-x-1 group-hover:text-[#161311]"
            />

          </Link>


          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Link
            to="/wishlist"
            className="group flex items-center justify-between border-b border-[#E5DED3] py-6"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2ECE1] text-[#161311]">

                <Heart
                  size={18}
                  strokeWidth={1.3}
                />

              </div>


              <div>

                <div className="flex items-center gap-2">

                  <h2 className="font-serif text-lg text-[#161311]">
                    Wishlist
                  </h2>


                  {wishlist?.length > 0 && (

                    <span className="rounded-full bg-[#161311] px-2 py-0.5 text-[7px] text-white">
                      {wishlist.length}
                    </span>

                  )}

                </div>


                <p className="mt-1 text-[9px] text-[#8C7E72]">
                  Products you've saved
                </p>

              </div>

            </div>


            <ChevronRight
              size={17}
              strokeWidth={1.2}
              className="text-[#9E9084] transition group-hover:translate-x-1 group-hover:text-[#161311]"
            />

          </Link>


          {/* ==================================================
              SHOPPING BAG
          ================================================== */}

          <Link
            to="/cart"
            className="group flex items-center justify-between border-b border-[#E5DED3] py-6"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2ECE1] text-[#161311]">

                <ShoppingBag
                  size={18}
                  strokeWidth={1.3}
                />

              </div>


              <div>

                <div className="flex items-center gap-2">

                  <h2 className="font-serif text-lg text-[#161311]">
                    Shopping Bag
                  </h2>


                  {cartItems?.length > 0 && (

                    <span className="rounded-full bg-[#161311] px-2 py-0.5 text-[7px] text-white">
                      {cartItems.length}
                    </span>

                  )}

                </div>


                <p className="mt-1 text-[9px] text-[#8C7E72]">
                  View products in your bag
                </p>

              </div>

            </div>


            <ChevronRight
              size={17}
              strokeWidth={1.2}
              className="text-[#9E9084] transition group-hover:translate-x-1 group-hover:text-[#161311]"
            />

          </Link>


          {/* ==================================================
              ADMIN
          ================================================== */}

          {user.role === "admin" && (

            <Link
              to="/admin"
              className="group flex items-center justify-between border-b border-[#E5DED3] py-6"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#161311] text-[#FAF7F2]">

                  <User
                    size={18}
                    strokeWidth={1.3}
                  />

                </div>


                <div>

                  <h2 className="font-serif text-lg text-[#161311]">
                    Admin Dashboard
                  </h2>


                  <p className="mt-1 text-[9px] text-[#8C7E72]">
                    Manage your Luv03 store
                  </p>

                </div>

              </div>


              <ChevronRight
                size={17}
                strokeWidth={1.2}
                className="text-[#9E9084] transition group-hover:translate-x-1 group-hover:text-[#161311]"
              />

            </Link>

          )}

        </section>


        {/* ==================================================
            LOGOUT
        ================================================== */}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-10 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#9E9084] text-[9px] font-medium uppercase tracking-[0.16em] text-[#161311] transition hover:bg-[#161311] hover:text-[#FAF7F2]"
        >

          <LogOut
            size={14}
            strokeWidth={1.3}
          />

          Logout

        </button>


      </div>

    </main>

  );

}


export default Profile;