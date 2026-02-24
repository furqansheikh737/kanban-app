"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKanban } from '@/src/context/KanbanContext';

export default function FilterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Context se filter ki values nikaalna
  const { filterPriority, setFilterPriority } = useKanban();

  // Bahar click karne par band karne ka logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorities = [
    { id: 'high', label: 'High Priority', color: 'bg-red-500' },
    { id: 'medium', label: 'Medium Priority', color: 'bg-amber-400' },
    { id: 'low', label: 'Low Priority', color: 'bg-emerald-500' },
  ];

  const handlePrioritySelect = (prioId: string) => {
    // Agar pehle se wahi select hai toh toggle off (null) kar do, warna naya set karo
    if (filterPriority === prioId) {
      setFilterPriority(null);
    } else {
      setFilterPriority(prioId);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${filterPriority || isOpen ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        <Filter size={16} />
        <span>Filter{filterPriority ? ': ' + filterPriority : ''}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-[110] overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-xs uppercase text-gray-400 tracking-widest">Filter Tasks</span>
                {filterPriority && (
                  <button 
                    onClick={() => setFilterPriority(null)}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase">By Priority</p>
                {priorities.map((prio) => (
                  <button
                    key={prio.id}
                    onClick={() => handlePrioritySelect(prio.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors
                      ${filterPriority === prio.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${prio.color}`} />
                      <span className="capitalize">{prio.label}</span>
                    </div>
                    {filterPriority === prio.id && <Check size={14} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 flex justify-center border-t border-gray-100">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-700 uppercase"
              >
                Close Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}