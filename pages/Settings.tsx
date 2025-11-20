import React from 'react';
import { User, Shield, Moon, Globe } from 'lucide-react';
import { Card, Input, Button } from '../components/UiElements';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="User Profile">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-military-700 rounded-full flex items-center justify-center border-2 border-military-500">
            <User size={32} className="text-gray-300" />
          </div>
          <div>
            <h3 className="text-xl text-white font-bold">Commander J. Doe</h3>
            <p className="text-military-500 text-sm font-mono">ID: CMD-8842-ALPHA</p>
            <p className="text-gray-500 text-xs">Logistics Division - Sector 7</p>
          </div>
        </div>
      </Card>

      <Card title="System Configuration">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-military-800">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-gray-400" />
              <div>
                <p className="text-gray-200 font-bold text-sm">Stealth Mode (Dark UI)</p>
                <p className="text-gray-500 text-xs">Always active in operational theater.</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-military-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-military-800">
             <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-400" />
              <div>
                <p className="text-gray-200 font-bold text-sm">Map Data Provider</p>
                <p className="text-gray-500 text-xs">Select tactical map source.</p>
              </div>
            </div>
            <span className="text-military-500 font-mono text-xs">SAT-V2 (SECURE)</span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-military-500" />
                <label className="text-xs text-gray-400 uppercase font-mono">API Configuration (Gemini)</label>
            </div>
            <div className="flex gap-2">
                <Input type="password" placeholder="API Key is managed via env variables" disabled className="opacity-50 cursor-not-allowed" />
                <Button variant="secondary">Update</Button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">Restricted access. Contact SysAdmin for key rotation.</p>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end gap-3">
        <Button variant="secondary">Reset Defaults</Button>
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;