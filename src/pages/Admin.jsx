import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Bell,
  Box,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  Filter,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  User,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredProducts, saveStoredProducts } from "../data/products";
import {
  getCurrentUser,
  logoutUser,
  requireAdmin,
  getAllOrders,
  saveAllOrders,
  updateOrder,
  getAllCustomers,
} from "../utils/auth";
import {
  COURIER_PARTNERS,
  findCourier,
  getCourierTrackingUrl,
  generateTrackingNumber,
  getNextDeliveryStatus,
} from "../utils/courier";

// Initial seed orders demonstrating respected couriers
const INITIAL_SEED_ORDERS = [
  {
    id: "LUV03-782194",
    customerEmail: "ananya.sharma@example.com",
    customer: {
      firstName: "Ananya",
      lastName: "Sharma",
      name: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      phone: "+91 98201 54321",
    },
    shipping: {
      address: "Flat 402, Sea Green Apts, Worli Sea Face",
      apartment: "Worli",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400018",
    },
    items: [
      {
        id: 1,
        name: "Hydra-Glow Face Oil",
        slug: "hydra-glow-face-oil",
        price: 899,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1608248597359-009772186526?auto=format&fit=crop&w=900&q=85",
      },
      {
        id: 2,
        name: "Daily Moisturiser",
        slug: "daily-moisturiser",
        price: 749,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
      },
    ],
    total: 2547,
    paymentMethod: "COD",
    paymentStatus: "Pay on Delivery",
    status: "Order Confirmed",
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    carrier: "The Professional Couriers",
    trackingNumber: "TPC-9921048",
  },
  {
    id: "LUV03-651042",
    customerEmail: "rohan.verma@example.com",
    customer: {
      firstName: "Rohan",
      lastName: "Verma",
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      phone: "+91 98450 12345",
    },
    shipping: {
      address: "12, 4th Main, Indiranagar",
      apartment: "Near Metro",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
    items: [
      {
        id: 3,
        name: "Glow Sunscreen SPF 50",
        slug: "glow-sunscreen-spf-50",
        price: 699,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
      },
    ],
    total: 1398,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    status: "Order Confirmed",
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    carrier: "Blue Dart Express",
    trackingNumber: "BD-8821094",
  },
  {
    id: "LUV03-519283",
    customerEmail: "priya.iyer@example.com",
    customer: {
      firstName: "Priya",
      lastName: "Iyer",
      name: "Priya Iyer",
      email: "priya.iyer@example.com",
      phone: "+91 97909 67890",
    },
    shipping: {
      address: "Villa 8, Orchid Enclave, ECR",
      apartment: "Kottivakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600041",
    },
    items: [
      {
        id: 4,
        name: "Gentle Foaming Cleanser",
        slug: "gentle-foaming-cleanser",
        price: 599,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
      },
      {
        id: 1,
        name: "Hydra-Glow Face Oil",
        slug: "hydra-glow-face-oil",
        price: 899,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1608248597359-009772186526?auto=format&fit=crop&w=900&q=85",
      },
    ],
    total: 1498,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    status: "Packed",
    date: new Date(Date.now() - 3600000 * 36).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    carrier: "ST Courier",
    trackingNumber: "ST-4410928",
  },
  {
    id: "LUV03-441920",
    customerEmail: "sneha.patel@example.com",
    customer: {
      firstName: "Sneha",
      lastName: "Patel",
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      phone: "+91 98791 23456",
    },
    shipping: {
      address: "B-201, Shivalik Heights, Bodakdev",
      apartment: "Near Judges Bungalow",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380054",
    },
    items: [
      {
        id: 2,
        name: "Daily Moisturiser",
        slug: "daily-moisturiser",
        price: 749,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
      },
    ],
    total: 1498,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    status: "Package Shipped",
    date: new Date(Date.now() - 3600000 * 60).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    carrier: "Delhivery",
    trackingNumber: "DLV-3104918",
  },
  {
    id: "LUV03-318491",
    customerEmail: "vikram.malhotra@example.com",
    customer: {
      firstName: "Vikram",
      lastName: "Malhotra",
      name: "Vikram Malhotra",
      email: "vikram.malhotra@example.com",
      phone: "+91 98110 98765",
    },
    shipping: {
      address: "14 Golf Links",
      apartment: "Main Road",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110003",
    },
    items: [
      {
        id: 1,
        name: "Hydra-Glow Face Oil",
        slug: "hydra-glow-face-oil",
        price: 899,
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1608248597359-009772186526?auto=format&fit=crop&w=900&q=85",
      },
    ],
    total: 2697,
    paymentMethod: "Prepaid",
    paymentStatus: "Paid",
    status: "Out for Delivery",
    date: new Date(Date.now() - 3600000 * 90).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 90).toISOString(),
    carrier: "Blue Dart Express",
    trackingNumber: "BD-9941029",
  },
  {
    id: "LUV03-205118",
    customerEmail: "neha.reddy@example.com",
    customer: {
      firstName: "Neha",
      lastName: "Reddy",
      name: "Neha Reddy",
      email: "neha.reddy@example.com",
      phone: "+91 99890 54321",
    },
    shipping: {
      address: "Plot 42, Jubilee Hills",
      apartment: "Road No 36",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
    },
    items: [
      {
        id: 2,
        name: "Daily Moisturiser",
        slug: "daily-moisturiser",
        price: 749,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
      },
      {
        id: 3,
        name: "Glow Sunscreen SPF 50",
        slug: "glow-sunscreen-spf-50",
        price: 699,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
      },
    ],
    total: 1448,
    paymentMethod: "COD",
    paymentStatus: "Paid",
    status: "Delivered",
    date: new Date(Date.now() - 3600000 * 140).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 140).toISOString(),
    carrier: "The Professional Couriers",
    trackingNumber: "TPC-7719203",
  },
];

const INITIAL_SEED_CUSTOMERS = [
  {
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 98201 54321",
    role: "customer",
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  },
  {
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    phone: "+91 98450 12345",
    role: "customer",
    createdAt: new Date(Date.now() - 3600000 * 24 * 45).toISOString(),
  },
  {
    name: "Priya Iyer",
    email: "priya.iyer@example.com",
    phone: "+91 97909 67890",
    role: "customer",
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
  },
  {
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    phone: "+91 98791 23456",
    role: "customer",
    createdAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.malhotra@example.com",
    phone: "+91 98110 98765",
    role: "customer",
    createdAt: new Date(Date.now() - 3600000 * 24 * 90).toISOString(),
  },
  {
    name: "Neha Reddy",
    email: "neha.reddy@example.com",
    phone: "+91 99890 54321",
    role: "customer",
    createdAt: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
  },
];

