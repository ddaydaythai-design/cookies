
import React, { useState, useMemo } from 'react';
import { Product, Order, OrderItem } from '../types';
import { CATEGORIES } from '../constants';

interface POSProps {
  products: Product[];
  onCompleteOrder: (order: Order) => void;
}

const POS: React.FC<POSProps> = ({ products, onCompleteOrder }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === '全部' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, activeCategory, searchTerm]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        cost: product.cost,
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCost = cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

  const handleCheckout = (method: Order['paymentMethod']) => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      totalAmount,
      totalCost,
      totalProfit: totalAmount - totalCost,
      timestamp: Date.now(),
      paymentMethod: method,
    };

    onCompleteOrder(newOrder);
    setCart([]);
    alert('交易完成！');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4 overflow-hidden">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="搜尋產品..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pr-2">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-3 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
            >
              <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700">
                  庫存: {product.stock}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-indigo-600 font-bold">${product.price}</span>
                  <span className="text-[10px] text-slate-400">成本: ${product.cost}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-800">當前訂單</h2>
          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg">
            {cart.length} 項產品
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <i className="fas fa-shopping-basket text-4xl"></i>
              <p>購物車是空的</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-400">${item.price} / 件</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-slate-600">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-slate-600">+</button>
                  </div>
                  <span className="font-bold text-slate-800">${item.price * item.quantity}</span>
                  <button onClick={() => removeFromCart(item.productId)} className="text-[10px] text-red-500 hover:underline">移除</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="flex justify-between text-slate-600 text-sm">
            <span>預計成本</span>
            <span>${totalCost}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold text-xl">
            <span>總金額</span>
            <span className="text-indigo-600">${totalAmount}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button 
              onClick={() => handleCheckout('Cash')}
              className="py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-money-bill-wave text-green-500"></i> 現金
            </button>
            <button 
              onClick={() => handleCheckout('CreditCard')}
              className="py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-credit-card text-blue-500"></i> 信用卡
            </button>
            <button 
              onClick={() => handleCheckout('Octopus')}
              className="py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-id-card text-orange-500"></i> 八達通
            </button>
            <button 
              onClick={() => handleCheckout('PayMe')}
              className="py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-qrcode"></i> PayMe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
