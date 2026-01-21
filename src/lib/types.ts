
export type Product = {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  stock: number;
};

export type CartItem = {
  product: Product & { id: string };
  quantity: number;
};

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrls: string[];
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

export type Order = {
  id: string; // Firestore document ID
  userAccountId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  orderDate: {
    seconds: number;
    nanoseconds: number;
  }; // Firestore Timestamp
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled';
};
