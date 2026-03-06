import ReactMarkdown from 'react-markdown';
import { ItineraryResponse } from '../types';
import { MapPin, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ItineraryDisplayProps {
  data: ItineraryResponse;
}

export function ItineraryDisplay({ data }: ItineraryDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10"
    >
      <div className="bg-brand-surface/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-brand-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-border">
          <div className="flex items-center gap-3 text-brand-accent">
            <Calendar className="w-5 h-5" />
            <h2 className="text-xl font-display font-bold">Daily Itinerary</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-accent border border-brand-accent/20">
            <Sparkles className="w-3 h-3" />
            AI Generated Plan
          </div>
        </div>
        
        <div className="markdown-body">
          <ReactMarkdown>{data.itinerary}</ReactMarkdown>
        </div>
      </div>

      {data.places.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-accent" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text-secondary">
              Verified Locations
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.places.map((place, idx) => (
              <a
                key={idx}
                href={place.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-5 bg-brand-surface/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-accent hover:shadow-xl hover:shadow-blue-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-sm text-brand-text-primary group-hover:text-brand-accent transition-colors line-clamp-1">
                    {place.title}
                  </span>
                  <ExternalLink className="w-3 h-3 text-brand-text-secondary group-hover:text-brand-accent transition-all" />
                </div>
                <span className="text-[10px] font-medium text-brand-text-secondary uppercase tracking-tight">
                  View on Google Maps
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
