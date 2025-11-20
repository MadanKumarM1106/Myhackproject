import React from 'react';
import { User, Shield, Moon, Globe, Lock, CheckCircle, Server } from 'lucide-react';
import { Card, Button } from '../components/UiElements';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="User Profile">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-military-700 rounded-full flex items-center justify-center border-2 border-military-500 relative group">
            <User size={32} className="text-gray-300 group-hover:text-white transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-military-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="text-xl text-white font-bold font-tech uppercase tracking-wider">Commander Napoleon Bonaparte</h3>
            <p className="text-military-500 text-sm font-mono">ID: CMD-8842-ALPHA</p>
            <div className="flex items-center gap-2 mt-1">
               <span className="px-1.5 py-0.5 bg-military-800 border border-military-600 rounded text-[10px] text-gray-400 font-mono">CLEARANCE: LEVEL 5</span>
               <span className="px-1.5 py-0.5 bg-military-800 border border-military-600 rounded text-[10px] text-gray-400 font-mono">UNIT: LOGISTICS</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="System Configuration">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-military-800 hover:bg-military-800/20 transition-colors p-2 rounded">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-military-900 rounded border border-military-700">
                <Moon size={18} className="text-military-400" />
              </div>
              <div>
                <p className="text-gray-200 font-bold text-sm font-tech uppercase">Stealth Mode</p>
                <p className="text-gray-500 text-xs">Dark interface for low-light ops.</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-military-600 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(74,222,128,0.2)]">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-military-800 hover:bg-military-800/20 transition-colors p-2 rounded">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-military-900 rounded border border-military-700">
                <Globe size={18} className="text-military-400" />
              </div>
              <div>
                <p className="text-gray-200 font-bold text-sm font-tech uppercase">Map Data Source</p>
                <p className="text-gray-500 text-xs">Tactical grid provider.</p>
              </div>
            </div>
            <span className="text-military-500 font-mono text-xs px-2 py-1 bg-black/40 border border-military-700 rounded">SAT-V2 (SECURE)</span>
          </div>
          
          <div className="p-2">
            <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-military-500" />
                <label className="text-xs text-gray-400 uppercase font-mono tracking-wider">Connection Protocol</label>
            </div>
            
            {/* Secure Status Indicator - Replaces Disabled Input */}
            <div className="bg-military-900/80 border border-military-600 rounded p-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-military-500"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black/50 rounded flex items-center justify-center border border-military-700">
                            <Lock size={18} className="text-military-500" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm font-tech tracking-wide flex items-center gap-2">
                                ENCRYPTION KEY: LOADED
                                <CheckCircle size={12} className="text-green-500" />
                            </h4>
                            <p className="text-[10px] text-military-400 font-mono mt-0.5 flex items-center gap-1">
                                <Server size={10} />
                                SOURCE: ENVIRONMENT VARIABLE (process.env)
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-green-500 font-bold border border-green-900 bg-green-900/20 px-2 py-1 rounded animate-pulse">
                            SECURE
                        </span>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(45deg,transparent_25%,rgba(74,222,128,0.05)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
            </div>
            
            <p className="text-[10px] text-gray-600 mt-2 pl-1">
                * Key rotation is managed centrally by SysAdmin. Local override disabled.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="danger">Flush Cache</Button>
        <Button variant="primary">Save Configuration</Button>
      </div>
    </div>
  );
};

export default Settings;