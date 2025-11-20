import React, { useState } from 'react';
import { Navigation, Shield, Clock, AlertTriangle, Loader2, Target, MousePointer2 } from 'lucide-react';
import { Card, Button, Input, Select, Badge, DecryptText } from '../components/UiElements';
import { generateRouteAnalysis, AIResponse } from '../services/geminiService';
import TacticalMap from '../components/TacticalMap';

const RoutePlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [formData, setFormData] = useState({
    start: 'Base Alpha',
    destination: '',
    priority: 'Medium'
  });

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null); // Clear previous result for effect
    try {
      const dest = formData.destination || "Sector 7"; // Fallback
      const data = await generateRouteAnalysis(formData.start, dest, formData.priority);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (coords: {x: number, y: number}) => {
    // Simulate converting grid coords to a tactical name
    const gridName = `GRID-${Math.floor(coords.x)}-${Math.floor(coords.y)}`;
    setFormData(prev => ({ ...prev, destination: gridName }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Control Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Card title="Mission Parameters" className="h-fit">
          <div className="space-y-5">
            <div>
              <label className="text-[10px] text-military-400 font-tech uppercase tracking-wider block mb-1">Start Location</label>
              <Input 
                value={formData.start} 
                onChange={(e) => setFormData({...formData, start: e.target.value})}
                placeholder="Enter origin..."
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                 <label className="text-[10px] text-military-400 font-tech uppercase tracking-wider">Target Destination</label>
                 <span className="text-[10px] text-military-600 flex items-center gap-1 animate-pulse"><MousePointer2 size={10}/> CLICK MAP TO SET</span>
              </div>
              <Input 
                value={formData.destination} 
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                placeholder="Enter destination or click map..."
              />
            </div>
            <div>
              <label className="text-[10px] text-military-400 font-tech uppercase tracking-wider block mb-1">Priority Protocol</label>
              <Select 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">P3 - STANDARD SUPPLY</option>
                <option value="Medium">P2 - TIME SENSITIVE</option>
                <option value="High">P1 - CRITICAL / COMBAT</option>
              </Select>
            </div>

            <div className="pt-4 border-t border-military-700/50">
              <Button 
                onClick={handleGenerate} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Target size={18} />}
                {loading ? "CALCULATING..." : "INITIATE ROUTE SCAN"}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Instructions / Fluff */}
        <div className="bg-military-900/40 p-4 border border-military-800 rounded-sm text-xs text-military-500 font-mono leading-relaxed">
           <p className="mb-2"><strong className="text-military-400">OPERATOR NOTE:</strong></p>
           <p>Use the tactical grid to designate extraction points. High-priority routes will automatically avoid sectors with reported seismic or hostile activity.</p>
        </div>
      </div>

      {/* Map & Results Container */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-[500px]">
        {/* Map Component */}
        <div className="bg-black border-2 border-military-700 rounded-sm flex-grow relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] group">
          {/* UI Overlays for Map */}
          <div className="absolute top-4 left-4 z-10 flex gap-2 pointer-events-none">
             <div className="px-2 py-1 bg-black/80 border border-military-600 text-[10px] text-military-400 font-tech rounded-sm">
               SAT-LINK: ACTIVE
             </div>
          </div>
          
          {/* Tactical Map Rendering */}
          <TacticalMap 
            waypoints={result?.waypoints} 
            scanning={loading} 
            onMapClick={handleMapClick} 
          />

          {/* Corner Brackets */}
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-military-500 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-military-500 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-sm border border-military-600 text-xs font-tech text-military-400 flex items-center gap-2 pointer-events-none">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            {loading ? <DecryptText text="AWAITING UPLINK..." /> : <DecryptText text="SYSTEM READY" />}
          </div>
        </div>

        {/* AI Analysis Result */}
        {result && (
          <Card title="Tactical Analysis Result" className="animate-in slide-in-from-bottom-5 fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black/40 p-3 border-l-2 border-l-military-500 flex items-center gap-3">
                <Navigation className="text-military-500" size={20} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-tech">Total Distance</p>
                  <p className="font-tech font-bold text-lg"><DecryptText text={result.distance} speed={50} /></p>
                </div>
              </div>
              <div className="bg-black/40 p-3 border-l-2 border-l-blue-500 flex items-center gap-3">
                <Clock className="text-blue-400" size={20} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-tech">Est. Duration</p>
                  <p className="font-tech font-bold text-lg"><DecryptText text={result.duration} speed={60} /></p>
                </div>
              </div>
              <div className="bg-black/40 p-3 border-l-2 border-l-yellow-500 flex items-center gap-3">
                <Shield className={result.riskLevel === 'High' ? 'text-red-500' : 'text-yellow-500'} size={20} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-tech">Risk Assessment</p>
                  <Badge status={result.riskLevel} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm text-military-100 font-bold font-tech uppercase flex items-center gap-2 border-b border-military-800 pb-1">
                <AlertTriangle size={14} className="text-military-500" />
                <DecryptText text="Mission Summary" />
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-mono pl-1">
                {result.summary}
              </p>
              <div className="bg-military-900/80 p-3 rounded-sm text-xs text-gray-300 font-mono mt-2 border border-military-700/50 flex gap-2">
                <span className="text-military-500 font-bold shrink-0">DIRECTIVE:</span>
                <span className="text-yellow-500/90">{result.tacticalNotes}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;