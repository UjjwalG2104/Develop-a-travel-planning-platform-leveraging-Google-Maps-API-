import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ItineraryResponse, User } from '../types';
import { MapPin, ExternalLink, Calendar, Sparkles, Bookmark, Check, Loader2, Share2, RefreshCw, Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ItineraryDisplayProps {
  data: ItineraryResponse & { hero_image?: string | null; audio_url?: string | null };
  user: User | null;
  destination: string;
  interests: string[];
  duration: number;
  budget: string;
  transportation: string;
  persona: string;
}

export function ItineraryDisplay({ data, user, destination, interests, duration, budget, transportation, persona }: ItineraryDisplayProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please sign in to save your trips.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          interests,
          duration,
          budget,
          transportation,
          persona,
          hero_image: data.hero_image,
          audio_url: data.audio_url,
          content: data.itinerary,
          places: data.places
        })
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Image Section */}
      {data.hero_image && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-brand-border"
        >
          <img 
            src={data.hero_image} 
            alt={destination} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent" />
          
          {/* Audio Player Overlay */}
          {data.audio_url && (
            <div className="absolute top-6 right-6">
              <audio 
                ref={audioRef} 
                src={data.audio_url} 
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <button 
                onClick={toggleAudio}
                className="flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all group shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Audio Guide</span>
                  <span className="text-xs font-bold">Listen to Summary</span>
                </div>
                <Volume2 className={cn("w-4 h-4 ml-2 opacity-50", isPlaying && "animate-pulse opacity-100")} />
              </button>
            </div>
          )}

          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-lg">
                  {duration} {duration === 1 ? 'Day' : 'Days'}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">
                  {budget}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">
                  {persona}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">
                  {transportation}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg">
                {destination || "Your Journey"}
              </h1>
            </div>
            
            <div className="flex gap-3">
              {user && (
                <button 
                  onClick={handleSave}
                  disabled={saving || saved}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl",
                    saved 
                      ? "bg-emerald-500 text-white cursor-default" 
                      : "bg-white text-brand-bg hover:bg-brand-accent hover:text-white"
                  )}
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : saved ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  {saved ? 'Saved to Trips' : 'Save Itinerary'}
                </button>
              )}
              <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        <div className="bg-brand-surface/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-brand-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-border">
            <div className="flex items-center gap-3 text-brand-accent">
              <Calendar className="w-5 h-5" />
              <h2 className="text-xl font-display font-bold">Daily Plan</h2>
            </div>
            
            <div className="flex items-center gap-3">
              {!data.hero_image && user && (
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    saved 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-brand-accent/10 text-brand-accent border border-brand-accent/20 hover:bg-brand-accent hover:text-white"
                  )}
                >
                  {saving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : saved ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Bookmark className="w-3 h-3" />
                  )}
                  {saved ? 'Saved' : 'Save Trip'}
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-brand-accent/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-accent border border-brand-accent/20">
                <Sparkles className="w-3 h-3" />
                AI Generated Plan
              </div>
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
    </div>
  );
}
