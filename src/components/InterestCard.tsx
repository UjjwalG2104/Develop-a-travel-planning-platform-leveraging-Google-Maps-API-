import React from 'react';
import { cn } from '../lib/utils';
import { Interest } from '../types';
import { Utensils, Compass, Landmark, Palmtree, ShoppingBag } from 'lucide-react';

interface InterestCardProps {
  interest: Interest;
  selected: boolean;
  onToggle: (interest: Interest) => void;
}

const interestConfig: Record<Interest, { label: string; icon: React.ReactNode }> = {
  gourmet: { label: 'Gourmet', icon: <Utensils className="w-5 h-5" /> },
  adventure: { label: 'Adventure', icon: <Compass className="w-5 h-5" /> },
  cultural: { label: 'Cultural', icon: <Landmark className="w-5 h-5" /> },
  relaxation: { label: 'Relaxation', icon: <Palmtree className="w-5 h-5" /> },
  shopping: { label: 'Shopping', icon: <ShoppingBag className="w-5 h-5" /> },
};

export function InterestCard({ interest, selected, onToggle }: InterestCardProps) {
  const config = interestConfig[interest];

  return (
    <button
      onClick={() => onToggle(interest)}
      className={cn(
        "flex flex-col items-start p-5 rounded-xl border transition-all duration-200 text-left",
        "hover:shadow-xl hover:shadow-blue-500/5 active:scale-[0.98]",
        selected 
          ? "bg-brand-accent text-white border-brand-accent shadow-lg shadow-blue-500/20" 
          : "bg-brand-surface/50 text-brand-text-primary border-brand-border hover:border-brand-accent/30"
      )}
    >
      <div className={cn(
        "mb-4 p-2.5 rounded-lg",
        selected ? "bg-white/20" : "bg-brand-bg"
      )}>
        {React.cloneElement(config.icon as any, { 
          className: cn("w-5 h-5", selected ? "text-white" : "text-brand-accent") 
        })}
      </div>
      <span className="font-semibold text-sm tracking-tight">{config.label}</span>
      <span className={cn(
        "text-[10px] mt-1 uppercase tracking-wider font-bold opacity-60",
        selected ? "text-white" : "text-brand-text-secondary"
      )}>
        {selected ? 'Selected' : 'Select'}
      </span>
    </button>
  );
}
