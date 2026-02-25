"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKanban } from '@/src/context/KanbanContext';

export default function FilterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { filterPriority, setFilterPriority } = useKanban();

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
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 active:scale-95 shadow-sm
          ${filterPriority || isOpen 
            ? 'bg-white text-[#0079bf] ring-2 ring-white/20' 
            : 'bg-white/20 text-white hover:bg-white/30 border border-white/10'}`}
      >
        <SlidersHorizontal size={16} />
        <span>Filter{filterPriority ? ': ' + filterPriority : ''}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            /* FIX: right-0 ensures it stays within screen on mobile */
            className="absolute right-0 md:left-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[110] overflow-hidden origin-top-right md:origin-top-left"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                <div className="flex items-center gap-2">
                   <Filter size={14} className="text-gray-400" />
                   <span className="font-black text-[10px] uppercase text-gray-400 tracking-widest">Filter Tasks</span>
                </div>
                {filterPriority && (
                  <button 
                    onClick={() => setFilterPriority(null)}
                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-black text-gray-500 mb-2 uppercase ml-1">By Priority</p>
                {priorities.map((prio) => (
                  <button
                    key={prio.id}
                    onClick={() => handlePrioritySelect(prio.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all duration-200
                      ${filterPriority === prio.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ${prio.color} 
                        ${filterPriority === prio.id ? 'ring-white/50' : 'ring-transparent'}`} 
                      />
                      <span className="font-semibold">{prio.label}</span>
                    </div>
                    {filterPriority === prio.id && <Check size={16} strokeWidth={3} className="animate-in zoom-in duration-300" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50/80 backdrop-blur-sm p-3 flex justify-center border-t border-gray-100">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
              >
                Close Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}