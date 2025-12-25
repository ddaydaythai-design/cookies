
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: '拿鐵咖啡 (L)', price: 42, cost: 12, category: '飲品', stock: 100, image: 'https://picsum.photos/seed/coffee/200' },
  { id: '2', name: '牛角包', price: 28, cost: 8, category: '食物', stock: 50, image: 'https://picsum.photos/seed/croissant/200' },
  { id: '3', name: '芝士蛋糕', price: 45, cost: 15, category: '食物', stock: 20, image: 'https://picsum.photos/seed/cake/200' },
  { id: '4', name: '冷萃咖啡', price: 38, cost: 10, category: '飲品', stock: 80, image: 'https://picsum.photos/seed/coldbrew/200' },
];

export const CATEGORIES = ['全部', '飲品', '食物', '其他'];

export const STORAGE_KEYS = {
  PRODUCTS: 'smartpos_products',
  ORDERS: 'smartpos_orders',
};
