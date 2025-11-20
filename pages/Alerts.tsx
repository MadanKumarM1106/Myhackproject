import React from 'react';
import { AlertTriangle, CloudRain, Lock, TrafficCone, Info } from 'lucide-react';
import { Card } from '../components/UiElements';
import { Alert } from '../types';

const ALERTS: Alert[] = [
  { id: 'A-001', type: 'Security', title: 'Checkpoint Charlie Compromised', description: 'Civilian unrest reported at Sector 4 checkpoint. Alternate routes advised.', timestamp: '10:45 AM', severity: 'High' },
  { id: 'A-002', type: 'Traffic', title: 'Congestion on R-104', description: 'Supply truck breakdown causing 20 min delays.', timestamp: '10:15 AM', severity: 'Medium' },
  { id: 'A-003', type: 'Weather', title: 'Sandstorm Warning', description: 'Visibility reducing in Northern Sector. Convoy speed limit reduced to 30km/h.', timestamp: '09:30 AM', severity: 'Medium' },
  { id: 'A-004', type: 'Logistics', title: 'Fuel Depot B Low Stock', description: 'Refueling capacity at 15%. Route divert suggested for heavy armor.', timestamp: '08:00 AM', severity: 'Low' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'Security': return <Lock className="text-red-500" />;
    case 'Weather': return <CloudRain className="text-blue-400" />;
    case 'Traffic': return <TrafficCone className="text-yellow-500" />;
    default: return <Info className="text-gray-400" />;
  }
};

const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => (
  <div className={`p-4 border-l-4 bg-military-800/50 rounded border-y border-r border-y-military-700 border-r-military-700 mb-4 flex items-start gap-4 transition-transform hover:-translate-y-1 ${
    alert.severity === 'High' ? 'border-l-red-500' : 
    alert.severity === 'Medium' ? 'border-l-yellow-500' : 
    'border-l-military-500'
  }`}>
    <div className="mt-1 p-2 bg-black/30 rounded-full border border-military-700">
      {getIcon(alert.type)}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="text-white font-bold font-mono uppercase tracking-wide text-sm">{alert.title}</h4>
        <span className="text-xs text-gray-500 font-mono">{alert.timestamp}</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
      <div className="mt-2 flex gap-2">
        <span className="text-[10px] px-1.5 py-0.5 bg-black/40 border border-gray-700 rounded text-gray-400 font-mono uppercase">{alert.type}</span>
        {alert.severity === 'High' && <span className="text-[10px] px-1.5 py-0.5 bg-red-900/30 border border-red-800 rounded text-red-400 font-mono uppercase animate-pulse">CRITICAL</span>}
      </div>
    </div>
  </div>
);

const Alerts: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-military-500" size={28} />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">System Alerts</h2>
      </div>
      
      <div className="space-y-4">
        {ALERTS.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default Alerts;