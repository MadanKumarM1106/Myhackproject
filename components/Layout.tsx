import React, { useState, useEffect } from 'react';
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
  Crosshair,
  Terminal
} from 'lucide-react';
import CommandTerminal from './CommandTerminal';
import { DecryptText } from './UiElements';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigation Hotkeys (Alt + Number)
      if (e.altKey) {
          if (e.key === '1') navigate('/');
          if (e.key === '2') navigate('/route-planner');
          if (e.key === '3') navigate('/convoy-status');
          if (e.key === '4') navigate('/alerts');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const navItems = [
    { path: '/', label: 'DASHBOARD', icon: LayoutDashboard, hotkey: 'Alt+1' },
    { path: '/route-planner', label: 'ROUTE PLANNER', icon: Map, hotkey: 'Alt+2' },
    { path: '/convoy-status', label: 'CONVOY LOGS', icon: Truck, hotkey: 'Alt+3' },
    { path: '/alerts', label: 'ALERT FEED', icon: AlertTriangle, hotkey: 'Alt+4' },
    { path: '/settings', label: 'SYSTEM CFG', icon: Settings, hotkey: '' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-military-950 grid-bg relative overflow-hidden font-tech">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-military-900 border-b border-military-700 p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2 text-military-400">
          <ShieldAlert size={20} className="text-military-500" />
          <span className="font-bold tracking-widest uppercase text-sm">TacTransport</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-military-500 hover:text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-military-900/95 border-r border-military-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 backdrop-blur-sm
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col items-center border-b border-military-700/50 relative overflow-hidden">
          {/* Decorative scan line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-military-500 animate-scan opacity-30"></div>
          
          <div className="w-14 h-14 bg-military-950 rounded-sm flex items-center justify-center border border-military-600 mb-3 shadow-[0_0_15px_rgba(74,222,128,0.1)] group hover:border-military-500 transition-colors">
            <Crosshair size={28} className="text-military-500 group-hover:rotate-90 transition-transform duration-700" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-[0.15em] uppercase text-center font-tech">
            WARCOM<br/><span className="text-military-500 text-xs tracking-[0.3em]">LOGISTICS</span>
          </h1>
          <div className="mt-3 px-2 py-0.5 bg-military-800/50 border border-military-700 rounded text-[9px] text-military-400 font-mono">
            SECURE TERMINAL: V.2.5
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`group w-full text-left flex items-center justify-between px-4 py-3 transition-all duration-200 border font-tech text-sm tracking-wider relative overflow-hidden ${
                  isActive 
                    ? 'bg-military-800/60 text-military-400 border-military-500 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] clip-corner-4' 
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-military-800/30 hover:text-military-300 hover:border-military-800'
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={16} className={isActive ? 'text-military-500' : ''} />
                    <span>{item.label}</span>
                </div>
                {/* Hover Highlight Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-military-500 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
                
                {item.hotkey && (
                    <span className="text-[9px] text-military-800 font-mono group-hover:text-military-600">{item.hotkey}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-military-700/50 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500 absolute top-0 left-0 animate-ping opacity-50"></div>
            </div>
            <div className="flex flex-col">
                <p className="text-[10px] text-military-400 font-tech tracking-wider">SERVER STATUS: ONLINE</p>
                <p className="text-[9px] text-military-700 font-mono">PING: 24ms</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen md:h-auto bg-transparent relative z-10 scrollbar-thin">
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-military-800 bg-military-900/60 backdrop-blur sticky top-0 z-30">
          <h2 className="text-xl font-bold text-white uppercase tracking-[0.2em] font-tech flex items-center gap-2">
             <span className="text-military-600">//</span>
             <DecryptText text={navItems.find(i => i.path === location.pathname)?.label || 'DASHBOARD'} />
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-right">
                 <p className="text-xs text-military-400 font-tech tracking-wider">{new Date().toLocaleDateString()}</p>
                 <p className="text-lg font-bold text-white font-tech leading-none">{new Date().toLocaleTimeString()}</p>
            </div>
            <div className="h-10 w-10 rounded-sm bg-military-800 border border-military-600 flex items-center justify-center text-military-500 shadow-lg">
              <span className="font-bold text-xs font-tech">OP</span>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">
          {children}
        </div>
      </main>

      {/* AI Command Terminal Overlay */}
      <CommandTerminal />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;