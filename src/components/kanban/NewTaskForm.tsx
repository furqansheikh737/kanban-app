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
      <button
        onClick={() => setIsAdding(true)}
        className="group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#44546f] hover:bg-[#091e42]/10 transition-all duration-200"
      >
        <Plus 
          size={18} 
          className="transition-transform duration-300 group-hover:rotate-90 text-[#44546f]" 
        />
        <span className="text-sm font-medium">Add a card</span>
      </button>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Fix: Background pure white aur text dark navy (#172b4d) kiya hai */}
        <textarea
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this card..."
          className="w-full bg-white text-[#172b4d] text-sm p-2.5 rounded-lg shadow-[0_1px_1px_rgba(9,30,66,.25)] border-none focus:ring-2 focus:ring-[#0079bf] outline-none placeholder:text-[#44546f] resize-none min-h-[80px] transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <div className="flex items-center gap-2 pb-1">
          <button
            type="submit"
            className="bg-[#0052CC] hover:bg-[#0747A6] text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all active:scale-95"
          >
            Add card
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1.5 text-[#44546f] hover:bg-[#091e42]/10 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}