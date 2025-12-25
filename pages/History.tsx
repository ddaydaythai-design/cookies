
import React from 'react';
import { Order } from '../types';

interface HistoryProps {
  orders: Order[];
}

const History: React.FC<HistoryProps> = ({ orders }) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">交易歷史</h2>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600">
          總計 {orders.length} 筆交易
        </div>
      </div>

      <div className="space-y-4">
        {orders.slice().reverse().map(order => (
          <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 text-xl">
                  <i className="fas fa-receipt"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">訂單 #{order.id.slice(-6)}</span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase">{order.paymentMethod}</span>
                  </div>
                  <p className="text-xs text-slate-400">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 px-4 py-2 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">金額</p>
                  <p className="font-bold text-slate-800">${order.totalAmount}</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">成本</p>
                  <p className="font-bold text-slate-500">${order.totalCost}</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">利潤</p>
                  <p className="font-bold text-emerald-600">${order.totalProfit}</p>
                </div>
              </div>

              <div className="flex -space-x-3 overflow-hidden">
                {order.items.slice(0, 3).map((item, idx) => (
                   <div key={idx} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                     {item.name[0]}
                   </div>
                ))}
                {order.items.length > 3 && (
                   <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                     +{order.items.length - 3}
                   </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-dashed border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-xs flex justify-between bg-slate-50/50 px-2 py-1 rounded">
                  <span className="text-slate-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium text-slate-800">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white py-20 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
             <i className="fas fa-search text-5xl"></i>
             <p className="text-lg">尚無任何交易歷史紀錄</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
