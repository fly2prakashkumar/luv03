import type { Product } from './types';

const products: Product[] = [
  {
    id: '1',
    name: 'Radiant Glow Serum',
    description: 'A potent Vitamin C serum to brighten and even out skin tone, leaving your skin with a radiant glow.',
    price: 1250.00,
    imageId: 'product-1',
    category: 'Skin care'
  },
  {
    id: '2',
    name: 'Hydro-Boost Moisturizer',
    description: 'A lightweight, oil-free moisturizer with hyaluronic acid that provides long-lasting hydration without clogging pores.',
    price: 850.00,
    imageId: 'product-2',
    category: 'Skin care'
  },
  {
    id: '3',
    name: 'Gentle Purifying Cleanser',
    description: 'A mild, soap-free cleanser that effectively removes impurities and makeup without stripping the skin\'s natural moisture.',
    price: 600.00,
    imageId: 'product-3',
    category: 'Skin care'
  },
  {
    id: '4',
    name: 'Revitalizing Eye Cream',
    description: 'A rich eye cream that targets dark circles, puffiness, and fine lines, infused with caffeine and peptides.',
    price: 950.00,
    imageId: 'product-4',
    category: 'Skin care'
  },
  {
    id: '5',
    name: 'Vitamin C Brightening Toner',
    description: 'An alcohol-free toner that refines pores and a stable form of Vitamin C and antioxidants.',
    price: 700.00,
    imageId: 'product-5',
    category: 'Skin care'
  },
  {
    id: '6',
    name: 'Sun-Kissed SPF 50 Sunscreen',
    description: 'A broad-spectrum mineral sunscreen that provides high protection with a lightweight, non-greasy finish.',
    price: 750.00,
    imageId: 'product-6',
    category: 'Skin care'
  },
  {
    id: '7',
    name: 'Overnight Repair Night Cream',
    description: 'A deeply nourishing night cream with retinol and ceramides to repair and regenerate skin while you sleep.',
    price: 1450.00,
    imageId: 'product-7',
    category: 'Skin care'
  },
  {
    id: '8',
    name: 'Detoxifying Clay Mask',
    description: 'A weekly treatment mask with kaolin clay and charcoal to draw out impurities and reduce the appearance of pores.',
    price: 900.00,
    imageId: 'product-8',
    category: 'Skin care'
  },
  {
    id: '9',
    name: 'Soothing Aloe Handwash',
    description: 'A gentle handwash that cleanses without drying, leaving hands soft and refreshed.',
    price: 450.00,
    imageId: 'product-9',
    category: 'Handwash'
  },
  {
    id: '10',
    name: 'Mint Fresh Toothpaste',
    description: 'A fluoride-free toothpaste that naturally whitens teeth and freshens breath.',
    price: 350.00,
    imageId: 'product-10',
    category: 'Toothpaste'
  },
  {
    id: '11',
    name: 'Nourishing Body Wash',
    description: 'A rich and creamy body wash that moisturizes and soothes the skin.',
    price: 650.00,
    imageId: 'product-11',
    category: 'Bath & Body'
  },
  {
    id: '12',
    name: 'Strengthening Shampoo',
    description: 'A sulfate-free shampoo that strengthens hair and reduces breakage.',
    price: 750.00,
    imageId: 'product-12',
    category: 'Bath & Body'
  }
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category.toLowerCase().replace(/&/g, 'and') === category.toLowerCase().replace(/&/g, 'and'));
}

export function getFeaturedProducts(count: number): Product[] {
  return products.slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
  );
}
