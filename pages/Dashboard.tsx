import React, { useState, useEffect } from 'react';
import { Truck, Activity, AlertOctagon, Radio, ArrowRight, Terminal } from 'lucide-react';
import { Card, StatBox, Badge, TerminalLog } from '../components/UiElements';
import { Convoy } from '../types';

const MOCK_RECENT_CONVOYS: Convoy[] = [
  { id: 'CNV-Alpha-1', name: 'Supply Run A', status: 'Moving', eta: '14:00', route: 'R-104', loadType: 'Munitions' },
  { id: 'CNV-Bravo-4', name: 'Personnel T', status: 'Delayed', eta: '16:30', route: 'R-202', loadType: 'Troops' },
  { id: 'CNV-Charlie-2', name: 'Med Evac', status: 'Completed', eta: '09:15', route: 'R-101', loadType: 'Medical' },
  { id: 'CNV-Delta-9', name: 'Fuel Log', status: 'Moving', eta: '15:45', route: 'R-305', loadType: 'Fuel' },
];

const LOG_MESSAGES = [
  "Scanning sector 7 for hostiles...",
  "Weather update: Sandstorm approaching grid 44-X",
  "Encrypted uplink established with Bravo Team",
  "Satellite imagery refreshed",
  "Traffic spike detected on Route R-104",
  "Maintenance required: Truck unit 882",
  "Checkpoint Charlie reports all clear",
  "Drone surveillance active in Sector 9",
  "Fuel levels critical for Convoy Delta",
  "Signal interception detected - Frequency hopping",
  "Logistics database synchronized"
];

const HeatMapGrid: React.FC = () => {
  const [cells, setCells] = useState<number[]>(Array.from({ length: 50 }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCells(prev => prev.map(() => Math.random()));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-48 grid grid-cols-10 gap-1 p-1 bg-black/20 rounded border border-military-700/50 relative">
        {/* Scan line overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-[10px] w-full animate-[scan_3s_linear_infinite] pointer-events-none"></div>
        
      {cells.map((val, i) => {
        let color = 'bg-military-800/30';
        if (val > 0.92) color = 'bg-red-500/60 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]';
        else if (val > 0.75) color = 'bg-yellow-500/40';
        else if (val > 0.4) color = 'bg-green-600/20';
        
        return <div key={i} className={`rounded-sm transition-colors duration-1000 ${color}`} />;
      })}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(["System initialized.", "Connect to SAT-COM..."]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      setLogs(prev => [...prev.slice(-15), msg]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox label="Active Convoys" value="12" icon={Truck} trend="+2 since 0800" />
        <StatBox label="Road Efficiency" value="87%" icon={Activity} trend="Stable" />
        <StatBox label="Threat Level" value="MODERATE" icon={AlertOctagon} trend="Sector 4 Alert" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map / Traffic Visual */}
        <Card className="lg:col-span-2" title="Live Traffic Density & Risk Heatmap">
          <HeatMapGrid />
          <div className="mt-4 flex gap-4 text-xs text-gray-400 font-mono justify-end">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-600/40"></div> CLEAR</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500/40"></div> CONGESTED</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500/60"></div> CRITICAL</span>
          </div>
        </Card>

        {/* System Logs */}
        <Card title="System Log" className="h-80 lg:h-auto flex flex-col">
             <div className="flex-1 bg-black/40 p-2 rounded border border-military-700/50 font-mono text-xs overflow-hidden relative">
                <TerminalLog lines={logs} />
             </div>
             <div className="mt-2 flex items-center gap-2 text-military-600 text-[10px] font-mono uppercase">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                 Real-time Feed Active
             </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Recommended Route Panel */}
          <Card title="Tactical Recommendation" className="relative overflow-hidden lg:col-span-1">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Radio size={100} />
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-xs text-gray-500 font-mono uppercase">Objective</label>
                <p className="text-white font-bold">Base Alpha <span className="text-military-500">→</span> Outpost X-Ray</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono uppercase">Suggested Route</label>
                <p className="text-military-400 font-mono text-lg">R-404 (Mountain Pass)</p>
              </div>
              <div className="bg-military-900/50 p-3 rounded border border-military-700 text-xs text-gray-300">
                <p>Avoids Valley Sector due to reported civilian protest. Adds 15 mins but reduces risk by 40%.</p>
              </div>
              <button className="w-full py-2 bg-military-600 hover:bg-military-500 text-white text-xs uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-2">
                View Details <ArrowRight size={14} />
              </button>
            </div>
          </Card>

        {/* Recent Logs */}
        <Card title="Recent Movements Log" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-military-700 uppercase tracking-wider font-mono">
                  <th className="p-3">ID</th>
                  <th className="p-3">Operation Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">ETA</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono text-gray-300 divide-y divide-military-800">
                {MOCK_RECENT_CONVOYS.map((convoy) => (
                  <tr key={convoy.id} className="hover:bg-military-800/30 transition-colors">
                    <td className="p-3 text-military-400">{convoy.id}</td>
                    <td className="p-3 font-sans">{convoy.name}</td>
                    <td className="p-3">{convoy.loadType}</td>
                    <td className="p-3">{convoy.route}</td>
                    <td className="p-3">{convoy.eta}</td>
                    <td className="p-3"><Badge status={convoy.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;