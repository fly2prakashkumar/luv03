import type { Product } from './types';

const products: Product[] = [
  {
    id: '1',
    name: 'Radiant Glow Serum',
    description: 'A potent Vitamin C serum to brighten and even out skin tone, leaving your skin with a radiant glow.',
    price: 75.00,
    imageId: 'product-1',
    category: 'Serums'
  },
  {
    id: '2',
    name: 'Hydro-Boost Moisturizer',
    description: 'A lightweight, oil-free moisturizer with hyaluronic acid that provides long-lasting hydration without clogging pores.',
    price: 50.00,
    imageId: 'product-2',
    category: 'Moisturizers'
  },
  {
    id: '3',
    name: 'Gentle Purifying Cleanser',
    description: 'A mild, soap-free cleanser that effectively removes impurities and makeup without stripping the skin\'s natural moisture.',
    price: 35.00,
    imageId: 'product-3',
    category: 'Cleansers'
  },
  {
    id: '4',
    name: 'Revitalizing Eye Cream',
    description: 'A rich eye cream that targets dark circles, puffiness, and fine lines, infused with caffeine and peptides.',
    price: 60.00,
    imageId: 'product-4',
    category: 'Eye Care'
  },
  {
    id: '5',
    name: 'Vitamin C Brightening Toner',
    description: 'An alcohol-free toner that refines pores and brightens the complexion with a stable form of Vitamin C and antioxidants.',
    price: 40.00,
    imageId: 'product-5',
    category: 'Toners'
  },
  {
    id: '6',
    name: 'Sun-Kissed SPF 50 Sunscreen',
    description: 'A broad-spectrum mineral sunscreen that provides high protection with a lightweight, non-greasy finish.',
    price: 45.00,
    imageId: 'product-6',
    category: 'Sunscreen'
  },
  {
    id: '7',
    name: 'Overnight Repair Night Cream',
    description: 'A deeply nourishing night cream with retinol and ceramides to repair and regenerate skin while you sleep.',
    price: 85.00,
    imageId: 'product-7',
    category: 'Moisturizers'
  },
  {
    id: '8',
    name: 'Detoxifying Clay Mask',
    description: 'A weekly treatment mask with kaolin clay and charcoal to draw out impurities and reduce the appearance of pores.',
    price: 55.00,
    imageId: 'product-8',
    category: 'Masks'
  }
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getFeaturedProducts(count: number): Product[] {
  return [...products].sort(() => 0.5 - Math.random()).slice(0, count);
}
