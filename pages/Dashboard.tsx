
import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Order, Product } from '../types';
import { getBusinessInsights } from '../services/geminiService';

interface DashboardProps {
  orders: Order[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, products }) => {
  const [aiInsight, setAiInsight] = useState<string>("正在獲取智能分析...");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const stats = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    const todayOrders = orders.filter(o => o.timestamp >= today);
    
    const totalSales = orders.reduce((s, o) => s + o.totalAmount, 0);
    const totalCost = orders.reduce((s, o) => s + o.totalCost, 0);
    const totalProfit = totalSales - totalCost;
    
    const todaySales = todayOrders.reduce((s, o) => s + o.totalAmount, 0);
    const todayProfit = todayOrders.reduce((s, o) => s + o.totalProfit, 0);

    return { totalSales, totalProfit, totalCost, todaySales, todayProfit, totalOrders: orders.length };
  }, [orders]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, idx) => {
      const monthOrders = orders.filter(o => {
        const d = new Date(o.timestamp);
        return d.getMonth() === idx && d.getFullYear() === currentYear;
      });
      
      const sales = monthOrders.reduce((s, o) => s + o.totalAmount, 0);
      const costs = monthOrders.reduce((s, o) => s + o.totalCost, 0);
      return {
        name: month,
        銷售額: sales,
        成本: costs,
        利潤: sales - costs
      };
    });
  }, [orders]);

  useEffect(() => {
    const fetchAI = async () => {
      if (orders.length === 0) {
        setAiInsight("尚無交易數據，無法進行分析。");
        return;
      }
      setLoadingInsight(true);
      const res = await getBusinessInsights(orders, products);
      setAiInsight(res);
      setLoadingInsight(false);
    };
    fetchAI();
  }, [orders, products]);

  return (
    <div className="p-6 space-y-6 pb-24 md:pb-6 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">經營儀表板</h2>
        <div className="text-sm text-slate-500">更新時間: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="總銷售額" value={`$${stats.totalSales}`} icon="fa-sack-dollar" color="indigo" />
        <StatCard title="總利潤" value={`$${stats.totalProfit}`} icon="fa-chart-pie" color="emerald" />
        <StatCard title="今日銷售" value={`$${stats.todaySales}`} icon="fa-calendar-day" color="blue" />
        <StatCard title="總訂單數" value={stats.totalOrders} icon="fa-receipt" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">年度銷售分析</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="銷售額" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="利潤" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-wand-magic-sparkles"></i>
            </div>
            <h3 className="font-bold text-lg">AI 經營分析</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingInsight ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm">
                <p className="leading-relaxed opacity-90">{aiInsight}</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setAiInsight("重新分析中...")}
            className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
          >
            重新產生建議
          </button>
        </div>
      </div>

      {/* Recent Orders Mini List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">最新交易</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400 text-sm border-b border-slate-50">
                <th className="pb-3 font-medium">訂單 ID</th>
                <th className="pb-3 font-medium">時間</th>
                <th className="pb-3 font-medium">支付方式</th>
                <th className="pb-3 font-medium">金額</th>
                <th className="pb-3 font-medium text-right">利潤</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.slice(-5).reverse().map(order => (
                <tr key={order.id} className="text-sm">
                  <td className="py-3 font-mono text-xs text-slate-500">#{order.id.slice(-6)}</td>
                  <td className="py-3">{new Date(order.timestamp).toLocaleTimeString()}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold uppercase">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-800">${order.totalAmount}</td>
                  <td className="py-3 text-emerald-600 font-bold text-right">+${order.totalProfit}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">尚無交易數據</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorClasses[color]}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{title}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
