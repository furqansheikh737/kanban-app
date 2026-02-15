"use client";

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  onAdd: (title: string, description: string) => void;
}

export default function NewTaskForm({ onAdd }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, "");
      setTitle("");
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      /* 'group' class poore button par lagayi hai taake hover kahin bhi ho, icon animate kare */
      <button
        onClick={() => setIsAdding(true)}
        className="group w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-300 active:scale-95"
      >
        {/* 'group-hover' icon par lagaya hai jo button ke hover par trigger hoga */}
        <Plus 
          size={18} 
          className="transition-transform duration-500 ease-out group-hover:rotate-180 text-white/50 group-hover:text-white" 
        />
        <span className="text-sm font-medium tracking-wide">Add a card</span>
      </button>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <form onSubmit={handleSubmit} className="bg-white/15 backdrop-blur-2xl p-3 rounded-xl border border-white/20 shadow-2xl">
        <textarea
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-black/20 text-white text-sm p-3 rounded-lg border border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none placeholder:text-white/30 resize-none min-h-[90px] transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center gap-2 mt-3">
          <button
            type="submit"
            className="bg-[#0052CC] hover:bg-[#0747A6] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all active:scale-90"
          >
            Add card
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}