
export type Product = {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
};

export type CartItem = {
  product: Product & { id: string };
  quantity: number;
};
