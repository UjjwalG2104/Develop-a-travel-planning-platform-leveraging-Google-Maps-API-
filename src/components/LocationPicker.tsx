import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { Location } from '../types';

interface LocationPickerProps {
  onLocationChange: (loc: Location | null) => void;
  onDestinationChange: (dest: string) => void;
}

export function LocationPicker({ onLocationChange, onDestinationChange }: LocationPickerProps) {
  const [useCurrent, setUseCurrent] = useState(false);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggleCurrent = () => {
    if (!useCurrent) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocationChange({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setUseCurrent(true);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          alert("Could not get your location. Please enter a destination manually.");
          setLoading(false);
        }
      );
    } else {
      setUseCurrent(false);
      onLocationChange(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search for a city or landmark..."
            value={destination}
            disabled={useCurrent}
            onChange={(e) => {
              setDestination(e.target.value);
              onDestinationChange(e.target.value);
            }}
            className={cn(
              "w-full pl-11 pr-4 py-3.5 bg-brand-bg/50 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm text-brand-text-primary",
              useCurrent && "bg-brand-surface opacity-60 cursor-not-allowed"
            )}
          />
        </div>
        
        <button
          onClick={handleToggleCurrent}
          disabled={loading}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border font-medium text-sm transition-all",
            useCurrent 
              ? "bg-brand-accent text-white border-brand-accent shadow-lg shadow-blue-500/20" 
              : "bg-brand-surface/50 text-brand-text-primary border-brand-border hover:bg-brand-surface"
          )}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className={cn("w-4 h-4", useCurrent && "fill-current")} />
          )}
          <span>
            {useCurrent ? "Current Location" : "Use My Location"}
          </span>
        </button>
      </div>
      
      {useCurrent && (
        <p className="text-[11px] text-brand-accent flex items-center gap-1.5 px-1 font-medium">
          <MapPin className="w-3 h-3" />
          GPS coordinates active for precise local results
        </p>
      )}
    </div>
  );
}
