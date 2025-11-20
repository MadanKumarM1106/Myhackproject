import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

// --- Decrypt Text Effect ---
export const DecryptText: React.FC<{ text: string; className?: string; speed?: number }> = ({ text, className = "", speed = 30 }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(prev => {
        if (i >= text.length) {
          clearInterval(timer);
          return text;
        }
        const scrambled = text.split('').map((char, index) => {
          if (index < i) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        i += 1/3; // Slow down the resolve
        return scrambled;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{displayText}</span>;
};

// --- Sci-Fi Panel Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = "", title, action }) => (
  <div className={`bg-military-900/80 border border-military-600/50 backdrop-blur-md relative group ${className}`}>
    {/* Decorative Corners */}
    <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-l-2 border-t-2 border-military-500"></div>
    <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-r-2 border-t-2 border-military-500"></div>
    <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-l-2 border-b-2 border-military-500"></div>
    <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-r-2 border-b-2 border-military-500"></div>

    {(title || action) && (
      <div className="px-5 py-3 border-b border-military-700/50 flex justify-between items-center bg-black/20">
        {title && <h3 className="text-military-400 font-tech uppercase text-sm font-bold tracking-[0.2em] flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-military-500 rounded-sm shadow-[0_0_5px_#4ade80]"></span>
           <DecryptText text={title} />
        </h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-5 relative z-10">
      {children}
    </div>
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-gray-900/80 text-gray-400 border-gray-700";
  let dotColor = "bg-gray-500";
  
  switch (status.toLowerCase()) {
    case 'moving':
    case 'active':
    case 'low':
      colorClass = "bg-green-950/60 text-green-400 border-green-800";
      dotColor = "bg-green-500 shadow-[0_0_8px_#4ade80]";
      break;
    case 'delayed':
    case 'medium':
    case 'traffic':
      colorClass = "bg-yellow-950/60 text-yellow-400 border-yellow-800";
      dotColor = "bg-yellow-500 shadow-[0_0_8px_#eab308]";
      break;
    case 'high':
    case 'security':
    case 'offline':
      colorClass = "bg-red-950/60 text-red-400 border-red-800";
      dotColor = "bg-red-500 shadow-[0_0_8px_#ef4444]";
      break;
    case 'completed':
      colorClass = "bg-blue-950/60 text-blue-400 border-blue-800";
      dotColor = "bg-blue-500 shadow-[0_0_8px_#3b82f6]";
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-sm text-[10px] font-tech font-bold uppercase border ${colorClass} flex items-center gap-2 w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`}></span>
      {status}
    </span>
  );
};

// --- Tech Button with Clip Path ---
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  // Base styles for the angled cut
  const clipStyle = { clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" };
  
  const variants = {
    primary: "bg-military-600 hover:bg-military-500 text-black font-bold border-none hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]",
    secondary: "bg-transparent hover:bg-military-800 text-military-400 border border-military-600 hover:border-military-500",
    danger: "bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900 hover:border-red-500"
  };

  return (
    <button 
      className={`
        relative px-6 py-2.5 font-tech text-xs uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98]
        ${variants[variant]} ${className}
      `} 
      style={variant === 'primary' ? clipStyle : {}}
      {...props}
    >
      {/* Corner Accents for Secondary Buttons */}
      {variant !== 'primary' && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-current opacity-50 group-hover:opacity-100"></span>
          <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-current opacity-50 group-hover:opacity-100"></span>
        </>
      )}
      
      {children}
      {variant === 'primary' && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative group">
    <input 
      className="w-full bg-black/40 border border-military-700 text-military-100 px-4 py-2.5 focus:outline-none focus:border-military-500 font-tech text-sm placeholder-military-800 transition-all"
      {...props}
    />
    <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-military-500 transition-all duration-300 group-focus-within:w-full shadow-[0_0_8px_#4ade80]"></div>
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <div className="relative group">
    <select 
      className="w-full bg-black/40 border border-military-700 text-military-100 px-4 py-2.5 focus:outline-none focus:border-military-500 font-tech text-sm transition-all appearance-none"
      {...props}
    >
      {props.children}
    </select>
    <div className="absolute right-3 top-3 pointer-events-none text-military-600">▼</div>
    <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-military-500 transition-all duration-300 group-focus-within:w-full shadow-[0_0_8px_#4ade80]"></div>
  </div>
);

export const StatBox: React.FC<{ label: string; value: string | number; icon: LucideIcon; trend?: string }> = ({ label, value, icon: Icon, trend }) => (
  <div className="relative bg-military-900/60 border-r border-military-800 p-4 group hover:bg-military-800/40 transition-colors">
    <div className="absolute top-0 left-0 w-[2px] h-full bg-military-800 group-hover:bg-military-500 transition-colors shadow-[0_0_10px_rgba(74,222,128,0)] group-hover:shadow-[0_0_10px_rgba(74,222,128,0.3)]"></div>
    <div className="flex items-start justify-between pl-3">
      <div>
        <p className="text-military-500 text-[10px] uppercase tracking-widest font-tech mb-1 opacity-70">{label}</p>
        <h4 className="text-3xl font-bold text-white font-tech tracking-wide">{value}</h4>
        {trend && <p className="text-[10px] text-military-400 mt-2 font-mono flex items-center gap-1">
           <span className="text-military-600">▲</span> {trend}
        </p>}
      </div>
      <div className="p-2 bg-black/40 rounded-sm border border-military-800 text-military-600 group-hover:text-military-400 group-hover:border-military-600 transition-all">
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export const TerminalLog: React.FC<{ lines: string[] }> = ({ lines }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto font-mono text-xs space-y-0.5 pr-2 scrollbar-thin">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-3 hover:bg-military-800/30 px-1">
           <span className="text-military-700 select-none font-tech text-[10px] pt-0.5">
             {new Date().toLocaleTimeString().split(' ')[0]}::{Math.floor(Math.random()*99)}
           </span>
           <span className="text-military-300/90 font-mono">{line}</span>
        </div>
      ))}
    </div>
  );
};