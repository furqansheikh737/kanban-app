"use client";

import React, { useState } from 'react';
import Board from '@/src/components/kanban/Board';
import { useKanban } from '@/src/context/KanbanContext';
import { Search, Bell, Share2, Layout, ChevronDown, Moon, CheckCircle2 } from 'lucide-react';

export default function KanbanPage() {
  const { searchTerm, setSearchTerm } = useKanban();
  const [showToast, setShowToast] = useState(false);

  // --- Share Logic ---
  const handleShare = async () => {
    const shareData = {
      title: 'KanbanFlow Board',
      text: 'Check out my project board on KanbanFlow!',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        // Mobile browsers ke liye default share menu
        await navigator.share(shareData);
      } else {
        // Desktop ke liye URL copy karega
        await navigator.clipboard.writeText(shareData.url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // 3 seconds baad toast gayab
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      
      {/* --- Success Toast Notification --- */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#172B4D] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-semibold tracking-wide">Board link copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* --- Single Clean Header --- */}
      <header className="h-16 px-5 flex items-center justify-between bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg z-50 relative">
        
        {/* Left Section: Branding & Board Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-[#EBECF0]">
            <div className="bg-[#0052CC] p-1.5 rounded-lg text-white shadow-sm flex items-center justify-center">
              <Layout size={20} strokeWidth={2.5} />
            </div>
            <h1 className="font-bold text-[#172B4D] text-xl tracking-tight hidden md:block italic">
              Kanban<span className="text-[#0052CC] not-italic">Flow</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer hover:bg-[#F4F5F7] p-1.5 rounded-md transition-all">
            <h2 className="font-bold text-[#172B4D] text-lg">Development Sprint</h2>
            <ChevronDown size={16} className="text-[#626F86]" />
          </div>
          <span className="bg-[#E6FCF5] text-[#087F5B] text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-widest border border-[#C3FAE8] ml-1 hidden md:inline-block">
            Active
          </span>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 max-w-md px-6 hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-[#626F86] group-focus-within:text-[#0052CC] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border-transparent focus:bg-white focus:ring-2 ring-[#0052CC]/15 border-[#DCDFE4] text-sm rounded-lg outline-none transition-all text-[#172B4D]"
            />
          </div>
        </div>

        {/* Right Section: Icons & Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex -space-x-2 mr-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm ring-1 ring-black/5">U{i}</div>
            ))}
            <div className="w-8 h-8 rounded-full bg-[#EBECF0] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#626F86] shadow-sm">+5</div>
          </div>

          {/* Share Button with Logic */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-[#EBECF0] hover:bg-[#DFE1E6] text-[#44546F] text-sm font-bold px-4 py-2 rounded-lg transition-all active:scale-95 hidden md:flex shadow-sm"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          <div className="h-6 w-[1px] bg-[#EBECF0] mx-1 hidden sm:block" />

          <button className="p-2 text-[#626F86] hover:bg-[#F4F5F7] rounded-full transition-all">
            <Bell size={20} />
          </button>
          
          <button className="p-2 text-[#626F86] hover:bg-[#F4F5F7] rounded-full transition-all">
            <Moon size={20} />
          </button>

          <div className="w-9 h-9 bg-gradient-to-br from-[#0052CC] to-[#0747A6] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-all ml-1">JD</div>
        </div>
      </header>

      {/* --- Main Board Area --- */}
      <main className="flex-1 overflow-hidden relative">
        <Board />
      </main>
    </div>
  );
}