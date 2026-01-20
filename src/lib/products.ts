import type { Product } from './types';

const products: Product[] = [
  {
    id: '1',
    name: 'Radiant Glow Serum',
    description: 'A potent Vitamin C serum to brighten and even out skin tone, leaving your skin with a radiant glow.',
    price: 1250.00,
    imageUrl: 'https://images.unsplash.com/photo-1699373381667-a325cbf60dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzZXJ1bSUyMGJvdHRsZXxlbnwwfHx8fDE3Njc1NjE3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '2',
    name: 'Hydro-Boost Moisturizer',
    description: 'A lightweight, oil-free moisturizer with hyaluronic acid that provides long-lasting hydration without clogging pores.',
    price: 850.00,
    imageUrl: 'https://images.unsplash.com/photo-1667242003558-e42942d2b911?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjcmVhbSUyMGphcnxlbnwwfHx8fDE3Njc1OTQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '3',
    name: 'Gentle Purifying Cleanser',
    description: 'A mild, soap-free cleanser that effectively removes impurities and makeup without stripping the skin\'s natural moisture.',
    price: 600.00,
    imageUrl: 'https://images.unsplash.com/photo-1642429948029-19d6dadcea5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjbGVhbnNlciUyMGJvdHRsZXxlbnwwfHx8fDE3Njc1OTQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '4',
    name: 'Revitalizing Eye Cream',
    description: 'A rich eye cream that targets dark circles, puffiness, and fine lines, infused with caffeine and peptides.',
    price: 950.00,
    imageUrl: 'https://images.unsplash.com/photo-1711280219887-c0fd5fcada0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZXllJTIwY3JlYW18ZW58MHx8fHwxNzY3NjIwMTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '5',
    name: 'Vitamin C Brightening Toner',
    description: 'An alcohol-free toner that refines pores and a stable form of Vitamin C and antioxidants.',
    price: 700.00,
    imageUrl: 'https://images.unsplash.com/photo-1556227703-ab57dbc6f839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0b25lciUyMGJvdHRsZXxlbnwwfHx8fDE3Njc2MjExNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '6',
    name: 'Sun-Kissed SPF 50 Sunscreen',
    description: 'A broad-spectrum mineral sunscreen that provides high protection with a lightweight, non-greasy finish.',
    price: 750.00,
    imageUrl: 'https://images.unsplash.com/photo-1658387518136-703378fb6f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdW5zY3JlZW4lMjB0dWJlfGVufDB8fHx8MTc2NzU5NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '7',
    name: 'Overnight Repair Night Cream',
    description: 'A deeply nourishing night cream with retinol and ceramides to repair and regenerate skin while you sleep.',
    price: 1450.00,
    imageUrl: 'https://images.unsplash.com/photo-1585232350744-974fc9804d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxuaWdodCUyMGNyZWFtfGVufDB8fHx8MTc2NzYyMTE3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '8',
    name: 'Detoxifying Clay Mask',
    description: 'A weekly treatment mask with kaolin clay and charcoal to draw out impurities and reduce the appearance of pores.',
    price: 900.00,
    imageUrl: 'https://images.unsplash.com/photo-1760679673134-ec50fe724567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjbGF5JTIwbWFza3xlbnwwfHx8fDE3Njc2MjExNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Skin care'
  },
  {
    id: '9',
    name: 'Soothing Aloe Handwash',
    description: 'A gentle handwash that cleanses without drying, leaving hands soft and refreshed.',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1611861317409-7dcc62856a8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxoYW5kd2FzaCUyMGJvdHRsZXxlbnwwfHx8fDE3Njg0NDYzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Handwash'
  },
  {
    id: '10',
    name: 'Mint Fresh Toothpaste',
    description: 'A fluoride-free toothpaste that naturally whitens teeth and freshens breath.',
    price: 350.00,
    imageUrl: 'https://images.unsplash.com/photo-1759910548177-638d4e6ee0d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx0b290aHBhc3RlJTIwdHViZXxlbnwwfHx8fDE3Njg0NDYzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Toothpaste'
  },
  {
    id: '11',
    name: 'Nourishing Body Wash',
    description: 'A rich and creamy body wash that moisturizes and soothes the skin.',
    price: 650.00,
    imageUrl: 'https://images.unsplash.com/photo-1677726050511-48866c4a64d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxib2R5d2FzaCUyMGJvdHRsZXxlbnwwfHx8fDE3Njg0NDYzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bath & Body'
  },
  {
    id: '12',
    name: 'Strengthening Shampoo',
    description: 'A sulfate-free shampoo that strengthens hair and reduces breakage.',
    price: 750.00,
    imageUrl: 'https://images.unsplash.com/photo-1585232350744-974fc9804d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzaGFtcG9vJTIwYm90dGxlfGVufDB8fHx8MTc2ODM2MDkwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
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

    