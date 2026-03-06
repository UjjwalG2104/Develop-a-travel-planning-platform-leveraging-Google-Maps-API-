import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, ArrowRight, RefreshCw, ChevronLeft } from 'lucide-react';
import { InterestCard } from './components/InterestCard';
import { LocationPicker } from './components/LocationPicker';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { generateItinerary } from './services/gemini';
import { Interest, Location, ItineraryResponse } from './types';
import { cn } from './lib/utils';

const INTERESTS: Interest[] = ['gourmet', 'adventure', 'cultural', 'relaxation', 'shopping'];

export default function App() {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleGenerate = async () => {
    if (selectedInterests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }
    if (!location && !destination) {
      alert("Please provide a destination or use your current location.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateItinerary(selectedInterests, location, destination);
      setItinerary(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setItinerary(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center shadow-sm shadow-blue-200">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-brand-text-primary tracking-tight">VoyageAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-accent transition-colors">Planner</a>
            <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-accent transition-colors">Destinations</a>
            <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-accent transition-colors">Community</a>
          </nav>

          {itinerary && (
            <button 
              onClick={reset}
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-brand-accent hover:text-brand-accent-hover transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              New Search
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <AnimatePresence mode="wait">
          {!itinerary ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-16"
            >
              {/* Hero */}
              <section className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-brand-accent rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  Next-Gen Travel Planning
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-text-primary leading-[1.1]">
                  Intelligent itineraries for the <br className="hidden md:block" />
                  <span className="text-brand-accent">modern explorer.</span>
                </h1>
                <p className="text-base text-brand-text-secondary max-w-2xl mx-auto">
                  Leveraging advanced AI and real-time mapping to curate your perfect day. 
                  Select your preferences and let VoyageAI handle the logistics.
                </p>
              </section>

              <div className="grid grid-cols-1 gap-12">
                {/* Step 1: Destination */}
                <section className="space-y-6 bg-white p-8 rounded-2xl border border-brand-border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-brand-surface border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-text-secondary">01</div>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text-secondary">Set Destination</h2>
                    </div>
                  </div>
                  <LocationPicker 
                    onLocationChange={setLocation}
                    onDestinationChange={setDestination}
                  />
                </section>

                {/* Step 2: Interests */}
                <section className="space-y-6 bg-white p-8 rounded-2xl border border-brand-border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-brand-surface border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-text-secondary">02</div>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text-secondary">Select Interests</h2>
                    </div>
                    <span className="text-[10px] font-medium text-brand-text-secondary italic">Multiple selections allowed</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {INTERESTS.map(interest => (
                      <InterestCard
                        key={interest}
                        interest={interest}
                        selected={selectedInterests.includes(interest)}
                        onToggle={toggleInterest}
                      />
                    ))}
                  </div>
                </section>
              </div>

              {/* Action */}
              <section className="flex justify-center pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className={cn(
                    "w-full md:w-auto px-10 py-4 bg-brand-text-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-slate-200",
                    "hover:bg-brand-accent hover:shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Professional Itinerary
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ItineraryDisplay data={itinerary} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-brand-text-primary rounded flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-display font-bold text-brand-text-primary">VoyageAI</span>
            </div>
            
            <div className="flex gap-10 text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">
              <a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-accent transition-colors">API Documentation</a>
            </div>

            <p className="text-[11px] text-brand-text-secondary font-medium">
              © 2024 VoyageAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
