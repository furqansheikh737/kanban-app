"use client";

import React, { useState } from 'react';
import Board from '@/src/components/kanban/Board';
import { useKanban } from '@/src/context/KanbanContext';
import { 
  Search, Bell, Share2, Layout, ChevronDown, 
  Star, Users, Info, Plus, Zap, Filter, MoreHorizontal, CheckCircle2 
} from 'lucide-react';

export default function KanbanPage() {
  const { searchTerm, setSearchTerm } = useKanban();
  const [showToast, setShowToast] = useState(false);

  // --- Share Logic ---
  const handleShare = async () => {
    const shareData = {
      title: 'Sales Pipeline | Trello',
      text: 'Check out the Sales Pipeline board!',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    /* Main Wrapper: Trello Teal Background */
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0079bf]">
      
      {/* --- Success Toast --- */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#172B4D] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-semibold tracking-wide">Board link copied!</span>
          </div>
        </div>
      )}

      {/* --- HEADER 1: Top Navigation (Darker Blue) --- */}
      <header className="h-12 px-4 flex items-center justify-between bg-[#0067a3] border-b border-white/10 z-50">
        <div className="flex items-center gap-2">
          {/* Logo Section */}
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/20 rounded cursor-pointer transition-colors group">
             <Layout size={18} className="text-white/80 group-hover:text-white" />
             <span className="font-bold text-white text-lg tracking-tighter">Kanban</span>
          </div>

          {/* Top Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {['Workspaces', 'Recent', 'Starred', 'Templates'].map((item) => (
              <button key={item} className="flex items-center gap-1 px-3 py-1.5 text-white/90 text-sm font-medium hover:bg-white/20 rounded transition-colors">
                {item} <ChevronDown size={14} />
              </button>
            ))}
            <button className="ml-1 bg-[#0052cc] hover:bg-[#0747a6] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm active:scale-95">
              Create
            </button>
          </nav>
        </div>

        {/* Top Right: Search & Profile */}
        <div className="flex items-center gap-2">
          <div className="relative group hidden md:block">
            <Search className="absolute left-2.5 top-2.2 text-white/70 group-focus-within:text-black/60 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-sm pl-8 pr-3 py-1.5 rounded-md focus:bg-white focus:text-[#172b4d] focus:outline-none w-40 lg:w-64 transition-all"
            />
          </div>
          <button className="p-1.5 text-white/80 hover:bg-white/20 rounded-full transition-colors"><Bell size={18} /></button>
          <button className="p-1.5 text-white/80 hover:bg-white/20 rounded-full transition-colors"><Info size={18} /></button>
          <div className="w-8 h-8 bg-[#DFE1E6] rounded-full flex items-center justify-center text-[#172b4d] text-xs font-bold cursor-pointer border-2 border-transparent hover:border-white transition-all ml-1">JD</div>
        </div>
      </header>

      {/* --- HEADER 2: Board Context (Lighter Teal/Transparent) --- */}
      <header className="h-14 px-4 flex items-center justify-between bg-black/10 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2">
          {/* Board Title & Star */}
          <h2 className="text-white font-bold text-lg px-2 py-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors">
            Sales Pipeline
          </h2>
          <button className="p-2 text-white/90 hover:bg-white/10 rounded-md transition-all"><Star size={16} /></button>
          
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          
          {/* Visibility & Board View */}
          <button className="flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-white/10 rounded-md transition-all font-medium">
            <Users size={16} />
            <span className="hidden sm:inline">Workspace Visible</span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1" />

          <button className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-[#172b4d] text-sm font-semibold rounded-md shadow-sm transition-all">
            <Layout size={16} />
            <span>Board</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Board Right Section */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-white/10 rounded-md transition-all font-medium">
            <Zap size={16} />
            <span className="hidden lg:inline">Automation</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-white/10 rounded-md transition-all font-medium border-r border-white/10 pr-4">
            <Filter size={16} />
            <span className="hidden lg:inline">Filter</span>
          </button>
          
          {/* Members */}
          <div className="flex items-center -space-x-1.5 ml-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-7 h-7 rounded-full bg-slate-300 border-2 border-[#0079bf] flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer hover:-translate-y-1 transition-transform">U{i}</div>
            ))}
          </div>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-[#dfe1e6] hover:bg-white text-[#172b4d] text-sm font-bold px-3 py-2 rounded-md transition-all ml-2 active:scale-95"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
          
          <button className="p-2 text-white/90 hover:bg-white/10 rounded-md transition-all"><MoreHorizontal size={20} /></button>
        </div>
      </header>

      {/* --- Main Board Area --- */}
      <main className="flex-1 overflow-hidden relative">
        {/* Iske andar aapka Board component hai jo columns aur cards handle kar raha hai */}
        <Board />
      </main>
    </div>
  );
}