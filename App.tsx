
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import POS from './pages/POS';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import History from './pages/History';
import { Product, Order } from './types';
import { INITIAL_PRODUCTS, STORAGE_KEYS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load data from LocalStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
  };

  const handleCompleteOrder = (order: Order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));

    // Simple stock deduction logic
    const updatedProducts = products.map(p => {
      const orderItem = order.items.find(item => item.productId === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
      }
      return p;
    });
    handleUpdateProducts(updatedProducts);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POS products={products} onCompleteOrder={handleCompleteOrder} />;
      case 'dashboard':
        return <Dashboard orders={orders} products={products} />;
      case 'inventory':
        return <Inventory products={products} onUpdateProducts={handleUpdateProducts} />;
      case 'history':
        return <History orders={orders} />;
      default:
        return <POS products={products} onCompleteOrder={handleCompleteOrder} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden h-[calc(100vh-64px)] md:h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
