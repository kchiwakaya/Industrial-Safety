
import React from 'react';
import { IndustrySector } from '../types';
import { HardHat, Factory, Pickaxe } from 'lucide-react';

interface Props {
  selected: IndustrySector;
  onSelect: (sector: IndustrySector) => void;
}

const IndustrySelector: React.FC<Props> = ({ selected, onSelect }) => {
  const sectors = [
    { id: IndustrySector.CONSTRUCTION, icon: HardHat, label: 'Construction' },
    { id: IndustrySector.MANUFACTURING, icon: Factory, label: 'Manufacturing' },
    { id: IndustrySector.MINING, icon: Pickaxe, label: 'Mining' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Select Industry Sector</h3>
      <div className="grid grid-cols-3 gap-3">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          const isActive = selected === sector.id;
          return (
            <button
              key={sector.id}
              onClick={() => onSelect(sector.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                isActive 
                ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span className="text-xs font-medium">{sector.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IndustrySelector;
