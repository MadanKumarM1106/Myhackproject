import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, Input, Badge } from '../components/UiElements';
import { Convoy } from '../types';

const ALL_CONVOYS: Convoy[] = [
  { id: 'CNV-Alpha-1', name: 'Supply Run A', status: 'Moving', eta: '14:00', route: 'R-104', loadType: 'Munitions' },
  { id: 'CNV-Bravo-4', name: 'Personnel T', status: 'Delayed', eta: '16:30', route: 'R-202', loadType: 'Troops' },
  { id: 'CNV-Charlie-2', name: 'Med Evac', status: 'Completed', eta: '09:15', route: 'R-101', loadType: 'Medical' },
  { id: 'CNV-Delta-9', name: 'Fuel Log', status: 'Moving', eta: '15:45', route: 'R-305', loadType: 'Fuel' },
  { id: 'CNV-Echo-3', name: 'Eng. Corps', status: 'Scheduled', eta: '19:00', route: 'R-108', loadType: 'Heavy Machinery' },
  { id: 'CNV-Foxtrot-7', name: 'Intel Unit', status: 'Moving', eta: '14:20', route: 'R-104', loadType: 'Sensitive' },
  { id: 'CNV-Golf-1', name: 'Ration Dist', status: 'Delayed', eta: '18:00', route: 'R-404', loadType: 'Supplies' },
];

const ConvoyStatus: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredConvoys = ALL_CONVOYS.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.route.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-military-600" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Search Convoy ID, Name or Route..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-military-600 text-military-500 rounded hover:bg-military-800">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card title={`Active Operations (${filteredConvoys.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-military-900/50 text-xs text-gray-500 border-b border-military-700 uppercase tracking-wider font-mono">
                <th className="p-4 rounded-tl-lg">Convoy ID</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Route</th>
                <th className="p-4">Cargo</th>
                <th className="p-4">ETA</th>
                <th className="p-4 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-gray-300 divide-y divide-military-800">
              {filteredConvoys.map((convoy) => (
                <tr key={convoy.id} className="hover:bg-military-800/30 transition-colors group">
                  <td className="p-4 font-bold text-military-400 group-hover:text-military-300">{convoy.id}</td>
                  <td className="p-4 font-sans">{convoy.name}</td>
                  <td className="p-4 text-yellow-500/80">{convoy.route}</td>
                  <td className="p-4">{convoy.loadType}</td>
                  <td className="p-4">{convoy.eta}</td>
                  <td className="p-4"><Badge status={convoy.status} /></td>
                </tr>
              ))}
              {filteredConvoys.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 italic">No convoys found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ConvoyStatus;