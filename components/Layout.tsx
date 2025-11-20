import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Truck, 
  AlertTriangle, 
  Settings, 
  Menu, 
  X, 
  ShieldAlert,
  Crosshair
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/route-planner', label: 'Route Planner', icon: Map },
    { path: '/convoy-status', label: 'Convoy Status', icon: Truck },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-military-900 grid-bg">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-military-800 border-b border-military-600 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-military-500">
          <ShieldAlert size={24} />
          <span className="font-bold tracking-wider uppercase">TacTransport AI</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-military-500">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-military-900 border-r border-military-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col items-center border-b border-military-700 bg-black/20">
          <div className="w-16 h-16 bg-military-800 rounded-full flex items-center justify-center border-2 border-military-600 mb-3 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
            <Crosshair size={32} className="text-military-500" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-widest uppercase text-center">
            Logistics<br/><span className="text-military-500 text-sm">Command Center</span>
          </h1>
          <div className="mt-2 px-2 py-0.5 bg-military-800 border border-military-600 rounded text-[10px] text-military-400 font-mono">
            V.2.5.0-ALPHA
          </div>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-[calc(100%-1rem)] text-left flex items-center gap-3 px-4 py-3 mx-2 mb-1 transition-all duration-200 border-l-2 font-mono text-sm tracking-wide ${
                  isActive 
                    ? 'bg-military-800/80 text-military-500 border-military-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' 
                    : 'text-gray-400 border-transparent hover:bg-military-800/40 hover:text-military-400'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-military-700 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs text-military-400 font-mono">SYSTEM ONLINE</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen md:h-auto bg-transparent">
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-military-700 bg-military-900/80 backdrop-blur sticky top-0 z-30">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest font-mono">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-military-600 font-mono">{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</span>
            <div className="h-8 w-8 rounded bg-military-800 border border-military-600 flex items-center justify-center text-military-500">
              <span className="font-bold text-xs">OP</span>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;