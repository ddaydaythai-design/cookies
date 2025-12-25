
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'pos', icon: 'fa-cash-register', label: '收銀台' },
    { id: 'dashboard', icon: 'fa-chart-line', label: '儀表板' },
    { id: 'inventory', icon: 'fa-boxes-stacked', label: '庫存管理' },
    { id: 'history', icon: 'fa-history', label: '交易紀錄' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:relative md:w-64 md:h-screen md:border-r md:border-t-0 flex md:flex-col z-50">
      <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <i className="fas fa-store text-xl"></i>
        </div>
        <h1 className="text-xl font-bold text-slate-800">SmartPOS</h1>
      </div>
      
      <nav className="flex-1 flex md:flex-col justify-around md:justify-start py-2 md:py-4 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'text-indigo-600 bg-indigo-50 md:bg-indigo-600 md:text-white font-medium' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <i className={`fas ${item.icon} text-lg md:text-xl`}></i>
            <span className="text-[10px] md:text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden md:block p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://picsum.photos/seed/user/100" alt="Avatar" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">店長</p>
            <p className="text-xs text-slate-400">管理權限</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
