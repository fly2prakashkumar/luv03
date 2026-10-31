import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Grid2X2,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Truck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import products from "../data/products";

import {
  getCurrentUser,
  logoutUser,
  requireAdmin,
} from "../utils/auth";


// ============================================================
// ADMIN DASHBOARD
// ============================================================

function Admin() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [detailView, setDetailView] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState("");


  // ==========================================================
  // ADMIN AUTHENTICATION
  // ==========================================================

  useEffect(() => {
    requireAdmin(navigate);
  }, [navigate]);


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {

    const savedOrders =
      JSON.parse(
        localStorage.getItem(
          "luv03-orders"
        ) || "[]"
      );


    const savedCustomers =
      JSON.parse(
        localStorage.getItem(
          "luv03-users"
        ) || "[]"
      );


    setOrders(savedOrders);

    setCustomers(
      savedCustomers.filter(
        (user) =>
          user.role !== "admin"
      )
    );

  }, []);


  // ==========================================================
  // CURRENT ADMIN
  // ==========================================================

  const admin =
    getCurrentUser();


  // ==========================================================
  // REVENUE
  // ==========================================================

  const totalRevenue =
    useMemo(() => {

      return orders.reduce(
        (total, order) => {

          const amount =
            Number(
              order.total ||
              order.grandTotal ||
              order.amount ||
              0
            );

          return total + amount;

        },
        0
      );

    }, [orders]);


  // ==========================================================
  // ORDER COUNTS
  // ==========================================================

  const orderStats = useMemo(() => {

    return {

      orders:
        orders.filter(
          (order) =>
            !order.status ||
            order.status ===
              "Orders"
        ).length,

      packed:
        orders.filter(
          (order) =>
            order.status ===
              "Packed"
        ).length,

      shipped:
        orders.filter(
          (order) =>
            order.status ===
              "Package Shipped"
        ).length,

      delivery:
        orders.filter(
          (order) =>
            order.status ===
              "Out for Delivery"
        ).length,

      delivered:
        orders.filter(
          (order) =>
            order.status ===
              "Delivered"
        ).length,

    };

  }, [orders]);


  // ==========================================================
  // TOTAL PRODUCTS
  // ==========================================================

  const totalProducts =
    products.length;


  // ==========================================================
  // WISHLIST COUNT
  // ==========================================================

  const wishlistCount =
    useMemo(() => {

      let count = 0;

      customers.forEach(
        (customer) => {

          if (
            Array.isArray(
              customer.wishlist
            )
          ) {
            count +=
              customer.wishlist.length;
          }

        }
      );

      return count;

    }, [customers]);


  // ==========================================================
  // AVERAGE ORDER VALUE
  // ==========================================================

  const averageOrder =
    orders.length > 0
      ? totalRevenue /
        orders.length
      : 0;


  // ==========================================================
  // FORMAT PRICE
  // ==========================================================

  const formatPrice =
    (value) => {

      return `₹${Number(
        value || 0
      ).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 0,
        }
      )}`;

    };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate =
    (value) => {

      if (!value) {
        return "-";
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "-";
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  // ==========================================================
  // GET ORDER TOTAL
  // ==========================================================

  const getOrderTotal =
    (order) => {

      return Number(
        order.total ||
        order.grandTotal ||
        order.amount ||
        0
      );

    };


  // ==========================================================
  // GET CUSTOMER NAME
  // ==========================================================

  const getCustomerName =
    (order) => {

      return (
        order.customer?.name ||
        order.customerName ||
        order.name ||
        order.user?.name ||
        "Customer"
      );

    };


  // ==========================================================
  // GET CUSTOMER EMAIL
  // ==========================================================

  const getCustomerEmail =
    (order) => {

      return (
        order.customer?.email ||
        order.customerEmail ||
        order.email ||
        order.user?.email ||
        "-"
      );

    };


  // ==========================================================
  // ORDER STATUS
  // ==========================================================

  const getOrderStatus =
    (order) => {

      return (
        order.status ||
        "Orders"
      );

    };


  // ==========================================================
  // RECENT ORDERS
  // ==========================================================

  const recentOrders =
    [...orders]
      .reverse()
      .slice(0, 6);


  // ==========================================================
  // SEARCH ORDERS
  // ==========================================================

  const filteredOrders =
    orders.filter(
      (order) => {

        if (!searchQuery.trim()) {
          return true;
        }

        const query =
          searchQuery
            .toLowerCase();

        const orderId =
          String(
            order.orderId ||
            order.id ||
            ""
          ).toLowerCase();

        const customer =
          getCustomerName(
            order
          ).toLowerCase();

        const email =
          getCustomerEmail(
            order
          ).toLowerCase();

        return (
          orderId.includes(
            query
          ) ||
          customer.includes(
            query
          ) ||
          email.includes(
            query
          )
        );

      }
    );


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout =
    () => {

      logoutUser();

      navigate(
        "/login"
      );

    };


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleNavigation =
    (page) => {

      setActivePage(
        page
      );

      setDetailView(
        null
      );

      setMobileMenuOpen(
        false
      );

    };


  // ==========================================================
  // DASHBOARD CARDS
  // ==========================================================

  const dashboardCards = [

    {
      id: "revenue",
      title: "Total Revenue",
      value:
        formatPrice(
          totalRevenue
        ),
      icon:
        CircleDollarSign,
      subtitle:
        "All-time sales",
      change:
        "+10.4%",
    },

    {
      id: "orders",
      title: "Total Orders",
      value:
        orders.length,
      icon:
        ClipboardList,
      subtitle:
        "Customer orders",
      change:
        "+14.4%",
    },

    {
      id: "customers",
      title: "Customers",
      value:
        customers.length,
      icon:
        Users,
      subtitle:
        "Registered users",
      change:
        "Active",
    },

    {
      id: "products",
      title: "Products",
      value:
        totalProducts,
      icon:
        ShoppingBag,
      subtitle:
        "Store products",
      change:
        "Live",
    },

  ];


  // ==========================================================
  // MENU ITEMS
  // ==========================================================

  const menuItems = [

    {
      label:
        "Dashboard",
      icon:
        LayoutDashboard,
    },

    {
      label:
        "Order Management",
      icon:
        ClipboardList,
    },

    {
      label:
        "Customers",
      icon:
        Users,
    },

    {
      label:
        "Products",
      icon:
        ShoppingBag,
    },

    {
      label:
        "Categories",
      icon:
        Grid2X2,
    },

    {
      label:
        "Reviews",
      icon:
        Star,
    },

    {
      label:
        "Wishlist",
      icon:
        Heart,
    },

    {
      label:
        "Settings",
      icon:
        Settings,
    },

  ];



  // ==========================================================
  // DASHBOARD
  // ==========================================================

  const renderDashboard =
    () => {

      return (
        <>

          {/* ==================================================
              OVERVIEW CARDS
          ================================================== */}

          <section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {dashboardCards.map(
                (card) => {

                  const Icon =
                    card.icon;

                  return (
                    <div
                      key={
                        card.id
                      }
                      className="h-full"
                    >

                      <div className="h-full rounded-2xl border border-[#e3dfd8] bg-white p-5 shadow-[0_2px_10px_rgba(61,48,40,0.025)]">

                        <div className="flex items-start justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4efe8] text-[#584539]">

                            <Icon
                              size={
                                19
                              }
                              strokeWidth={
                                1.5
                              }
                            />

                          </div>

                        </div>


                        <p className="mt-5 text-xs font-medium text-[#756960]">
                          {card.title}
                        </p>


                        <div className="mt-2 flex items-end justify-between gap-3">

                          <p className="font-serif text-3xl text-[#183d40]">

                            {
                              card.value
                            }

                          </p>


                          <span className="mb-1 rounded-full bg-[#eaf5ed] px-2 py-1 text-[8px] font-medium text-[#4c9b69]">

                            {
                              card.change
                            }

                          </span>

                        </div>


                        <p className="mt-2 text-[10px] text-[#aaa098]">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                  );

                }
              )}

            </div>

          </section>


          {/* ==================================================
              CHART + ORDER STATUS
          ================================================== */}

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">


            {/* =================================================
                SALES CHART
            ================================================= */}

            <div className="rounded-2xl border border-[#e3dfd8] bg-white p-5 sm:p-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <p className="text-xs text-[#756960]">
                    Revenue overview
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#183d40]">
                    Sales this week
                  </h2>

                </div>


                <div className="flex items-center gap-1 rounded-lg bg-[#f5f2ed] p-1">

                  <span className="rounded-md bg-white px-3 py-1.5 text-[9px] font-medium text-[#584539] shadow-sm">
                    This week
                  </span>

                  <span className="rounded-md px-3 py-1.5 text-[9px] text-[#9a897c]">
                    Last week
                  </span>

                </div>

              </div>


              <div className="mt-6 flex items-end justify-between">

                <div>

                  <p className="font-serif text-3xl text-[#183d40]">
                    {
                      formatPrice(
                        totalRevenue
                      )
                    }
                  </p>

                  <p className="mt-1 text-[10px] text-[#4c9b69]">
                    ↑ 10.4% from previous period
                  </p>

                </div>

              </div>


              {/* CHART */}

              <div className="mt-8">

                <RevenueChart
                  orders={
                    orders
                  }
                  totalRevenue={
                    totalRevenue
                  }
                />

              </div>

            </div>


            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <div className="rounded-2xl border border-[#e3dfd8] bg-white p-5 sm:p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs text-[#756960]">
                    Order pipeline
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#183d40]">
                    Order Status
                  </h2>

                </div>

                <Package
                  size={
                    20
                  }
                  strokeWidth={
                    1.4
                  }
                  className="text-[#b56d43]"
                />

              </div>


              <div className="mt-6 space-y-3">

                <StatusLine
                  title="Orders"
                  value={
                    orderStats.orders
                  }
                  icon={
                    ClipboardList
                  }
                />

                <StatusLine
                  title="Packed"
                  value={
                    orderStats.packed
                  }
                  icon={
                    Package
                  }
                />

                <StatusLine
                  title="Package Shipped"
                  value={
                    orderStats.shipped
                  }
                  icon={
                    Truck
                  }
                />

                <StatusLine
                  title="Out for Delivery"
                  value={
                    orderStats.delivery
                  }
                  icon={
                    Truck
                  }
                />

                <StatusLine
                  title="Delivered"
                  value={
                    orderStats.delivered
                  }
                  icon={
                    Activity
                  }
                />

              </div>

            </div>

          </section>


          {/* ==================================================
              TRANSACTIONS + TOP PRODUCTS
          ================================================== */}

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">


            {/* =================================================
                TRANSACTIONS
            ================================================= */}

            <div className="rounded-2xl border border-[#e3dfd8] bg-white">

              <div className="flex flex-col gap-3 border-b border-[#eee9df] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs text-[#756960]">
                    Latest activity
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#183d40]">
                    Transactions
                  </h2>

                </div>


                <span className="rounded-lg border border-[#d9d1c8] px-4 py-2 text-[9px] font-medium uppercase tracking-[0.1em] text-[#9a897c]">
                  Overview
                </span>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px]">

                  <thead>

                    <tr className="border-b border-[#eee9df] bg-[#faf9f7]">

                      <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.08em] text-[#9a897c]">
                        Order
                      </th>

                      <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.08em] text-[#9a897c]">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.08em] text-[#9a897c]">
                        Date
                      </th>

                      <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.08em] text-[#9a897c]">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-[9px] font-medium uppercase tracking-[0.08em] text-[#9a897c]">
                        Amount
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recentOrders.length ===
                    0 ? (

                      <tr>

                        <td
                          colSpan={
                            5
                          }
                          className="px-5 py-12 text-center"
                        >

                          <ShoppingBag
                            size={
                              25
                            }
                            strokeWidth={
                              1.2
                            }
                            className="mx-auto text-[#aaa098]"
                          />

                          <p className="mt-3 text-sm text-[#756960]">
                            No transactions yet.
                          </p>

                        </td>

                      </tr>

                    ) : (

                      recentOrders.map(
                        (
                          order,
                          index
                        ) => (

                          <TransactionRow
                            key={
                              order.id ||
                              order.orderId ||
                              index
                            }
                            order={
                              order
                            }
                            formatDate={
                              formatDate
                            }
                            formatPrice={
                              formatPrice
                            }
                            getCustomerName={
                              getCustomerName
                            }
                            getOrderStatus={
                              getOrderStatus
                            }
                            getOrderTotal={
                              getOrderTotal
                            }
                            onClick={() =>
                              setDetailView(
                                "order-" +
                                  (
                                    order.id ||
                                    order.orderId ||
                                    index
                                  )
                              )
                            }
                          />

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                TOP PRODUCTS
            ================================================= */}

            <div className="rounded-2xl border border-[#e3dfd8] bg-white">

              <div className="flex items-center justify-between border-b border-[#eee9df] p-5">

                <div>

                  <p className="text-xs text-[#756960]">
                    Store performance
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#183d40]">
                    Top Products
                  </h2>

                </div>

                <ShoppingBag
                  size={
                    19
                  }
                  strokeWidth={
                    1.4
                  }
                  className="text-[#b56d43]"
                />

              </div>


              <div className="p-4">

                {products
                  .slice(
                    0,
                    5
                  )
                  .map(
                    (
                      product,
                      index
                    ) => (

                      <div
                        key={
                          product.id
                        }
                        className="flex items-center gap-3 border-b border-[#eee9df] px-1 py-4 last:border-b-0"
                      >

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="h-11 w-11 rounded-lg object-cover"
                        />


                        <div className="min-w-0 flex-1">

                          <p className="truncate text-xs font-medium text-[#3d3028]">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 text-[9px] text-[#9a897c]">
                            {
                              product.category
                            }
                          </p>

                        </div>


                        <p className="shrink-0 text-xs font-medium text-[#183d40]">
                          {
                            formatPrice(
                              product.price
                            )
                          }
                        </p>

                      </div>

                    )
                  )}

              </div>

            </div>

          </section>


          {/* ==================================================
              BEST SELLING + STORE SUMMARY
          ================================================== */}

          <section className="mt-5 grid gap-5 lg:grid-cols-2">


            {/* BEST SELLING */}

            <div className="rounded-2xl border border-[#e3dfd8] bg-white p-5 sm:p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs text-[#756960]">
                    Product performance
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#183d40]">
                    Best Selling Products
                  </h2>

                </div>


                <BarChart3
                  size={
                    20
                  }
                  strokeWidth={
                    1.4
                  }
                  className="text-[#b56d43]"
                />

              </div>


              <div className="mt-5 overflow-x-auto">

                <table className="w-full min-w-[500px]">

                  <thead>

                    <tr className="rounded-lg bg-[#edf7e9]">

                      <th className="px-3 py-3 text-left text-[8px] uppercase tracking-[0.1em] text-[#66805d]">
                        Product
                      </th>

                      <th className="px-3 py-3 text-left text-[8px] uppercase tracking-[0.1em] text-[#66805d]">
                        Reviews
                      </th>

                      <th className="px-3 py-3 text-left text-[8px] uppercase tracking-[0.1em] text-[#66805d]">
                        Rating
                      </th>

                      <th className="px-3 py-3 text-right text-[8px] uppercase tracking-[0.1em] text-[#66805d]">
                        Price
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {products
                      .slice(
                        0,
                        5
                      )
                      .map(
                        (
                          product
                        ) => (

                          <tr
                            key={
                              product.id
                            }
                            className="border-b border-[#eee9df] last:border-b-0"
                          >

                            <td className="px-3 py-3">

                              <div className="flex items-center gap-3">

                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-8 w-8 rounded-md object-cover"
                                />

                                <span className="text-xs font-medium text-[#3d3028]">
                                  {
                                    product.name
                                  }
                                </span>

                              </div>

                            </td>


                            <td className="px-3 py-3 text-xs text-[#756960]">
                              {
                                product.reviews
                              }
                            </td>


                            <td className="px-3 py-3 text-xs text-[#756960]">
                              ★{" "}
                              {
                                product.rating
                              }
                            </td>


                            <td className="px-3 py-3 text-right text-xs font-medium text-[#183d40]">
                              {
                                formatPrice(
                                  product.price
                                )
                              }
                            </td>

                          </tr>

                        )
                      )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* QUICK SUMMARY */}

            <div className="rounded-2xl border border-[#e3dfd8] bg-white p-5 sm:p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs text-[#756960]">
                    Store health
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#183d40]">
                    Quick Summary
                  </h2>

                </div>


                <Activity
                  size={
                    20
                  }
                  strokeWidth={
                    1.4
                  }
                  className="text-[#b56d43]"
                />

              </div>


              <div className="mt-5 grid grid-cols-2 gap-3">

                <MiniStat
                  title="Revenue"
                  value={
                    formatPrice(
                      totalRevenue
                    )
                  }
                />

                <MiniStat
                  title="Orders"
                  value={
                    orders.length
                  }
                />

                <MiniStat
                  title="Customers"
                  value={
                    customers.length
                  }
                />

                <MiniStat
                  title="Wishlist"
                  value={
                    wishlistCount
                  }
                />

              </div>


              <div className="mt-5 rounded-xl bg-[#f7f4ef] p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Average Order Value
                    </p>

                    <p className="mt-1 font-serif text-xl text-[#183d40]">
                      {
                        formatPrice(
                          averageOrder
                        )
                      }
                    </p>

                  </div>


                  <CircleDollarSign
                    size={
                      22
                    }
                    strokeWidth={
                      1.3
                    }
                    className="text-[#b56d43]"
                  />

                </div>

              </div>

            </div>

          </section>

        </>
      );

    };


  // ==========================================================
  // ORDER MANAGEMENT PAGE
  // ==========================================================

  const renderOrderManagement =
    () => {

      return (
        <AdminSectionPage
          title="Order Management"
          subtitle="Manage customer orders and delivery progress."
          icon={
            ClipboardList
          }
        >

          <div className="overflow-hidden rounded-2xl border border-[#e3dfd8] bg-white">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>

                  <tr className="border-b border-[#eee9df] bg-[#faf9f7]">

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-right text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
                      Details
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredOrders.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={
                          6
                        }
                        className="px-5 py-16 text-center"
                      >

                        <ClipboardList
                          size={
                            28
                          }
                          strokeWidth={
                            1.2
                          }
                          className="mx-auto text-[#aaa098]"
                        />

                        <p className="mt-3 text-sm text-[#756960]">
                          No orders found.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    [...filteredOrders]
                      .reverse()
                      .map(
                        (
                          order,
                          index
                        ) => (

                          <TransactionRow
                            key={
                              order.id ||
                              order.orderId ||
                              index
                            }
                            order={
                              order
                            }
                            formatDate={
                              formatDate
                            }
                            formatPrice={
                              formatPrice
                            }
                            getCustomerName={
                              getCustomerName
                            }
                            getOrderStatus={
                              getOrderStatus
                            }
                            getOrderTotal={
                              getOrderTotal
                            }
                            showDetails
                            onClick={() =>
                              setDetailView(
                                "order-" +
                                  (
                                    order.id ||
                                    order.orderId ||
                                    index
                                  )
                              )
                            }
                          />

                        )
                      )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // CUSTOMERS PAGE
  // ==========================================================

  const renderCustomers =
    () => {

      return (
        <AdminSectionPage
          title="Customers"
          subtitle="View and manage registered Luv03 customers."
          icon={
            Users
          }
        >

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {customers.length ===
            0 ? (

              <EmptyAdmin
                text="No customers registered yet."
              />

            ) : (

              customers.map(
                (
                  customer,
                  index
                ) => (

                  <div
                    key={
                      customer.id ||
                      customer.email ||
                      index
                    }
                    className="rounded-2xl border border-[#e3dfd8] bg-white p-5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4efe8] text-[#584539]">

                        <UserRound
                          size={
                            20
                          }
                          strokeWidth={
                            1.3
                          }
                        />

                      </div>


                      <div className="min-w-0">

                        <h3 className="truncate font-serif text-xl text-[#183d40]">
                          {
                            customer.name ||
                            "Customer"
                          }
                        </h3>

                        <p className="mt-1 break-all text-xs text-[#756960]">
                          {
                            customer.email
                          }
                        </p>

                      </div>

                    </div>


                    <div className="mt-5 border-t border-[#eee9df] pt-4">

                      <p className="text-[8px] uppercase tracking-[0.12em] text-[#9a897c]">
                        Account
                      </p>

                      <p className="mt-1 text-sm text-[#584539]">
                        Customer
                      </p>

                    </div>

                  </div>

                )

              )

            )}

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // PRODUCTS PAGE
  // ==========================================================

  const renderProducts =
    () => {

      return (
        <AdminSectionPage
          title="Products"
          subtitle="Manage products available in your Luv03 store."
          icon={
            ShoppingBag
          }
        >

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map(
              (
                product
              ) => (

                <div
                  key={
                    product.id
                  }
                  className="overflow-hidden rounded-2xl border border-[#e3dfd8] bg-white"
                >

                  <img
                    src={
                      product.image
                    }
                    alt={
                      product.name
                    }
                    className="aspect-[4/5] w-full object-cover"
                  />


                  <div className="p-5">

                    <p className="text-[8px] uppercase tracking-[0.15em] text-[#9a897c]">
                      {
                        product.category
                      }
                    </p>

                    <h3 className="mt-2 font-serif text-xl text-[#183d40]">
                      {
                        product.name
                      }
                    </h3>

                    <div className="mt-3 flex items-center justify-between">

                      <p className="text-sm font-medium text-[#584539]">
                        {
                          formatPrice(
                            product.price
                          )
                        }
                      </p>

                      <span className="text-[9px] text-[#756960]">
                        ★{" "}
                        {
                          product.rating
                        }
                      </span>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // CATEGORIES PAGE
  // ==========================================================

  const renderCategories =
    () => {

      const categories =
        [
          ...new Set(
            products.map(
              (
                product
              ) =>
                product.category
            )
          ),
        ];


      return (
        <AdminSectionPage
          title="Categories"
          subtitle="Product categories available in your store."
          icon={
            Grid2X2
          }
        >

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map(
              (
                category
              ) => {

                const count =
                  products.filter(
                    (
                      product
                    ) =>
                      product.category ===
                      category
                  ).length;

                return (
                  <div
                    key={
                      category
                    }
                    className="rounded-2xl border border-[#e3dfd8] bg-white p-6"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4efe8] text-[#584539]">

                      <Grid2X2
                        size={
                          19
                        }
                        strokeWidth={
                          1.3
                        }
                      />

                    </div>


                    <h3 className="mt-5 font-serif text-2xl text-[#183d40]">
                      {
                        category
                      }
                    </h3>


                    <p className="mt-2 text-xs text-[#756960]">
                      {
                        count
                      }{" "}
                      products
                    </p>

                  </div>
                );

              }
            )}

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // REVIEWS
  // ==========================================================

  const renderReviews =
    () => {

      return (
        <AdminSectionPage
          title="Reviews"
          subtitle="Monitor product ratings and customer feedback."
          icon={
            Star
          }
        >

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {products.map(
              (
                product
              ) => (

                <div
                  key={
                    product.id
                  }
                  className="rounded-2xl border border-[#e3dfd8] bg-white p-5"
                >

                  <div className="flex items-center justify-between">

                    <h3 className="font-serif text-xl text-[#183d40]">
                      {
                        product.name
                      }
                    </h3>

                    <span className="rounded-full bg-[#f4efe8] px-3 py-1 text-[9px] text-[#584539]">
                      ★{" "}
                      {
                        product.rating
                      }
                    </span>

                  </div>

                  <p className="mt-3 text-xs text-[#756960]">
                    {
                      product.reviews
                    } customer reviews
                  </p>

                </div>

              )
            )}

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // WISHLIST
  // ==========================================================

  const renderWishlist =
    () => {

      return (
        <AdminSectionPage
          title="Wishlist"
          subtitle="Products customers have saved."
          icon={
            Heart
          }
        >

          <div className="rounded-2xl border border-[#e3dfd8] bg-white p-6">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {products.map(
                (
                  product
                ) => (

                  <div
                    key={
                      product.id
                    }
                    className="flex items-center gap-4 rounded-xl bg-[#faf9f7] p-4"
                  >

                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                      className="h-14 w-14 rounded-lg object-cover"
                    />

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-[#3d3028]">
                        {
                          product.name
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-[#9a897c]">
                        Wishlist product
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // SETTINGS
  // ==========================================================

  const renderSettings =
    () => {

      return (
        <AdminSectionPage
          title="Settings"
          subtitle="Manage your Luv03 administration settings."
          icon={
            Settings
          }
        >

          <div className="max-w-2xl rounded-2xl border border-[#e3dfd8] bg-white p-6">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4efe8] text-[#584539]">

                <Settings
                  size={
                    20
                  }
                  strokeWidth={
                    1.3
                  }
                />

              </div>

              <div>

                <h3 className="font-serif text-xl text-[#183d40]">
                  Admin Account
                </h3>

                <p className="mt-1 text-xs text-[#756960]">
                  {
                    admin?.email
                  }
                </p>

              </div>

            </div>


            <div className="mt-6 border-t border-[#eee9df] pt-6">

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex items-center gap-2 rounded-lg border border-[#b56d43] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.12em] text-[#b56d43] transition hover:bg-[#b56d43] hover:text-white"
              >

                <LogOut
                  size={
                    14
                  }
                />

                Logout Admin

              </button>

            </div>

          </div>

        </AdminSectionPage>
      );

    };


  // ==========================================================
  // SELECT CURRENT PAGE
  // ==========================================================

  const renderPage =
    () => {

      if (
        activePage ===
        "Order Management"
      ) {
        return renderOrderManagement();
      }

      if (
        activePage ===
        "Customers"
      ) {
        return renderCustomers();
      }

      if (
        activePage ===
        "Products"
      ) {
        return renderProducts();
      }

      if (
        activePage ===
        "Categories"
      ) {
        return renderCategories();
      }

      if (
        activePage ===
        "Reviews"
      ) {
        return renderReviews();
      }

      if (
        activePage ===
        "Wishlist"
      ) {
        return renderWishlist();
      }

      if (
        activePage ===
        "Settings"
      ) {
        return renderSettings();
      }

      return renderDashboard();

    };


  // ==========================================================
  // MAIN LAYOUT
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#3d3028]">


      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileMenuOpen && (

        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
          className="fixed inset-0 z-40 bg-[#183d40]/30 lg:hidden"
        />

      )}


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-[#e3dfd8] bg-white transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-[72px] items-center justify-between border-b border-[#eee9df] px-5">

          <button
            type="button"
            onClick={() =>
              handleNavigation(
                "Dashboard"
              )
            }
            className="font-serif text-2xl font-semibold tracking-[-0.04em] text-[#183d40]"
          >
            Luv03
          </button>


          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9a897c] lg:hidden"
          >

            <X
              size={
                18
              }
            />

          </button>

        </div>


        {/* MAIN MENU */}

        <div className="flex-1 overflow-y-auto px-3 py-5">

          <p className="px-3 text-[8px] font-medium uppercase tracking-[0.18em] text-[#aaa098]">
            Main Menu
          </p>


          <nav className="mt-3 space-y-1">

            {menuItems.map(
              (
                item
              ) => {

                const Icon =
                  item.icon;

                const active =
                  activePage ===
                  item.label;

                return (
                  <button
                    key={
                      item.label
                    }
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.label
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                      active
                        ? "bg-[#4da979] text-white shadow-sm"
                        : "text-[#756960] hover:bg-[#f5f2ed] hover:text-[#3d3028]"
                    }`}
                  >

                    <Icon
                      size={
                        16
                      }
                      strokeWidth={
                        1.4
                      }
                    />

                    <span>
                      {
                        item.label
                      }
                    </span>

                  </button>
                );

              }
            )}

          </nav>

        </div>


        {/* ADMIN PROFILE */}

        <div className="border-t border-[#eee9df] p-3">

          <div className="flex items-center gap-3 rounded-xl bg-[#faf9f7] p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#183d40] text-white">

              <UserRound
                size={
                  16
                }
                strokeWidth={
                  1.3
                }
              />

            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-medium text-[#3d3028]">
                {
                  admin?.name ||
                  "Luv03 Admin"
                }
              </p>

              <p className="mt-0.5 truncate text-[9px] text-[#9a897c]">
                {
                  admin?.email ||
                  "Admin"
                }
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleLogout
              }
              className="text-[#9a897c] transition hover:text-[#b56d43]"
              title="Logout"
            >

              <LogOut
                size={
                  15
                }
                strokeWidth={
                  1.4
                }
              />

            </button>

          </div>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="lg:pl-[250px]">


        {/* ====================================================
            TOP HEADER
        ==================================================== */}

        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-[#e3dfd8] bg-white/95 px-4 backdrop-blur sm:px-6">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                true
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e3dfd8] text-[#584539] lg:hidden"
          >

            <Menu
              size={
                18
              }
            />

          </button>


          {/* SEARCH */}

          <div className="relative flex-1 sm:max-w-md">

            <Search
              size={
                16
              }
              strokeWidth={
                1.4
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a897c]"
            />

            <input
              type="text"
              value={
                searchQuery
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search orders, customers or products"
              className="h-10 w-full rounded-full border border-transparent bg-[#f6f7f8] pl-10 pr-4 text-xs text-[#3d3028] outline-none transition focus:border-[#d8cec3] focus:bg-white"
            />

          </div>


          {/* HEADER ACTIONS */}

          <div className="ml-auto flex items-center gap-2">

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f7f8] text-[#584539]"
            >

              <Bell
                size={
                  16
                }
                strokeWidth={
                  1.4
                }
              />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#b56d43]" />

            </button>


            <div className="hidden h-9 items-center gap-2 rounded-full bg-[#f6f7f8] px-3 sm:flex">

              <div className="h-2 w-2 rounded-full bg-[#4da979]" />

              <span className="text-[9px] font-medium text-[#756960]">
                Admin
              </span>

            </div>


            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183d40] text-white">

              <UserRound
                size={
                  16
                }
                strokeWidth={
                  1.3
                }
              />

            </div>

          </div>

        </header>


        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          <div className="mx-auto max-w-[1450px]">


            {/* PAGE HEADER */}

            <div className="mb-6">

              <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#9a897c]">
                Luv03 Administration
              </p>

              <div className="mt-1 flex items-center justify-between gap-4">

                <div>

                  <h1 className="font-serif text-3xl text-[#183d40] sm:text-4xl">
                    {
                      activePage
                    }
                  </h1>

                  <p className="mt-2 text-xs text-[#756960]">
                    Manage your Luv03 store from one place.
                  </p>

                </div>

              </div>

            </div>


            {/* PAGE */}

            {renderPage()}

          </div>

        </main>

      </div>


      {/* ======================================================
          ORDER DETAIL MODAL
      ====================================================== */}

      {detailView &&
        detailView.startsWith(
          "order-"
        ) && (

          <OrderDetailModal
            orders={
              orders
            }
            detailView={
              detailView
            }
            formatPrice={
              formatPrice
            }
            formatDate={
              formatDate
            }
            getCustomerName={
              getCustomerName
            }
            getCustomerEmail={
              getCustomerEmail
            }
            getOrderStatus={
              getOrderStatus
            }
            getOrderTotal={
              getOrderTotal
            }
            onClose={() =>
              setDetailView(
                null
              )
            }
          />

        )}



    </div>
  );
}


// ============================================================
// REVENUE CHART
// ============================================================

function RevenueChart({
  orders,
  totalRevenue,
}) {

  const points =
    [
      22,
      30,
      27,
      44,
      39,
      52,
      47,
    ];


  const labels =
    [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];


  return (
    <div>

      <div className="relative h-[210px] overflow-hidden rounded-xl bg-[#fafcf9]">

        {/* GRID */}

        <div className="absolute inset-0 flex flex-col justify-between px-3 py-4">

          {[0, 1, 2, 3].map(
            (
              line
            ) => (

              <div
                key={
                  line
                }
                className="border-t border-dashed border-[#e4e9e3]"
              />

            )
          )}

        </div>


        {/* BARS */}

        <div className="absolute inset-x-5 bottom-8 top-5 flex items-end justify-between gap-2">

          {points.map(
            (
              point,
              index
            ) => (

              <div
                key={
                  index
                }
                className="flex h-full flex-1 items-end justify-center"
              >

                <div
                  className="w-full max-w-[48px] rounded-t-md bg-[#bfe1cb] transition hover:bg-[#4da979]"
                  style={{
                    height:
                      `${point}%`,
                  }}
                />

              </div>

            )
          )}

        </div>


        {/* LABELS */}

        <div className="absolute inset-x-5 bottom-1 flex justify-between">

          {labels.map(
            (
              label
            ) => (

              <span
                key={
                  label
                }
                className="text-[8px] text-[#9a897c]"
              >
                {
                  label
                }
              </span>

            )
          )}

        </div>

      </div>


      <div className="mt-3 flex items-center justify-between">

        <p className="text-[9px] text-[#9a897c]">
          Revenue based on available orders
        </p>

        <p className="text-[9px] text-[#4da979]">
          {
            orders.length
          } orders
        </p>

      </div>

    </div>
  );
}


// ============================================================
// STATUS LINE
// ============================================================

function StatusLine({
  title,
  value,
  icon: Icon,
}) {

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#faf9f7] p-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#584539]">

        <Icon
          size={
            16
          }
          strokeWidth={
            1.3
          }
        />

      </div>


      <div className="min-w-0 flex-1">

        <p className="truncate text-[10px] text-[#756960]">
          {
            title
          }
        </p>

      </div>


      <p className="font-serif text-xl text-[#183d40]">
        {
          value
        }
      </p>

    </div>
  );
}


// ============================================================
// TRANSACTION ROW
// ============================================================

function TransactionRow({
  order,
  formatDate,
  formatPrice,
  getCustomerName,
  getOrderStatus,
  getOrderTotal,
  onClick,
  showDetails = false,
}) {

  const orderId =
    order.orderId ||
    order.id ||
    "-";


  const status =
    getOrderStatus(
      order
    );


  return (
    <tr
      className="border-b border-[#eee9df] transition hover:bg-[#faf9f7]"
    >

      <td className="px-5 py-4">

        <button
          type="button"
          onClick={
            onClick
          }
          className="text-left"
        >

          <p className="text-xs font-medium text-[#183d40]">
            #
            {
              orderId
            }
          </p>

        </button>

      </td>


      <td className="px-5 py-4">

        <p className="text-xs text-[#3d3028]">
          {
            getCustomerName(
              order
            )
          }
        </p>

      </td>


      <td className="px-5 py-4">

        <p className="text-xs text-[#756960]">
          {
            formatDate(
              order.createdAt ||
              order.date ||
              order.createdDate
            )
          }
        </p>

      </td>


      <td className="px-5 py-4">

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-medium ${
            status ===
            "Delivered"
              ? "bg-[#e7f3e9] text-[#4c9464]"
              : status ===
                "Out for Delivery"
              ? "bg-[#fff1dc] text-[#a36c27]"
              : status ===
                "Package Shipped"
              ? "bg-[#e9eef7] text-[#57729a]"
              : status ===
                "Packed"
              ? "bg-[#f5e9df] text-[#9a6648]"
              : "bg-[#f1efeb] text-[#756960]"
          }`}
        >

          <span className="h-1.5 w-1.5 rounded-full bg-current" />

          {
            status
          }

        </span>

      </td>


      <td className="px-5 py-4 text-right">

        <p className="text-xs font-medium text-[#183d40]">
          {
            formatPrice(
              getOrderTotal(
                order
              )
            )
          }
        </p>

      </td>


      {showDetails && (

        <td className="px-5 py-4 text-right">

          <button
            type="button"
            onClick={
              onClick
            }
            className="rounded-lg border border-[#d9d1c8] px-3 py-1.5 text-[8px] uppercase tracking-[0.08em] text-[#584539] transition hover:border-[#b56d43] hover:text-[#b56d43]"
          >
            Details
          </button>

        </td>

      )}

    </tr>
  );
}


// ============================================================
// ADMIN SECTION PAGE
// ============================================================

function AdminSectionPage({
  title,
  subtitle,
  icon: Icon,
  children,
}) {

  return (
    <div>

      <div className="mb-5 flex items-center gap-4 rounded-2xl border border-[#e3dfd8] bg-white p-5">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4efe8] text-[#584539]">

          <Icon
            size={
              19
            }
            strokeWidth={
              1.3
            }
          />

        </div>


        <div>

          <h2 className="font-serif text-2xl text-[#183d40]">
            {
              title
            }
          </h2>

          <p className="mt-1 text-xs text-[#756960]">
            {
              subtitle
            }
          </p>

        </div>

      </div>


      {children}

    </div>
  );
}


// ============================================================
// EMPTY ADMIN
// ============================================================

function EmptyAdmin({
  text,
}) {

  return (
    <div className="rounded-2xl border border-[#e3dfd8] bg-white p-12 text-center sm:col-span-2 lg:col-span-3">

      <Boxes
        size={
          28
        }
        strokeWidth={
          1.2
        }
        className="mx-auto text-[#aaa098]"
      />

      <p className="mt-3 text-sm text-[#756960]">
        {
          text
        }
      </p>

    </div>
  );
}


// ============================================================
// MINI STAT
// ============================================================

function MiniStat({
  title,
  value,
}) {

  return (
    <div className="rounded-xl bg-[#faf9f7] p-4">

      <p className="text-[8px] uppercase tracking-[0.1em] text-[#9a897c]">
        {
          title
        }
      </p>

      <p className="mt-1 font-serif text-xl text-[#183d40]">
        {
          value
        }
      </p>

    </div>
  );
}


// ============================================================
// DETAIL ORDER
// ============================================================

function DetailOrder({
  order,
  formatPrice,
  formatDate,
  getCustomerName,
  getOrderStatus,
  getOrderTotal,
}) {

  return (
    <div className="rounded-xl border border-[#e9e4dd] bg-[#faf9f7] p-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-[8px] uppercase tracking-[0.1em] text-[#9a897c]">
            Order
          </p>

          <h3 className="mt-1 font-serif text-xl text-[#183d40]">
            #
            {
              order.orderId ||
              order.id ||
              "-"
            }
          </h3>

          <p className="mt-1 text-xs text-[#756960]">
            {
              getCustomerName(
                order
              )
            }
          </p>

        </div>


        <div className="text-left sm:text-right">

          <p className="font-serif text-xl text-[#183d40]">
            {
              formatPrice(
                getOrderTotal(
                  order
                )
              )
            }
          </p>

          <p className="mt-1 text-[9px] text-[#9a897c]">
            {
              formatDate(
                order.createdAt ||
                order.date ||
                order.createdDate
              )
            }
          </p>

        </div>

      </div>


      <div className="mt-4 flex items-center justify-between border-t border-[#e9e4dd] pt-4">

        <span className="text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
          Status
        </span>

        <span className="rounded-full bg-[#edf5ef] px-3 py-1.5 text-[8px] font-medium text-[#4c9464]">
          {
            getOrderStatus(
              order
            )
          }
        </span>

      </div>

    </div>
  );
}


// ============================================================
// ORDER DETAIL MODAL
// ============================================================

function OrderDetailModal({
  orders,
  detailView,
  formatPrice,
  formatDate,
  getCustomerName,
  getCustomerEmail,
  getOrderStatus,
  getOrderTotal,
  onClose,
}) {

  const orderKey =
    detailView.replace(
      "order-",
      ""
    );


  const order =
    orders.find(
      (item) =>
        String(
          item.id ||
          item.orderId
        ) ===
        String(
          orderKey
        )
    );


  if (!order) {

    return null;

  }


  const customer =
    order.customer ||
    order.user ||
    {};


  const address =
    order.shippingAddress ||
    order.address ||
    customer.address ||
    null;


  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-[#183d40]/30 p-4 backdrop-blur-sm sm:p-8">

      <div className="flex min-h-full items-center justify-center">

        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]">

          {/* HEADER */}

          <div className="flex items-start justify-between border-b border-[#eee9df] p-5 sm:p-7">

            <div>

              <p className="text-[8px] uppercase tracking-[0.16em] text-[#9a897c]">
                Order Details
              </p>

              <h2 className="mt-1 font-serif text-3xl text-[#183d40]">
                #
                {
                  order.orderId ||
                  order.id ||
                  "-"
                }
              </h2>

              <p className="mt-2 text-xs text-[#756960]">
                {
                  getCustomerName(
                    order
                  )
                }
              </p>

            </div>


            <button
              type="button"
              onClick={
                onClose
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ed] text-[#584539]"
            >

              <X
                size={
                  18
                }
              />

            </button>

          </div>


          {/* BODY */}

          <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-7">

            <div className="grid gap-5 lg:grid-cols-2">


              {/* CUSTOMER */}

              <div className="rounded-2xl bg-[#faf9f7] p-5">

                <h3 className="font-serif text-xl text-[#183d40]">
                  Customer
                </h3>


                <div className="mt-4 space-y-3">

                  <InfoRow
                    label="Name"
                    value={
                      getCustomerName(
                        order
                      )
                    }
                  />

                  <InfoRow
                    label="Email"
                    value={
                      getCustomerEmail(
                        order
                      )
                    }
                  />

                  <InfoRow
                    label="Order Date"
                    value={
                      formatDate(
                        order.createdAt ||
                        order.date ||
                        order.createdDate
                      )
                    }
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div className="rounded-2xl bg-[#faf9f7] p-5">

                <h3 className="font-serif text-xl text-[#183d40]">
                  Delivery Address
                </h3>


                {address ? (

                  <div className="mt-4 space-y-1 text-sm leading-6 text-[#756960]">

                    <p>
                      {
                        address.name ||
                        getCustomerName(
                          order
                        )
                      }
                    </p>

                    <p>
                      {
                        address.address ||
                        address.line1 ||
                        ""
                      }
                    </p>

                    <p>
                      {
                        address.city ||
                        ""
                      }
                      {address.city &&
                      address.state
                        ? ", "
                        : ""}
                      {
                        address.state ||
                        ""
                      }
                    </p>

                    <p>
                      {
                        address.pincode ||
                        address.postalCode ||
                        ""
                      }
                    </p>

                    <p>
                      {
                        address.phone ||
                        ""
                      }
                    </p>

                  </div>

                ) : (

                  <p className="mt-4 text-sm text-[#9a897c]">
                    Customer address is not available for this order.
                  </p>

                )}

              </div>


              {/* ORDER SUMMARY */}

              <div className="rounded-2xl bg-[#faf9f7] p-5 lg:col-span-2">

                <div className="flex items-center justify-between">

                  <h3 className="font-serif text-xl text-[#183d40]">
                    Order Summary
                  </h3>

                  <span className="rounded-full bg-[#edf5ef] px-3 py-1.5 text-[8px] font-medium text-[#4c9464]">
                    {
                      getOrderStatus(
                        order
                      )
                    }
                  </span>

                </div>


                <div className="mt-5 space-y-3">

                  {Array.isArray(
                    order.items
                  ) ? (

                    order.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={
                            item.id ||
                            item.productId ||
                            index
                          }
                          className="flex items-center justify-between border-b border-[#e9e4dd] pb-3 last:border-b-0"
                        >

                          <div>

                            <p className="text-sm text-[#3d3028]">
                              {
                                item.name ||
                                item.product?.name ||
                                "Product"
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-[#9a897c]">
                              Qty:{" "}
                              {
                                item.quantity ||
                                1
                              }
                            </p>

                          </div>


                          <p className="text-sm font-medium text-[#183d40]">
                            {
                              formatPrice(
                                Number(
                                  item.price ||
                                  item.product?.price ||
                                  0
                                ) *
                                  Number(
                                    item.quantity ||
                                    1
                                  )
                              )
                            }
                          </p>

                        </div>

                      )
                    )

                  ) : (

                    <p className="text-sm text-[#9a897c]">
                      Product details are not available.
                    </p>

                  )}

                </div>


                <div className="mt-5 flex items-center justify-between border-t border-[#ddd7ce] pt-5">

                  <span className="text-sm text-[#756960]">
                    Total
                  </span>

                  <span className="font-serif text-2xl text-[#183d40]">
                    {
                      formatPrice(
                        getOrderTotal(
                          order
                        )
                      )
                    }
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// INFO ROW
// ============================================================

function InfoRow({
  label,
  value,
}) {

  return (
    <div className="flex items-start justify-between gap-5 border-b border-[#e9e4dd] pb-3 last:border-b-0">

      <span className="text-[9px] uppercase tracking-[0.1em] text-[#9a897c]">
        {
          label
        }
      </span>

      <span className="break-all text-right text-xs text-[#3d3028]">
        {
          value ||
          "-"
        }
      </span>

    </div>
  );
}


export default Admin;