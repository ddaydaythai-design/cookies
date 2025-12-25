
import React, { useState } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';

interface InventoryProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onUpdateProducts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    if (editingId === 'new') {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name!,
        price: Number(formData.price),
        cost: Number(formData.cost || 0),
        category: formData.category || '其他',
        stock: Number(formData.stock || 0),
        image: `https://picsum.photos/seed/${Date.now()}/200`
      };
      onUpdateProducts([...products, newProduct]);
    } else {
      onUpdateProducts(products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
    }
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除此產品嗎？')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">庫存管理</h2>
        <button 
          onClick={() => { setEditingId('new'); setFormData({ category: '飲品', stock: 0, cost: 0, price: 0 }); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <i className="fas fa-plus"></i> 新增產品
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">產品</th>
              <th className="px-6 py-4 font-bold">分類</th>
              <th className="px-6 py-4 font-bold">售價</th>
              <th className="px-6 py-4 font-bold">成本</th>
              <th className="px-6 py-4 font-bold">利潤</th>
              <th className="px-6 py-4 font-bold">庫存</th>
              <th className="px-6 py-4 font-bold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <span className="font-medium text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600">${p.price}</td>
                <td className="px-6 py-4 text-slate-500">${p.cost}</td>
                <td className="px-6 py-4">
                  <span className="text-emerald-600 font-bold">${p.price - p.cost}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {(((p.price - p.cost) / p.price) * 100).toFixed(0)}% 毛利
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(p)} className="text-slate-400 hover:text-indigo-600 p-2"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-600 p-2"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{editingId === 'new' ? '新增產品' : '編輯產品'}</h3>
              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">名稱</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">類別</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">庫存</label>
                  <input 
                    type="number" 
                    value={formData.stock || 0} 
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">售價 ($)</label>
                  <input 
                    type="number" 
                    value={formData.price || 0} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">成本 ($)</label>
                  <input 
                    type="number" 
                    value={formData.cost || 0} 
                    onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button onClick={() => setEditingId(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg">儲存產品</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