const ORDER_DELIVERY_STATUSES = [
  "Order Confirmed",
  "Packed",
  "Package Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function Admin() {
  const navigate = useNavigate();

  // Navigation tab: analytics, products, orders, customers, inventory
  const [activeTab, setActiveTab] = useState("orders");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Toast notification
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Modals state
  const [productModal, setProductModal] = useState({
    isOpen: false,
    mode: "add",
    product: null,
  });

  const [deleteProductModal, setDeleteProductModal] = useState({
    isOpen: false,
    product: null,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [inventoryStockFilter, setInventoryStockFilter] = useState("all");
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("30days");

  // Admin auth check
  useEffect(() => {
    requireAdmin(navigate);
  }, [navigate]);

  // Load and seed products, orders, customers
  const loadAllData = () => {
    const storedProducts = getStoredProducts();
    setProducts(storedProducts);

    let currentOrders = getAllOrders();
    if (!currentOrders || currentOrders.length === 0) {
      currentOrders = INITIAL_SEED_ORDERS;
      saveAllOrders(INITIAL_SEED_ORDERS);
    }
    setOrders(currentOrders);

    let currentUsers = getAllCustomers();
    if (!currentUsers || currentUsers.length === 0) {
      try {
        const existingUsers = JSON.parse(localStorage.getItem("luv03-users") || "[]");
        const merged = [...existingUsers];
        INITIAL_SEED_CUSTOMERS.forEach((seed) => {
          if (!merged.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
            merged.push(seed);
          }
        });
        localStorage.setItem("luv03-users", JSON.stringify(merged));
        currentUsers = merged.filter((u) => u.role !== "admin");
      } catch (e) {
        currentUsers = INITIAL_SEED_CUSTOMERS;
      }
    }
    setCustomers(currentUsers);
  };

  useEffect(() => {
    loadAllData();

    const handleProductsChange = () => {
      setProducts(getStoredProducts());
    };

    const handleOrdersChange = () => {
      const refreshedOrders = getAllOrders();
      setOrders(refreshedOrders);
    };

    const handleStorageChange = (e) => {
      if (e.key === "luv03-orders" || !e.key) {
        setOrders(getAllOrders());
      }
      if (e.key === "luv03-products" || !e.key) {
        setProducts(getStoredProducts());
      }
      if (e.key === "luv03-users" || !e.key) {
        setCustomers(getAllCustomers());
      }
    };

    const handleFocus = () => {
      setOrders(getAllOrders());
      setProducts(getStoredProducts());
      setCustomers(getAllCustomers());
    };

    const pollInterval = setInterval(() => {
      const latestOrders = getAllOrders();
      setOrders((prev) => {
        if (
          latestOrders.length !== prev.length ||
          JSON.stringify(latestOrders[0]) !== JSON.stringify(prev[0])
        ) {
          return latestOrders;
        }
        return prev;
      });
    }, 2000);

    window.addEventListener("luv03-products-change", handleProductsChange);
    window.addEventListener("luv03-orders-change", handleOrdersChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("luv03-products-change", handleProductsChange);
      window.removeEventListener("luv03-orders-change", handleOrdersChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const admin = getCurrentUser();

  // Helper formatting
  const formatPrice = (val) => {
    return `₹${Number(val || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================================
  // METRICS & COMPUTATIONS
  // ==========================================================

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (order.status === "Cancelled") return sum;
      return sum + Number(order.total || 0);
    }, 0);
  }, [orders]);

  const prepaidCount = useMemo(() => {
    return orders.filter(
      (o) => (o.paymentMethod || "").toLowerCase() !== "cod"
    ).length;
  }, [orders]);

  const codCount = useMemo(() => {
    return orders.filter(
      (o) => (o.paymentMethod || "").toLowerCase() === "cod"
    ).length;
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 10);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => Number(p.stock) <= 0);
  }, [products]);

  const averageOrderValue = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "Cancelled");
    return validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  }, [orders, totalRevenue]);

  const aggregatedCustomers = useMemo(() => {
    const customerMap = new Map();

    customers.forEach((u) => {
      const email = u.email?.toLowerCase().trim();
      if (!email) return;
      customerMap.set(email, {
        id: email,
        name: u.name || "Valued Customer",
        email: u.email,
        phone: u.phone || "-",
        isRegistered: true,
        createdAt: u.createdAt || new Date().toISOString(),
        ordersCount: 0,
        totalSpend: 0,
        orders: [],
        addresses: [],
      });
    });

    orders.forEach((o) => {
      const email = (o.customerEmail || o.customer?.email || "").toLowerCase().trim();
      if (!email) return;

      let c = customerMap.get(email);
      if (!c) {
        c = {
          id: email,
          name: o.customer?.name || `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim() || "Customer",
          email: o.customerEmail || o.customer?.email,
          phone: o.customer?.phone || "-",
          isRegistered: false,
          createdAt: o.date || o.createdAt || new Date().toISOString(),
          ordersCount: 0,
          totalSpend: 0,
          orders: [],
          addresses: [],
        };
        customerMap.set(email, c);
      }

      c.ordersCount += 1;
      if (o.status !== "Cancelled") {
        c.totalSpend += Number(o.total || 0);
      }
      c.orders.push(o);

      if (o.shipping && o.shipping.address) {
        const addrStr = `${o.shipping.address}${o.shipping.apartment ? ", " + o.shipping.apartment : ""}, ${o.shipping.city || ""}, ${o.shipping.state || ""} - ${o.shipping.pincode || ""}`;
        if (!c.addresses.includes(addrStr)) {
          c.addresses.push(addrStr);
        }
      }
    });

    return Array.from(customerMap.values()).map((c) => {
      let tier = "Regular";
      if (c.totalSpend >= 10000) tier = "VIP Elite";
      else if (c.totalSpend >= 5000) tier = "Gold Member";
      return { ...c, tier };
    });
  }, [customers, orders]);

  // ==========================================================
  // ACTIONS: ORDERS & COURIER PARTNER MANAGEMENT
  // ==========================================================

  // Change delivery status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const isCod = (targetOrder.paymentMethod || "").toLowerCase() === "cod";
    const updated = {
      ...targetOrder,
      status: newStatus,
      paymentStatus:
        newStatus === "Delivered" && isCod
          ? "Paid"
          : targetOrder.paymentStatus,
      deliveredAt: newStatus === "Delivered" ? new Date().toISOString() : targetOrder.deliveredAt,
    };

    updateOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated);
    }
    showToast(`Order #${orderId} status set to "${newStatus}"`, "info");
  };

  // Change Courier Partner (Requirement 4)
  const handleUpdateCourier = (orderId, newCarrier) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // If tracking number was empty, generate a realistic tracking number for this courier
    const trackingNum = targetOrder.trackingNumber || generateTrackingNumber(newCarrier);

    const updated = {
      ...targetOrder,
      carrier: newCarrier,
      trackingNumber: trackingNum,
    };

    updateOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated);
    }
    showToast(`Order #${orderId} assigned to ${newCarrier} (${trackingNum})`, "success");
  };

  // Update Tracking Number & Carrier manually
  const handleUpdateTracking = (orderId, carrier, trackingNumber) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const updated = {
      ...targetOrder,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
    };

    updateOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated);
    }
    showToast(`Tracking info updated for #${orderId}`, "success");
  };

  // Auto-sync courier status (Requirement 3)
  const handleAdvanceCourierStatus = (orderId) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const nextStatus = getNextDeliveryStatus(targetOrder.status || "Order Confirmed");
    if (nextStatus === targetOrder.status) {
      showToast(`Order is already ${targetOrder.status}`, "info");
      return;
    }

    handleUpdateOrderStatus(orderId, nextStatus);
  };

  // ==========================================================
  // ACTIONS: INVENTORY
  // ==========================================================

  const handleUpdateStock = (productId, newStock) => {
    const numericStock = Math.max(0, parseInt(newStock, 10) || 0);
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: numericStock };
      }
      return p;
    });

    saveStoredProducts(updatedProducts);
    setProducts(updatedProducts);
    showToast("Stock quantity updated successfully", "success");
  };

  const handleAdjustStock = (productId, delta) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const currentStock = Number(product.stock) || 0;
    const nextStock = Math.max(0, currentStock + delta);
    handleUpdateStock(productId, nextStock);
  };

  const handleQuickRestockAllLow = () => {
    const updatedProducts = products.map((p) => {
      if (Number(p.stock) <= 10) {
        return { ...p, stock: 35 };
      }
      return p;
    });
    saveStoredProducts(updatedProducts);
    setProducts(updatedProducts);
    showToast("Restocked all low/out-of-stock items to 35 units!", "success");
  };

  // ==========================================================
  // ACTIONS: PRODUCTS (CRUD & MULTI-IMAGE)
  // ==========================================================

  const handleOpenAddProduct = () => {
    setProductModal({
      isOpen: true,
      mode: "add",
      product: {
        id: Date.now(),
        name: "",
        slug: "",
        category: "Face Oil",
        price: "",
        originalPrice: "",
        stock: 25,
        rating: 4.8,
        reviews: 12,
        description: "",
        benefits: ["Deep hydration", "Nourishing formula", "Skin barrier support"],
        featured: false,
        bestSeller: false,
        image: "",
        images: [],
      },
    });
  };

  const handleOpenEditProduct = (product) => {
    let images = Array.isArray(product.images) && product.images.length > 0
      ? [...product.images]
      : product.image
      ? [product.image]
      : [];

    setProductModal({
      isOpen: true,
      mode: "edit",
      product: {
        ...product,
        images,
        image: images[0] || product.image || "",
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
      },
    });
  };

  const handleSaveProductModal = (savedProduct) => {
    if (!savedProduct.name.trim()) {
      showToast("Please enter a product name", "warning");
      return;
    }
    if (!savedProduct.price || Number(savedProduct.price) <= 0) {
      showToast("Please enter a valid price", "warning");
      return;
    }
    if (!savedProduct.images || savedProduct.images.length === 0) {
      showToast("Please provide at least 1 product image", "warning");
      return;
    }

    const autoSlug =
      savedProduct.slug.trim() ||
      savedProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const finalProduct = {
      ...savedProduct,
      slug: autoSlug,
      price: Number(savedProduct.price),
      originalPrice: Number(savedProduct.originalPrice) || Number(savedProduct.price),
      stock: Number(savedProduct.stock) || 0,
      image: savedProduct.images[0],
    };

    let updatedProducts;
    if (productModal.mode === "add") {
      updatedProducts = [finalProduct, ...products];
      showToast(`Product "${finalProduct.name}" added successfully!`, "success");
    } else {
      updatedProducts = products.map((p) =>
        p.id === finalProduct.id ? finalProduct : p
      );
      showToast(`Product "${finalProduct.name}" updated successfully!`, "success");
    }

    saveStoredProducts(updatedProducts);
    setProducts(updatedProducts);
    setProductModal({ isOpen: false, mode: "add", product: null });
  };

  const handleDeleteProduct = (productId) => {
    const target = products.find((p) => p.id === productId);
    const updated = products.filter((p) => p.id !== productId);
    saveStoredProducts(updated);
    setProducts(updated);
    setDeleteProductModal({ isOpen: false, product: null });
    showToast(`Deleted "${target?.name || "Product"}" from catalog`, "info");
  };

  // ==========================================================
  // RENDER NAVIGATION ITEMS
  // ==========================================================

  const navItems = [
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null,
      description: "Revenue, couriers & sales KPIs",
    },
    {
      id: "products",
      label: "Products",
      icon: ShoppingBag,
      badge: products.length,
      description: "Catalog, multiple images, CRUD",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ClipboardList,
      badge: orders.length,
      badgeColor: "bg-[#161311] text-[#FAF7F2]",
      description: "Fulfillment & Courier Logistics",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      badge: aggregatedCustomers.length,
      description: "VIP tiers & customer profiles",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
      badge: lowStockProducts.length > 0 ? `${lowStockProducts.length} low` : null,
      badgeColor: "bg-rose-500 text-white",
      description: "Stock counts & quick restock",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#161311] antialiased">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-2xl border border-white/60 bg-[#161311] px-5 py-3.5 text-xs font-medium text-[#FAF7F2] shadow-2xl backdrop-blur-xl"
          >
            {toast.type === "success" && <CheckCircle2 size={16} className="text-emerald-400" />}
            {toast.type === "warning" && <AlertTriangle size={16} className="text-amber-400" />}
            {toast.type === "info" && <Sparkles size={16} className="text-[#C5A880]" />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="ml-2 text-white/50 hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* ====================================================
            SIDEBAR (DESKTOP)
        ==================================================== */}
        <aside className="hidden w-72 flex-col border-r border-[#E5DED3] bg-white/95 px-6 py-8 backdrop-blur-xl lg:flex">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-8 border-b border-[#E5DED3]">
            <div>
              <Link to="/" className="font-serif text-2xl tracking-[0.2em] text-[#161311]">
                LUV03
              </Link>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
                Admin Console
              </p>
            </div>
            <Link
              to="/shop"
              title="View Storefront"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5DED3] text-[#524942] transition hover:border-[#161311] hover:text-[#161311]"
            >
              <ExternalLink size={14} />
            </Link>
          </div>

          {/* Nav list */}
          <nav className="mt-8 flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
                    isActive
                      ? "bg-[#161311] text-[#FAF7F2] shadow-sm"
                      : "text-[#524942] hover:bg-[#FAF7F2] hover:text-[#161311]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      size={18}
                      className={isActive ? "text-[#C5A880]" : "text-[#8C7E72] group-hover:text-[#161311]"}
                    />
                    <div>
                      <span className="block font-medium text-xs tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? "bg-white/20 text-[#FAF7F2]"
                          : "bg-[#E5DED3] text-[#524942]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Supported Courier Partners Banner */}
          <div className="mt-6 rounded-2xl border border-[#E5DED3] bg-[#FAF7F2]/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
              Logistics Partners
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5 text-[9px] font-medium text-[#524942]">
              <span className="rounded-lg bg-white border border-[#E5DED3] px-2 py-0.5">Blue Dart</span>
              <span className="rounded-lg bg-white border border-[#E5DED3] px-2 py-0.5">ST Courier</span>
              <span className="rounded-lg bg-white border border-[#E5DED3] px-2 py-0.5">Professional</span>
              <span className="rounded-lg bg-white border border-[#E5DED3] px-2 py-0.5">Delhivery</span>
            </div>
          </div>

          {/* Admin user profile */}
          <div className="mt-6 border-t border-[#E5DED3] pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#161311] text-xs font-semibold text-[#FAF7F2]">
                  LA
                </div>
                <div className="max-w-[130px] truncate">
                  <p className="truncate text-xs font-medium text-[#161311]">
                    {admin?.name || "Luv03 Admin"}
                  </p>
                  <p className="text-[10px] text-[#8C7E72]">Super Admin</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logoutUser();
                  navigate("/login");
                }}
                title="Logout"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5DED3] text-[#8C7E72] transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* ====================================================
            MAIN VIEWPORT
        ==================================================== */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#E5DED3] bg-white/80 px-6 backdrop-blur-xl lg:px-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5DED3] text-[#161311] lg:hidden"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="font-serif text-2xl font-normal text-[#161311] capitalize">
                  {activeTab}
                </h1>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8C7E72]">
                  {navItems.find((i) => i.id === activeTab)?.description}
                </p>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-3">
              {activeTab === "products" && (
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-2 rounded-full bg-[#161311] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#FAF7F2] transition hover:bg-[#38312B] shadow-sm"
                >
                  <Plus size={15} />
                  <span>Add Product</span>
                </button>
              )}

              {activeTab === "inventory" && (
                <button
                  onClick={handleQuickRestockAllLow}
                  className="flex items-center gap-2 rounded-full bg-[#161311] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#FAF7F2] transition hover:bg-[#38312B]"
                >
                  <RefreshCw size={14} />
                  <span>Restock Low SKUs</span>
                </button>
              )}

              <Link
                to="/shop"
                className="hidden sm:flex items-center gap-2 rounded-full border border-[#E5DED3] bg-white px-4 py-2 text-xs font-medium text-[#161311] transition hover:border-[#161311]"
              >
                <span>Storefront</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </header>

          {/* Mobile drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl lg:hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-6 border-b border-[#E5DED3]">
                      <span className="font-serif text-2xl tracking-[0.2em]">LUV03</span>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg p-1.5 text-[#8C7E72]"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <nav className="mt-6 space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${
                              isActive ? "bg-[#161311] text-[#FAF7F2]" : "text-[#524942]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} />
                              <span className="text-xs font-medium">{item.label}</span>
                            </div>
                            {item.badge !== null && (
                              <span className="rounded-full bg-[#E5DED3] px-2 py-0.5 text-[9px] text-[#161311]">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      navigate("/login");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 py-3 text-xs font-medium text-rose-600"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Tab Content Container */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            {activeTab === "analytics" && (
              <AnalyticsTab
                orders={orders}
                products={products}
                customers={aggregatedCustomers}
                totalRevenue={totalRevenue}
                prepaidCount={prepaidCount}
                codCount={codCount}
                averageOrderValue={averageOrderValue}
                timeframe={analyticsTimeframe}
                setTimeframe={setAnalyticsTimeframe}
                onSelectTab={setActiveTab}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onViewOrder={setSelectedOrder}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                products={products}
                categoryFilter={productCategoryFilter}
                setCategoryFilter={setProductCategoryFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddProduct={handleOpenAddProduct}
                onEditProduct={handleOpenEditProduct}
                onDeleteProduct={(p) => setDeleteProductModal({ isOpen: true, product: p })}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                statusFilter={orderStatusFilter}
                setStatusFilter={setOrderStatusFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onUpdateStatus={handleUpdateOrderStatus}
                onUpdateCourier={handleUpdateCourier}
                onAdvanceStatus={handleAdvanceCourierStatus}
                onViewOrder={setSelectedOrder}
                formatPrice={formatPrice}
                formatDateTime={formatDateTime}
              />
            )}

            {activeTab === "customers" && (
              <CustomersTab
                customers={aggregatedCustomers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onViewCustomer={setSelectedCustomer}
                formatPrice={formatPrice}
                formatDate={formatDate}
              />
            )}

            {activeTab === "inventory" && (
              <InventoryTab
                products={products}
                stockFilter={inventoryStockFilter}
                setStockFilter={setInventoryStockFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onUpdateStock={handleUpdateStock}
                onAdjustStock={handleAdjustStock}
                onQuickRestockAllLow={handleQuickRestockAllLow}
                formatPrice={formatPrice}
              />
            )}
          </main>
        </div>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      <AnimatePresence>
        {productModal.isOpen && (
          <ProductFormModal
            isOpen={productModal.isOpen}
            mode={productModal.mode}
            initialProduct={productModal.product}
            onClose={() => setProductModal({ isOpen: false, mode: "add", product: null })}
            onSave={handleSaveProductModal}
          />
        )}
      </AnimatePresence>

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteProductModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteProductModal({ isOpen: false, product: null })}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white p-7 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 size={22} />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[#161311]">
                Delete Product?
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#6B5E55]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#161311]">
                  "{deleteProductModal.product?.name}"
                </span>
                ? This action will permanently remove it from your store catalog.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteProductModal({ isOpen: false, product: null })}
                  className="rounded-full border border-[#E5DED3] px-5 py-2.5 text-xs font-medium text-[#524942] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(deleteProductModal.product?.id)}
                  className="rounded-full bg-rose-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-rose-700 shadow-sm"
                >
                  Delete Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER DETAIL & COURIER TRACKING MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateOrderStatus}
            onUpdateTracking={handleUpdateTracking}
            onAdvanceStatus={handleAdvanceCourierStatus}
            formatPrice={formatPrice}
            formatDateTime={formatDateTime}
          />
        )}
      </AnimatePresence>

      {/* CUSTOMER DETAIL MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onSelectOrder={(order) => {
              setSelectedCustomer(null);
              setSelectedOrder(order);
            }}
            formatPrice={formatPrice}
            formatDate={formatDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// PILLAR 1: ANALYTICS TAB
// ============================================================

function AnalyticsTab({
  orders,
  products,
  customers,
  totalRevenue,
  prepaidCount,
  codCount,
  averageOrderValue,
  timeframe,
  setTimeframe,
  onSelectTab,
  formatPrice,
  formatDate,
  onViewOrder,
}) {
  const chartData = useMemo(() => {
    const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
    const baseAmounts = [18400, 24500, 31200, 28900, 42100, 38600, 52400];
    
    const factor = totalRevenue > 0 ? totalRevenue / 236100 : 1;
    const amounts = baseAmounts.map((a) => Math.round(a * factor));
    const max = Math.max(...amounts, 1);

    const points = amounts.map((val, idx) => {
      const x = (idx / (amounts.length - 1)) * 500;
      const y = 160 - (val / max) * 120;
      return { x, y, val, label: labels[idx] };
    });

    const pathD = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      return `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    const areaD = `${pathD} L 500 160 L 0 160 Z`;

    return { points, pathD, areaD, amounts, labels };
  }, [totalRevenue]);

  const categoryStats = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.id || p.slug === item.slug);
        const cat = prod?.category || "Skincare";
        counts[cat] = (counts[cat] || 0) + (Number(item.price) || 0) * (Number(item.quantity) || 1);
      });
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([name, revenue]) => ({
      name,
      revenue,
      percentage: Math.round((revenue / total) * 100),
    }));
  }, [orders, products]);

  // Courier partner distribution (Requirement 4)
  const courierStats = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const carrier = findCourier(o.carrier).name;
      counts[carrier] = (counts[carrier] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      courier: findCourier(name),
    }));
  }, [orders]);

  const statusStats = useMemo(() => {
    const list = [
      { status: "Order Confirmed", color: "bg-blue-500" },
      { status: "Packed", color: "bg-purple-500" },
      { status: "Package Shipped", color: "bg-indigo-500" },
      { status: "Out for Delivery", color: "bg-amber-500" },
      { status: "Delivered", color: "bg-emerald-500" },
      { status: "Cancelled", color: "bg-rose-500" },
    ];
    return list.map((item) => ({
      ...item,
      count: orders.filter((o) => o.status === item.status).length,
    }));
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
              Gross Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#C5A880]">
              <CircleDollarSign size={18} />
            </div>
          </div>
          <p className="mt-3 font-serif text-3xl font-normal text-[#161311]">
            {formatPrice(totalRevenue)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700">
            <TrendingUp size={13} />
            <span>+14.8% from last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
              Total Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#161311]">
              <ClipboardList size={18} />
            </div>
          </div>
          <p className="mt-3 font-serif text-3xl font-normal text-[#161311]">
            {orders.length}
          </p>
          <p className="mt-2 text-[11px] text-[#8C7E72]">
            Avg Order: <span className="font-semibold text-[#161311]">{formatPrice(averageOrderValue)}</span>
          </p>
        </div>

        {/* Payment Channels: Prepaid vs COD */}
        <div
          onClick={() => onSelectTab("orders")}
          className="cursor-pointer rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
              Payment Channels
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#161311]">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-serif text-2xl font-normal text-emerald-800">
              {prepaidCount} <span className="text-xs font-sans text-[#8C7E72]">Prepaid</span>
            </p>
            <span className="text-xs text-[#8C7E72]">/</span>
            <p className="font-serif text-2xl font-normal text-[#161311]">
              {codCount} <span className="text-xs font-sans text-[#8C7E72]">COD</span>
            </p>
          </div>
          <p className="mt-2 text-[11px] text-[#8C7E72]">
            View orders by mode &rarr;
          </p>
        </div>

        {/* Active Customers */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
              Customers
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#161311]">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-3 font-serif text-3xl font-normal text-[#161311]">
            {customers.length}
          </p>
          <p className="mt-2 text-[11px] text-emerald-700">
            Active luxury client base
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Revenue SVG Trend Chart (2 Cols) */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-sm backdrop-blur-xl lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                Financial Performance
              </p>
              <h2 className="mt-1 font-serif text-2xl text-[#161311]">
                Revenue & Sales Trajectory
              </h2>
            </div>
            <div className="flex rounded-full border border-[#E5DED3] bg-[#FAF7F2] p-1 text-[10px] font-medium">
              {["7days", "30days", "year"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`rounded-full px-3 py-1 uppercase tracking-wider transition ${
                    timeframe === tf
                      ? "bg-[#161311] text-[#FAF7F2]"
                      : "text-[#8C7E72] hover:text-[#161311]"
                  }`}
                >
                  {tf === "7days" ? "7D" : tf === "30days" ? "30D" : "1Y"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <svg
              viewBox="0 0 500 180"
              className="w-full h-56 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A880" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" stroke="#E5DED3" strokeDasharray="3 3" opacity="0.6" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#E5DED3" strokeDasharray="3 3" opacity="0.6" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#E5DED3" strokeWidth="1" />

              <path d={chartData.areaD} fill="url(#revenueGoldGrad)" />

              <path
                d={chartData.pathD}
                fill="none"
                stroke="#161311"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartData.points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#C5A880"
                    stroke="#161311"
                    strokeWidth="2"
                    className="transition group-hover:r-6"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill="#161311"
                    fontSize="9"
                    fontWeight="600"
                    className="opacity-0 group-hover:opacity-100 transition duration-150"
                  >
                    ₹{(pt.val / 1000).toFixed(1)}k
                  </text>
                </g>
              ))}
            </svg>

            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-wider text-[#8C7E72]">
              {chartData.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Courier Partners & Pipeline Breakdown (1 Col) */}
        <div className="space-y-6">
          {/* Respected Logistics Partners Breakdown (Requirement 4) */}
          <div className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-sm backdrop-blur-xl">
            <h3 className="font-serif text-lg text-[#161311]">Delivery Partners</h3>
            <p className="text-[10px] uppercase tracking-wider text-[#8C7E72]">
              Active courier routing
            </p>
            <div className="mt-5 space-y-3.5">
              {courierStats.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF7F2] border border-[#E5DED3] text-[#161311]">
                      <Truck size={14} className="text-[#C5A880]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#161311]">{item.name}</p>
                      <p className="text-[9px] text-[#8C7E72]">Official tracking partner</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#FAF7F2] border border-[#E5DED3] px-2.5 py-0.5 font-semibold text-xs text-[#161311]">
                    {item.count} orders
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Pipeline */}
          <div className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-sm backdrop-blur-xl">
            <h3 className="font-serif text-lg text-[#161311]">Order Pipeline</h3>
            <p className="text-[10px] uppercase tracking-wider text-[#8C7E72]">
              Status progress distribution
            </p>
            <div className="mt-4 space-y-2.5">
              {statusStats.map((st) => (
                <div key={st.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${st.color}`} />
                    <span className="text-[#524942]">{st.status}</span>
                  </div>
                  <span className="font-semibold text-[#161311]">{st.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DED3]">
          <div>
            <h3 className="font-serif text-xl text-[#161311]">Recent Activity</h3>
            <p className="text-[10px] uppercase tracking-wider text-[#8C7E72]">
              Latest customer transactions & courier partners
            </p>
          </div>
          <button
            onClick={() => onSelectTab("orders")}
            className="text-xs font-medium uppercase tracking-wider text-[#C5A880] hover:text-[#161311]"
          >
            View All Orders &rarr;
          </button>
        </div>

        <div className="mt-4 divide-y divide-[#E5DED3]">
          {orders.slice(0, 5).map((order) => {
            const isCod = (order.paymentMethod || "").toLowerCase() === "cod";
            const courier = findCourier(order.carrier);

            return (
              <div
                key={order.id}
                onClick={() => onViewOrder(order)}
                className="flex cursor-pointer items-center justify-between py-3.5 transition hover:bg-[#FAF7F2]/50 px-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#161311]/5 text-[#161311]">
                    <Package size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#161311]">
                      #{order.id} &bull; {order.customer?.name || "Customer"}
                    </p>
                    <p className="text-[11px] text-[#8C7E72]">
                      {courier.name} &bull; {order.items?.length || 1} items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                      isCod
                        ? "bg-[#161311] text-[#FAF7F2]"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isCod ? "COD" : "Prepaid"}
                  </span>
                  <span className="text-xs font-serif font-medium text-[#161311]">
                    {formatPrice(order.total)}
                  </span>
                  <span className="rounded-full bg-[#FAF7F2] border border-[#E5DED3] px-2.5 py-0.5 text-[9px] font-semibold text-[#524942]">
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PILLAR 2: PRODUCTS TAB (CATALOG & MULTI-IMAGE MANAGEMENT)
// ============================================================

function ProductsTab({
  products,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  formatPrice,
}) {
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === "all" ||
        (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.slug && p.slug.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7E72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, category, or slug..."
            className="h-11 w-full rounded-2xl border border-[#E5DED3] bg-white pl-11 pr-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#8C7E72]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 rounded-2xl border border-[#E5DED3] bg-white px-3 text-xs text-[#161311] outline-none focus:border-[#161311]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 rounded-2xl bg-[#161311] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#FAF7F2] transition hover:bg-[#38312B]"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DED3] bg-[#FAF7F2]/60 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Badges</th>
                <th className="py-4 px-4">Images</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED3] text-xs">
              {filteredProducts.map((product) => {
                const imageCount = Array.isArray(product.images) ? product.images.length : (product.image ? 1 : 0);
                const stockNum = Number(product.stock) || 0;

                return (
                  <tr key={product.id} className="transition hover:bg-[#FAF7F2]/40">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FAF7F2]">
                          <img
                            src={product.image || (product.images && product.images[0]) || ""}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#161311]">{product.name}</p>
                          <p className="text-[10px] text-[#8C7E72]">/{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="rounded-full bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-medium text-[#524942]">
                        {product.category || "Skincare"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-serif font-medium text-[#161311]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="ml-1.5 text-[10px] text-[#8C7E72] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {stockNum <= 0 ? (
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-semibold text-rose-800">
                          Out of Stock (0)
                        </span>
                      ) : stockNum <= 10 ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
                          Low Stock ({stockNum})
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                          In Stock ({stockNum})
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <span className="rounded-full bg-[#C5A880]/20 px-2 py-0.5 text-[9px] font-semibold text-[#73582A]">
                            Featured
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="rounded-full bg-[#161311] px-2 py-0.5 text-[9px] font-semibold text-[#FAF7F2]">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#524942]">
                        <ImageIcon size={13} className="text-[#C5A880]" />
                        {imageCount} {imageCount === 1 ? "photo" : "photos"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5DED3] text-[#8C7E72] transition hover:border-[#161311] hover:text-[#161311]"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          onClick={() => onEditProduct(product)}
                          title="Edit Product"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5DED3] text-[#161311] transition hover:bg-[#FAF7F2]"
                        >
                          <Settings size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product)}
                          title="Delete Product"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PILLAR 3: ORDERS TAB (FULL LIFECYCLE & MULTI-COURIER SELECTION)
// ============================================================

function OrdersTab({
  orders,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onUpdateStatus,
  onUpdateCourier,
  onAdvanceStatus,
  onViewOrder,
  formatPrice,
  formatDateTime,
}) {
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const isCod = (order.paymentMethod || "").toLowerCase() === "cod";

      if (statusFilter === "prepaid") {
        if (isCod) return false;
      } else if (statusFilter === "cod") {
        if (!isCod) return false;
      } else if (statusFilter !== "all") {
        if (order.status !== statusFilter) return false;
      }

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      const orderId = String(order.id || "").toLowerCase();
      const customerName = (order.customer?.name || "").toLowerCase();
      const customerEmail = (order.customerEmail || order.customer?.email || "").toLowerCase();
      const carrierName = (order.carrier || "").toLowerCase();
      const trackingNumber = (order.trackingNumber || "").toLowerCase();

      return (
        orderId.includes(q) ||
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        carrierName.includes(q) ||
        trackingNumber.includes(q)
      );
    });
  }, [orders, statusFilter, searchQuery]);

  const filterTabs = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "prepaid",
      label: "Prepaid",
      count: orders.filter((o) => (o.paymentMethod || "").toLowerCase() !== "cod").length,
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "cod",
      label: "COD",
      count: orders.filter((o) => (o.paymentMethod || "").toLowerCase() === "cod").length,
      badgeColor: "bg-[#161311] text-[#FAF7F2]",
    },
    { id: "Order Confirmed", label: "Confirmed", count: orders.filter((o) => o.status === "Order Confirmed").length },
    { id: "Packed", label: "Packed", count: orders.filter((o) => o.status === "Packed").length },
    { id: "Package Shipped", label: "Shipped", count: orders.filter((o) => o.status === "Package Shipped").length },
    { id: "Out for Delivery", label: "Out for Delivery", count: orders.filter((o) => o.status === "Out for Delivery").length },
    { id: "Delivered", label: "Delivered", count: orders.filter((o) => o.status === "Delivered").length },
    { id: "Cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length },
  ];

  return (
    <div className="space-y-6">
      {/* Status Tabs Ribbon */}
      <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-medium transition ${
                isActive
                  ? "bg-[#161311] text-[#FAF7F2] shadow-sm"
                  : "border border-[#E5DED3] bg-white text-[#524942] hover:bg-[#FAF7F2]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  isActive
                    ? "bg-white/20 text-[#FAF7F2]"
                    : tab.badgeColor
                    ? tab.badgeColor
                    : "bg-[#E5DED3] text-[#524942]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7E72]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID, customer, courier partner, or tracking AWB..."
          className="h-11 w-full rounded-2xl border border-[#E5DED3] bg-white pl-11 pr-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
        />
      </div>

      {/* Orders Table with Respected Couriers (Requirement 4) */}
      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DED3] bg-[#FAF7F2]/60 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
                <th className="py-4 px-6">Order ID & Date</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Courier Partner</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Delivery Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED3] text-xs">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isCod = (order.paymentMethod || "").toLowerCase() === "cod";
                  const currentCourier = findCourier(order.carrier);

                  return (
                    <tr key={order.id} className="transition hover:bg-[#FAF7F2]/40">
                      {/* ID & Date */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-[#161311]">#{order.id}</p>
                        <p className="text-[10px] text-[#8C7E72]">
                          {formatDateTime(order.date || order.createdAt)}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className="font-medium text-[#161311]">
                          {order.customer?.name || "Customer"}
                        </p>
                        <p className="text-[10px] text-[#8C7E72]">{order.customerEmail || order.customer?.email}</p>
                      </td>

                      {/* REQUIREMENT 4: MULTI-COURIER SELECTION IN TABLE */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <select
                            value={currentCourier.name}
                            onChange={(e) => onUpdateCourier(order.id, e.target.value)}
                            className="h-8 rounded-xl border border-[#E5DED3] bg-white px-2.5 text-[11px] font-medium text-[#161311] outline-none hover:border-[#161311]"
                          >
                            {COURIER_PARTNERS.map((cp) => (
                              <option key={cp.id} value={cp.name}>
                                {cp.name}
                              </option>
                            ))}
                          </select>
                          {order.trackingNumber && (
                            <div className="flex items-center gap-1.5 text-[10px] text-[#8C7E72]">
                              <span className="font-mono">{order.trackingNumber}</span>
                              <a
                                href={getCourierTrackingUrl(order.carrier, order.trackingNumber)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open Courier Tracking Portal"
                                className="text-[#C5A880] hover:text-[#161311]"
                              >
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-serif font-medium text-[#161311]">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment Method Badge: PREPAID or COD ONLY */}
                      <td className="py-4 px-4">
                        {isCod ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#161311] px-3 py-1 text-[10px] font-semibold text-[#FAF7F2]">
                            <Banknote size={12} className="text-[#C5A880]" />
                            COD
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-800">
                            <CreditCard size={12} className="text-emerald-700" />
                            Prepaid
                          </span>
                        )}
                      </td>

                      {/* Delivery Status Dropdown & Auto-advance button */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status || "Order Confirmed"}
                            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-medium outline-none transition ${
                              order.status === "Delivered"
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : order.status === "Cancelled"
                                ? "border-rose-300 bg-rose-50 text-rose-800"
                                : "border-[#E5DED3] bg-white text-[#161311]"
                            }`}
                          >
                            {ORDER_DELIVERY_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          {order.status !== "Delivered" && order.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStatus(order.id)}
                              title="Advance delivery via Courier simulation"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5DED3] bg-[#FAF7F2] text-[#161311] hover:bg-[#161311] hover:text-white transition"
                            >
                              <ChevronRight size={13} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="rounded-xl border border-[#E5DED3] px-3.5 py-1.5 text-xs font-medium text-[#161311] transition hover:bg-[#FAF7F2]"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C7E72]">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PILLAR 4: CUSTOMERS TAB (VIP TIERS & DETAIL VIEW)
// ============================================================

function CustomersTab({
  customers,
  searchQuery,
  setSearchQuery,
  onViewCustomer,
  formatPrice,
  formatDate,
}) {
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7E72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="h-11 w-full rounded-2xl border border-[#E5DED3] bg-white pl-11 pr-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
          />
        </div>
        <p className="text-xs text-[#8C7E72]">
          Total Registered & Guest Clients: <span className="font-semibold text-[#161311]">{customers.length}</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DED3] bg-[#FAF7F2]/60 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Total Orders</th>
                <th className="py-4 px-4">Lifetime Spend</th>
                <th className="py-4 px-4">Tier Badge</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED3] text-xs">
              {filteredCustomers.map((cust) => {
                const initials = cust.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr key={cust.id} className="transition hover:bg-[#FAF7F2]/40">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#161311] font-medium text-xs text-[#FAF7F2]">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-[#161311]">{cust.name}</p>
                          <p className="text-[10px] text-[#8C7E72]">
                            Member since {formatDate(cust.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-[#161311]">{cust.email}</p>
                      <p className="text-[10px] text-[#8C7E72]">{cust.phone}</p>
                    </td>

                    <td className="py-4 px-4 font-medium text-[#161311]">
                      {cust.ordersCount} {cust.ordersCount === 1 ? "order" : "orders"}
                    </td>

                    <td className="py-4 px-4 font-serif font-medium text-[#161311]">
                      {formatPrice(cust.totalSpend)}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                          cust.tier === "VIP Elite"
                            ? "bg-[#C5A880]/20 text-[#73582A] border border-[#C5A880]/40"
                            : cust.tier === "Gold Member"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-[#FAF7F2] text-[#524942]"
                        }`}
                      >
                        {cust.tier}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onViewCustomer(cust)}
                        className="rounded-xl border border-[#E5DED3] px-3.5 py-1.5 text-xs font-medium text-[#161311] transition hover:bg-[#FAF7F2]"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PILLAR 5: INVENTORY TAB (STOCK STEPPERS & QUICK RESTOCK)
// ============================================================

function InventoryTab({
  products,
  stockFilter,
  setStockFilter,
  searchQuery,
  setSearchQuery,
  onUpdateStock,
  onAdjustStock,
  onQuickRestockAllLow,
  formatPrice,
}) {
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const stock = Number(p.stock) || 0;
      if (stockFilter === "low" && (stock <= 0 || stock > 10)) return false;
      if (stockFilter === "out" && stock > 0) return false;
      if (stockFilter === "healthy" && stock <= 10) return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    });
  }, [products, stockFilter, searchQuery]);

  const totalUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  }, [products]);

  const lowCount = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 10).length;
  const outCount = products.filter((p) => Number(p.stock) <= 0).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
            Total SKUs
          </p>
          <p className="mt-2 font-serif text-3xl text-[#161311]">{products.length}</p>
          <p className="mt-1 text-[11px] text-[#8C7E72]">Live catalog products</p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
            Warehouse Units
          </p>
          <p className="mt-2 font-serif text-3xl text-[#161311]">{totalUnits}</p>
          <p className="mt-1 text-[11px] text-emerald-700">Total units on hand</p>
        </div>

        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-6 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-900">
            Low Stock Alerts
          </p>
          <p className="mt-2 font-serif text-3xl text-amber-950">{lowCount}</p>
          <p className="mt-1 text-[11px] text-amber-800">10 units or fewer</p>
        </div>

        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/70 p-6 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-900">
            Out of Stock
          </p>
          <p className="mt-2 font-serif text-3xl text-rose-950">{outCount}</p>
          <p className="mt-1 text-[11px] text-rose-800">0 units remaining</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7E72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter SKUs by product name or category..."
            className="h-11 w-full rounded-2xl border border-[#E5DED3] bg-white pl-11 pr-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Items" },
            { id: "low", label: "Low Stock" },
            { id: "out", label: "Out of Stock" },
            { id: "healthy", label: "Healthy Stock" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-medium transition ${
                stockFilter === tab.id
                  ? "bg-[#161311] text-[#FAF7F2]"
                  : "border border-[#E5DED3] bg-white text-[#524942] hover:bg-[#FAF7F2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DED3] bg-[#FAF7F2]/60 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7E72]">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock Status</th>
                <th className="py-4 px-4">Inline Stepper</th>
                <th className="py-4 px-6 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED3] text-xs">
              {filteredProducts.map((product) => {
                const stockNum = Number(product.stock) || 0;

                return (
                  <tr key={product.id} className="transition hover:bg-[#FAF7F2]/40">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || (product.images && product.images[0]) || ""}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl border border-[#E5DED3] object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#161311]">{product.name}</p>
                          <p className="text-[10px] text-[#8C7E72]">
                            {product.category || "Skincare"} &bull; /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-serif font-medium text-[#161311]">
                      {formatPrice(product.price)}
                    </td>

                    <td className="py-4 px-4">
                      {stockNum <= 0 ? (
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-semibold text-rose-800">
                          Out of Stock (0)
                        </span>
                      ) : stockNum <= 10 ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
                          Low Stock ({stockNum})
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                          In Stock ({stockNum})
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAdjustStock(product.id, -1)}
                          disabled={stockNum <= 0}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5DED3] bg-white text-[#161311] transition hover:bg-[#FAF7F2] disabled:opacity-30"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={stockNum}
                          onChange={(e) => onUpdateStock(product.id, e.target.value)}
                          className="h-8 w-16 rounded-xl border border-[#E5DED3] bg-white text-center font-medium text-xs text-[#161311] outline-none focus:border-[#161311]"
                        />
                        <button
                          type="button"
                          onClick={() => onAdjustStock(product.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5DED3] bg-white text-[#161311] transition hover:bg-[#FAF7F2]"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAdjustStock(product.id, 10)}
                          className="rounded-xl border border-[#E5DED3] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#161311] hover:bg-[#FAF7F2]"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdjustStock(product.id, 25)}
                          className="rounded-xl border border-[#E5DED3] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#161311] hover:bg-[#FAF7F2]"
                        >
                          +25
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdjustStock(product.id, 50)}
                          className="rounded-xl bg-[#161311] px-2.5 py-1 text-[11px] font-semibold text-[#FAF7F2] hover:bg-[#38312B]"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: PRODUCT FORM (WITH MULTIPLE IMAGE MANAGER)
// ============================================================

function ProductFormModal({ isOpen, mode, initialProduct, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: initialProduct?.id || Date.now(),
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    category: initialProduct?.category || "Face Oil",
    price: initialProduct?.price || "",
    originalPrice: initialProduct?.originalPrice || "",
    stock: initialProduct?.stock !== undefined ? initialProduct.stock : 25,
    rating: initialProduct?.rating || 4.8,
    reviews: initialProduct?.reviews || 16,
    description: initialProduct?.description || "",
    benefits: Array.isArray(initialProduct?.benefits)
      ? initialProduct.benefits.join(", ")
      : "Deep hydration, Barrier support",
    featured: !!initialProduct?.featured,
    bestSeller: !!initialProduct?.bestSeller,
    images: Array.isArray(initialProduct?.images) && initialProduct.images.length > 0
      ? [...initialProduct.images]
      : initialProduct?.image
      ? [initialProduct.image]
      : [],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...prev.images];
      const [item] = copy.splice(index, 1);
      return {
        ...prev,
        images: [item, ...copy],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const benefitList = formData.benefits
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      benefits: benefitList,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/80 bg-white p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-6 border-b border-[#E5DED3]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Catalog Management
            </span>
            <h2 className="mt-1 font-serif text-2xl text-[#161311]">
              {mode === "add" ? "Add New Luxury Product" : "Edit Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DED3] text-[#8C7E72] hover:text-[#161311]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="rounded-2xl border border-[#E5DED3] bg-[#FAF7F2]/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-[#161311] uppercase tracking-wider">
                  Product Images Gallery ({formData.images.length})
                </label>
                <p className="mt-0.5 text-[11px] text-[#8C7E72]">
                  Add multiple images. The first image will be set as the Primary storefront thumbnail.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {formData.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-[#E5DED3] bg-white shadow-sm"
                >
                  <img src={imgUrl} alt="Product view" className="h-full w-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-[#161311] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#FAF7F2]">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 transition group-hover:opacity-100 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="rounded-lg bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#161311] hover:bg-white"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="rounded-lg bg-rose-600 px-2 py-1 text-[9px] font-semibold text-white hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C5A880] bg-white/60 p-4 text-center transition hover:bg-white"
              >
                <Upload size={20} className="text-[#C5A880]" />
                <span className="mt-2 text-[10px] font-medium text-[#161311]">
                  Upload from PC
                </span>
                <span className="text-[9px] text-[#8C7E72]">Click to browse</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="mt-4 flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image URL here..."
                className="h-10 flex-1 rounded-xl border border-[#E5DED3] bg-white px-3 text-xs outline-none focus:border-[#161311]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="rounded-xl border border-[#161311] bg-white px-4 text-xs font-medium text-[#161311] hover:bg-[#161311] hover:text-white"
              >
                Add URL
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                Product Title *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleTextChange}
                placeholder="e.g. Celestial Night Renewal Elixir"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleTextChange}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-3 text-xs text-[#161311] outline-none focus:border-[#161311]"
              >
                <option value="Face Oil">Face Oil</option>
                <option value="Moisturiser">Moisturiser</option>
                <option value="Sunscreen">Sunscreen</option>
                <option value="Cleanser">Cleanser</option>
                <option value="Serum">Serum</option>
                <option value="Treatment">Treatment</option>
                <option value="Body Care">Body Care</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={formData.price}
                onChange={handleTextChange}
                placeholder="899"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                MRP / Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                min="1"
                value={formData.originalPrice}
                onChange={handleTextChange}
                placeholder="1099"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                Inventory Stock Units *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleTextChange}
                placeholder="30"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleTextChange}
                placeholder="auto-generated-from-title"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                Key Benefits (comma separated)
              </label>
              <input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleTextChange}
                placeholder="Deep hydration, Skin barrier support, Lightweight finish"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5DED3] bg-transparent px-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#524942]">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleTextChange}
                placeholder="Describe the skincare formulation, ritual, and key botanical ingredients..."
                className="mt-1.5 w-full rounded-xl border border-[#E5DED3] bg-transparent p-4 text-xs text-[#161311] outline-none focus:border-[#161311]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleTextChange}
                className="h-4 w-4 rounded accent-[#161311]"
              />
              <span className="text-xs text-[#161311]">Featured on Homepage</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleTextChange}
                className="h-4 w-4 rounded accent-[#161311]"
              />
              <span className="text-xs text-[#161311]">Mark as Best Seller</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E5DED3]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#E5DED3] px-6 py-2.5 text-xs font-medium text-[#524942] hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#161311] px-8 py-2.5 text-xs font-medium uppercase tracking-wider text-[#FAF7F2] transition hover:bg-[#38312B] shadow-sm"
            >
              {mode === "add" ? "Save Product" : "Update Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODAL: ORDER DETAILS & COURIER PIPELINE STATUS (REQUIREMENT 4)
// ============================================================

function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onUpdateTracking,
  onAdvanceStatus,
  formatPrice,
  formatDateTime,
}) {
  const [carrierInput, setCarrierInput] = useState(order.carrier || "Blue Dart Express");
  const [trackingInput, setTrackingInput] = useState(order.trackingNumber || "");

  const isCod = (order.paymentMethod || "").toLowerCase() === "cod";
  const currentCourier = findCourier(carrierInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E5DED3]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-[#161311]">Order #{order.id}</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                  order.status === "Delivered"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.status === "Cancelled"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-[#161311] text-[#FAF7F2]"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#8C7E72]">
              Placed on {formatDateTime(order.date || order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DED3] text-[#8C7E72] hover:text-[#161311]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Dropdown Management & Courier Partner Selection (Requirement 4) */}
        <div className="mt-6 rounded-2xl border border-[#E5DED3] bg-[#FAF7F2]/50 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
                Delivery Pipeline Status
              </p>
              <p className="text-xs text-[#161311]">
                Update customer order progress in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={order.status || "Order Confirmed"}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="rounded-xl border border-[#161311] bg-white px-4 py-2 text-xs font-medium text-[#161311] outline-none"
              >
                {ORDER_DELIVERY_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {order.status !== "Delivered" && (
                <button
                  type="button"
                  onClick={() => onAdvanceStatus(order.id)}
                  title="Simulate Next Delivery Checkpoint"
                  className="rounded-xl bg-[#161311] px-3 py-2 text-xs font-medium text-white hover:bg-[#38312B]"
                >
                  Advance Status &rarr;
                </button>
              )}
            </div>
          </div>

          {/* REQUIREMENT 4: MULTI-COURIER SELECTION (Blue Dart, ST Courier, Professional Courier, etc.) */}
          <div className="pt-4 border-t border-[#E5DED3]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72] mb-2">
              Select Respected Courier Partner
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={carrierInput}
                onChange={(e) => {
                  const newCarrier = e.target.value;
                  setCarrierInput(newCarrier);
                  if (!trackingInput) {
                    const sampleAwb = generateTrackingNumber(newCarrier);
                    setTrackingInput(sampleAwb);
                  }
                }}
                className="h-10 rounded-xl border border-[#E5DED3] bg-white px-3 text-xs font-medium text-[#161311] outline-none focus:border-[#161311]"
              >
                {COURIER_PARTNERS.map((cp) => (
                  <option key={cp.id} value={cp.name}>
                    {cp.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Tracking AWB Number"
                className="h-10 flex-1 min-w-[150px] rounded-xl border border-[#E5DED3] bg-white px-3 text-xs outline-none focus:border-[#161311]"
              />

              <button
                type="button"
                onClick={() => onUpdateTracking(order.id, carrierInput, trackingInput)}
                className="h-10 rounded-xl bg-[#161311] px-4 text-xs font-medium text-[#FAF7F2] hover:bg-[#38312B]"
              >
                Save Courier
              </button>
            </div>

            {trackingInput && (
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#8C7E72]">
                <span>Customer can track on {currentCourier.name} portal</span>
                <a
                  href={getCourierTrackingUrl(carrierInput, trackingInput)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#C5A880] hover:text-[#161311] font-medium"
                >
                  <span>Open {currentCourier.shortCode} Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E5DED3] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
              Customer Details
            </p>
            <p className="mt-2 font-medium text-xs text-[#161311]">
              {order.customer?.name || "Customer"}
            </p>
            <p className="mt-1 text-xs text-[#524942]">
              {order.customerEmail || order.customer?.email}
            </p>
            <p className="mt-1 text-xs text-[#524942]">{order.customer?.phone || "-"}</p>
          </div>

          <div className="rounded-2xl border border-[#E5DED3] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
              Shipping Address
            </p>
            <p className="mt-2 text-xs leading-5 text-[#524942]">
              {order.shipping?.address || "Address not provided"}
              {order.shipping?.apartment && <>, {order.shipping.apartment}</>}
              <br />
              {order.shipping?.city}, {order.shipping?.state} - {order.shipping?.pincode}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
            Items Ordered
          </p>
          <div className="mt-3 divide-y divide-[#E5DED3] rounded-2xl border border-[#E5DED3]">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl border border-[#E5DED3] object-cover"
                  />
                  <div>
                    <p className="font-medium text-xs text-[#161311]">{item.name}</p>
                    <p className="text-[11px] text-[#8C7E72]">
                      Qty: {item.quantity} &bull; {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
                <span className="font-serif font-medium text-xs text-[#161311]">
                  {formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="mt-6 border-t border-[#E5DED3] pt-5 space-y-2">
          <div className="flex justify-between text-xs text-[#524942]">
            <span>Payment Mode:</span>
            <span className="font-semibold text-[#161311]">
              {isCod ? "Cash on Delivery (COD)" : "Prepaid (Online Payment)"}
            </span>
          </div>
          <div className="flex justify-between text-xs text-[#524942]">
            <span>Payment Status:</span>
            <span className="font-semibold text-[#161311]">
              {isCod ? (order.status === "Delivered" ? "Paid" : "Pay on Delivery") : "Paid"}
            </span>
          </div>
          <div className="flex justify-between text-xs text-[#524942]">
            <span>Luxury Shipping:</span>
            <span className="text-emerald-700">Complimentary</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E5DED3] text-base font-serif font-medium text-[#161311]">
            <span>Total:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODAL: CUSTOMER PROFILE & ORDER HISTORY
// ============================================================

function CustomerDetailModal({ customer, onClose, onSelectOrder, formatPrice, formatDate }) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-6 border-b border-[#E5DED3]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#161311] font-serif text-lg text-[#FAF7F2]">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl text-[#161311]">{customer.name}</h2>
                <span className="rounded-full bg-[#C5A880]/20 px-2.5 py-0.5 text-[9px] font-semibold text-[#73582A]">
                  {customer.tier}
                </span>
              </div>
              <p className="text-xs text-[#8C7E72]">{customer.email}</p>
              {customer.phone && <p className="text-xs text-[#8C7E72]">{customer.phone}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DED3] text-[#8C7E72] hover:text-[#161311]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#E5DED3] p-4 text-center">
            <p className="text-[9px] uppercase tracking-wider text-[#8C7E72]">Lifetime Spend</p>
            <p className="mt-1 font-serif text-xl text-[#161311]">
              {formatPrice(customer.totalSpend)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E5DED3] p-4 text-center">
            <p className="text-[9px] uppercase tracking-wider text-[#8C7E72]">Total Orders</p>
            <p className="mt-1 font-serif text-xl text-[#161311]">{customer.ordersCount}</p>
          </div>
          <div className="rounded-2xl border border-[#E5DED3] p-4 text-center">
            <p className="text-[9px] uppercase tracking-wider text-[#8C7E72]">Member Since</p>
            <p className="mt-1 font-serif text-sm text-[#161311]">
              {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        {customer.addresses && customer.addresses.length > 0 && (
          <div className="mt-6 rounded-2xl border border-[#E5DED3] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
              Saved Shipping Destinations
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-[#524942]">
              {customer.addresses.map((addr, i) => (
                <li key={i} className="flex items-start gap-2">
                  <MapPin size={13} className="mt-0.5 shrink-0 text-[#C5A880]" />
                  <span>{addr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7E72]">
            Purchase History ({customer.orders.length})
          </p>
          <div className="mt-3 divide-y divide-[#E5DED3] rounded-2xl border border-[#E5DED3]">
            {customer.orders.length > 0 ? (
              customer.orders.map((order) => {
                const isCod = (order.paymentMethod || "").toLowerCase() === "cod";
                const courier = findCourier(order.carrier);

                return (
                  <div
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-[#FAF7F2]"
                  >
                    <div>
                      <p className="font-semibold text-xs text-[#161311]">#{order.id}</p>
                      <p className="text-[10px] text-[#8C7E72]">
                        {courier.name} &bull; {formatDate(order.date || order.createdAt)} &bull; {order.items?.length || 1} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider ${
                          isCod ? "bg-[#161311] text-[#FAF7F2]" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isCod ? "COD" : "Prepaid"}
                      </span>
                      <span className="font-serif font-medium text-xs text-[#161311]">
                        {formatPrice(order.total)}
                      </span>
                      <span className="rounded-full bg-[#161311] px-2.5 py-0.5 text-[9px] font-semibold text-[#FAF7F2]">
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-4 text-center text-xs text-[#8C7E72]">No orders recorded yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
