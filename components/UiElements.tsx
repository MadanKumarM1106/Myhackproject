import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = "", title, action }) => (
  <div className={`bg-military-800 border border-military-600 rounded-sm overflow-hidden shadow-lg backdrop-blur-sm bg-opacity-90 ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 border-b border-military-600 flex justify-between items-center bg-military-900/50">
        {title && <h3 className="text-military-500 font-mono uppercase text-sm font-bold tracking-wider flex items-center gap-2">
           <span className="w-2 h-2 bg-military-500 rounded-full animate-pulse"></span>
           {title}
        </h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-gray-700 text-gray-300 border-gray-600";
  
  switch (status.toLowerCase()) {
    case 'moving':
    case 'active':
    case 'low':
      colorClass = "bg-green-900/40 text-green-400 border-green-700/50";
      break;
    case 'delayed':
    case 'medium':
    case 'traffic':
      colorClass = "bg-yellow-900/40 text-yellow-400 border-yellow-700/50";
      break;
    case 'high':
    case 'security':
    case 'offline':
      colorClass = "bg-red-900/40 text-red-400 border-red-700/50";
      break;
    case 'completed':
      colorClass = "bg-blue-900/40 text-blue-400 border-blue-700/50";
      break;
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-mono uppercase border ${colorClass} shadow-sm`}>
      {status}
    </span>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 font-mono text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border";
  
  const variants = {
    primary: "bg-military-600 hover:bg-military-500 text-white border-military-500 hover:border-green-300 shadow-[0_0_10px_rgba(74,222,128,0.2)]",
    secondary: "bg-military-800 hover:bg-military-700 text-gray-300 border-military-600",
    danger: "bg-red-900/50 hover:bg-red-800/50 text-red-200 border-red-800"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className="w-full bg-black/30 border border-military-600 text-military-400 px-3 py-2 focus:outline-none focus:border-military-500 focus:ring-1 focus:ring-military-500 font-mono text-sm placeholder-military-700 transition-colors"
    {...props}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select 
    className="w-full bg-black/30 border border-military-600 text-military-400 px-3 py-2 focus:outline-none focus:border-military-500 font-mono text-sm transition-colors"
    {...props}
  >
    {props.children}
  </select>
);

export const StatBox: React.FC<{ label: string; value: string | number; icon: LucideIcon; trend?: string }> = ({ label, value, icon: Icon, trend }) => (
  <Card className="border-l-4 border-l-military-500">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider font-mono mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        {trend && <p className="text-xs text-military-500 mt-2 font-mono">{trend}</p>}
      </div>
      <div className="p-2 bg-military-900 rounded border border-military-700 text-military-500">
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

export const TerminalLog: React.FC<{ lines: string[] }> = ({ lines }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto font-mono text-xs space-y-1 pr-2">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2 border-b border-military-800/50 pb-0.5">
           <span className="text-military-600 select-none">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
           <span className="text-green-400/90">{line}</span>
        </div>
      ))}
    </div>
  );
};
