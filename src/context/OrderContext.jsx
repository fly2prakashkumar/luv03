import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const OrderContext = createContext(null);

const STORAGE_KEY = "luv03-orders";

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);

      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error("Could not load orders:", error);

      return [];
    }
  });


  // Save orders whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error("Could not save orders:", error);
    }
  }, [orders]);


  // Create a new order
  const createOrder = (orderData) => {
    const order = {
      id: `LUV03-${Date.now()}`,

      createdAt: new Date().toISOString(),

      status: "confirmed",

      ...orderData,
    };

    setOrders((currentOrders) => [
      order,
      ...currentOrders,
    ]);

    return order;
  };


  // Find an order by ID
  const getOrderById = (orderId) => {
    return orders.find(
      (order) => order.id === orderId
    );
  };


  // Delete an order
  const removeOrder = (orderId) => {
    setOrders((currentOrders) =>
      currentOrders.filter(
        (order) => order.id !== orderId
      )
    );
  };


  // Clear all orders
  const clearOrders = () => {
    setOrders([]);
  };


  // Total number of orders
  const orderCount = useMemo(() => {
    return orders.length;
  }, [orders]);


  const value = {
    orders,
    orderCount,
    createOrder,
    getOrderById,
    removeOrder,
    clearOrders,
  };


  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}


// Custom hook
export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside OrderProvider"
    );
  }

  return context;
}