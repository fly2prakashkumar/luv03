export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  category: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
