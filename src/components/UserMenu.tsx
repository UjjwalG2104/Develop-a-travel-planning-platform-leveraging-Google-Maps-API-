import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, Map, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onViewTrips: () => void;
}

export function UserMenu({ user, onLogout, onViewTrips }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border hover:border-brand-accent transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center">
          <UserIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs font-bold text-brand-text-primary max-w-[100px] truncate">{user.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-brand-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-brand-surface border border-brand-border rounded-xl shadow-2xl overflow-hidden z-[60]"
          >
            <div className="p-2">
              <button
                onClick={() => { onViewTrips(); setIsOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-text-primary hover:bg-brand-bg rounded-lg transition-colors"
              >
                <Map className="w-4 h-4 text-brand-accent" />
                My Trips
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-text-primary hover:bg-brand-bg rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-brand-text-secondary" />
                Settings
              </button>
              <div className="my-1 border-t border-brand-border" />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
