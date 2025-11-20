import React, { useState } from 'react';
import { Navigation, Shield, Clock, AlertTriangle, Loader2, Target } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../components/UiElements';
import { generateRouteAnalysis, AIResponse } from '../services/geminiService';
import TacticalMap from '../components/TacticalMap';

const RoutePlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [formData, setFormData] = useState({
    start: 'Base Alpha',
    destination: 'Sector 7 Depot',
    priority: 'Medium'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateRouteAnalysis(formData.start, formData.destination, formData.priority);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Control Panel */}
      <Card title="Mission Parameters" className="lg:col-span-1 h-fit">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-mono uppercase block mb-1">Start Location</label>
            <Input 
              value={formData.start} 
              onChange={(e) => setFormData({...formData, start: e.target.value})}
              placeholder="Enter coordinates or base name"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-mono uppercase block mb-1">Destination</label>
            <Input 
              value={formData.destination} 
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              placeholder="Enter destination"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-mono uppercase block mb-1">Priority Level</label>
            <Select 
              value={formData.priority} 
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="Low">Low - Standard Supply</option>
              <option value="Medium">Medium - Time Sensitive</option>
              <option value="High">High - Critical / Medevac</option>
            </Select>
          </div>

          <div className="pt-4 border-t border-military-700">
            <Button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Target size={18} />}
              {loading ? "Calcuating Trajectory..." : "Generate Tactical Route"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Map & Results Container */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full">
        {/* Map Component */}
        <div className="bg-military-900 border border-military-600 rounded flex-grow relative overflow-hidden min-h-[300px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
             <div className="px-2 py-1 bg-black/60 border border-military-600 text-[10px] text-military-500 font-mono rounded">
               LAT: {Math.random().toFixed(4)} N
             </div>
             <div className="px-2 py-1 bg-black/60 border border-military-600 text-[10px] text-military-500 font-mono rounded">
               LNG: {Math.random().toFixed(4)} E
             </div>
          </div>
          
          {/* Tactical Map Rendering */}
          <TacticalMap waypoints={result?.waypoints} scanning={loading} />

          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-military-600 text-xs font-mono text-gray-400 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            {loading ? 'UPLINK: SCANNING' : 'UPLINK: STABLE'}
          </div>
        </div>

        {/* AI Analysis Result */}
        {result && (
          <Card title="Tactical Analysis" className="animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black/30 p-3 rounded border border-military-700 flex items-center gap-3">
                <Navigation className="text-military-500" size={20} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Distance</p>
                  <p className="font-mono font-bold">{result.distance}</p>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-military-700 flex items-center gap-3">
                <Clock className="text-blue-400" size={20} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Est. Time</p>
                  <p className="font-mono font-bold">{result.duration}</p>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-military-700 flex items-center gap-3">
                <Shield className={result.riskLevel === 'High' ? 'text-red-500' : 'text-yellow-500'} size={20} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Risk Level</p>
                  <Badge status={result.riskLevel} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm text-white font-bold font-mono uppercase flex items-center gap-2">
                <AlertTriangle size={14} className="text-military-500" />
                Commander Summary
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-military-600 pl-3">
                {result.summary}
              </p>
              <div className="bg-military-900/50 p-3 rounded text-xs text-gray-400 font-mono mt-2 border border-military-800">
                <span className="text-military-500 font-bold">ORDERS: </span>{result.tacticalNotes}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;