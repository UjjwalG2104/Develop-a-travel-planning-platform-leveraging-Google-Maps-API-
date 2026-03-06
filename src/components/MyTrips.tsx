import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Map, Calendar, Trash2, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { SavedItinerary } from '../types';
import { cn } from '../lib/utils';

interface MyTripsProps {
  onSelect: (itinerary: SavedItinerary) => void;
}

export function MyTrips({ onSelect }: MyTripsProps) {
  const [trips, setTrips] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/itineraries');
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      const res = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTrips(trips.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
        <p className="text-sm font-medium text-brand-text-secondary">Loading your adventures...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center mx-auto">
          <Map className="w-8 h-8 text-brand-text-secondary opacity-20" />
        </div>
        <h3 className="text-xl font-display font-bold text-brand-text-primary">No saved trips yet</h3>
        <p className="text-sm text-brand-text-secondary max-w-xs mx-auto">
          Start planning your next journey and save it to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Map className="w-5 h-5 text-brand-accent" />
        <h2 className="text-xl font-display font-bold text-brand-text-primary">My Adventures</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect(trip)}
            className="group relative bg-brand-surface/50 backdrop-blur-sm border border-brand-border rounded-2xl p-6 hover:border-brand-accent transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/5"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                    <Calendar className="w-3 h-3" />
                    {new Date(trip.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="text-lg font-display font-bold text-brand-text-primary group-hover:text-brand-accent transition-colors">
                    {trip.destination || 'Local Exploration'}
                  </h3>
                </div>
                <button
                  onClick={(e) => deleteTrip(e, trip.id)}
                  className="p-2 text-brand-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {trip.interests.map((interest) => (
                  <span key={interest} className="px-2 py-0.5 bg-brand-bg border border-brand-border rounded-md text-[9px] font-bold uppercase tracking-wider text-brand-text-secondary">
                    {interest}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-brand-border">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-text-secondary">
                  <MapPin className="w-3 h-3" />
                  {trip.places.length} Locations
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                  View Plan
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
