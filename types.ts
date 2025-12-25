
export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  image?: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  timestamp: number;
  paymentMethod: 'Cash' | 'CreditCard' | 'Octopus' | 'PayMe';
}

export interface MonthlySummary {
  month: string;
  sales: number;
  costs: number;
  profits: number;
}
