"use client";

import React, { useState } from 'react';
import Board from '@/src/components/kanban/Board';
import { useKanban } from '@/src/context/KanbanContext';
import { 
  Search, Bell, Share2, Layout, ChevronDown, 
  Star, Users, Info, Plus, Zap, Filter, MoreHorizontal, CheckCircle2, X 
} from 'lucide-react';

export default function KanbanPage() {
  // Context se boards ka data aur functions liye
  const { boards, activeBoardId, setActiveBoardId, searchTerm, setSearchTerm, addBoard } = useKanban();
  const [showToast, setShowToast] = useState(false);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  // Header 2 ke "Board" button ke liye dropdown state
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);

  // Current active board nikalne ke liye
  const activeBoard = boards.find(b => b.id === activeBoardId);

  // --- Create Board Logic ---
  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle); // Context ka function call kiya
      setNewBoardTitle("");
      setIsModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // --- Share Logic ---
  const handleShare = async () => {
    const shareData = {
      title: `${activeBoard?.title || 'Sales Pipeline'} | Trello`,
      text: `Check out the ${activeBoard?.title} board!`,
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
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0079bf]">
      
      {/* --- Success Toast --- */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#172B4D] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-semibold tracking-wide">Action Successful!</span>
          </div>
        </div>
      )}

      {/* --- CREATE BOARD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-[#f1f2f4] w-full max-w-[320px] rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="text-sm font-semibold text-[#44546f] text-center w-full">Create board</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-3 p-1.5 text-[#44546f] hover:bg-[#dcdfe4] rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="p-4 pt-2">
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#44546f] mb-1.5 uppercase tracking-wider">
                  Board title <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter board name..."
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full p-2.5 bg-white text-[#172b4d] text-sm rounded-md border-2 border-transparent focus:border-[#0079bf] outline-none shadow-sm transition-all placeholder:text-[#44546f]/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!newBoardTitle.trim()}
                className={`w-full py-2.5 rounded-md font-bold text-sm transition-all shadow-md ${
                  newBoardTitle.trim() 
                  ? 'bg-[#0052cc] hover:bg-[#0747a6] text-white' 
                  : 'bg-[#091e42]/5 text-[#a5adba] cursor-not-allowed shadow-none'
                }`}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER 1: Top Navigation --- */}
      <header className="h-12 px-4 flex items-center justify-between bg-[#0067a3] border-b border-white/10 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/20 rounded cursor-pointer transition-colors group">
             <Layout size={18} className="text-white/80 group-hover:text-white" />
             <span className="font-bold text-white text-lg tracking-tighter">Kanban</span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {['Workspaces', 'Recent', 'Starred', 'Templates'].map((item) => (
              <button key={item} className="flex items-center gap-1 px-3 py-1.5 text-white/90 text-sm font-medium hover:bg-white/20 rounded transition-colors">
                {item} <ChevronDown size={14} />
              </button>
            ))}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="ml-1 bg-[#0052cc] hover:bg-[#0747a6] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm active:scale-95"
            >
              Create
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center group hidden md:flex">
            <Search className="absolute left-2.5 text-white/70 group-focus-within:text-[#172b4d] z-10 pointer-events-none" size={14} />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-sm pl-9 pr-3 py-1.5 rounded-md focus:bg-white focus:text-[#172b4d] focus:outline-none w-40 lg:w-64 transition-all duration-200 shadow-sm"
            />
          </div>
          <button className="p-1.5 text-white/80 hover:bg-white/20 rounded-full transition-colors"><Bell size={18} /></button>
          <div className="w-8 h-8 bg-[#DFE1E6] rounded-full flex items-center justify-center text-[#172b4d] text-xs font-bold cursor-pointer border-2 border-transparent hover:border-white transition-all ml-1">JD</div>
        </div>
      </header>

      {/* --- HEADER 2: Board Context --- */}
      <header className="h-14 px-4 flex items-center justify-between bg-black/10 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-bold text-lg px-2 py-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors">
            {activeBoard?.title || "Sales Pipeline"}
          </h2>
          <button className="p-2 text-white/90 hover:bg-white/10 rounded-md transition-all"><Star size={16} /></button>
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          
          {/* BOARD DROPDOWN TRIGGER */}
          <div className="relative">
            <button 
              onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-[#172b4d] text-sm font-semibold rounded-md shadow-sm transition-all active:scale-95"
            >
              <Layout size={16} />
              <span>Board</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isBoardDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isBoardDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsBoardDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                  <p className="px-4 py-2 text-xs font-bold text-[#44546f] uppercase tracking-wider border-b border-gray-100">Your Boards</p>
                  <div className="max-h-60 overflow-y-auto">
                    {boards.map((board, index) => (
                      <button
                        // FIX: Added index as fallback key to ensure unique IDs
                        key={board.id || `board-${index}`}
                        onClick={() => {
                          setActiveBoardId(board.id);
                          setIsBoardDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${activeBoardId === board.id ? 'text-[#0052cc] font-bold bg-blue-50/50' : 'text-[#172b4d]'}`}
                      >
                        {board.title}
                        {activeBoardId === board.id && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 p-2">
                    <button 
                      onClick={() => { setIsModalOpen(true); setIsBoardDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-2 text-sm text-[#44546f] hover:bg-gray-100 rounded transition-colors"
                    >
                      <Plus size={16} /> Create new board
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-white/10 rounded-md transition-all font-medium">
            <Filter size={16} />
            <span className="hidden lg:inline">Filter</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-[#dfe1e6] hover:bg-white text-[#172b4d] text-sm font-bold px-3 py-2 rounded-md transition-all ml-2 active:scale-95 shadow-sm"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* --- Main Board Area --- */}
      <main className="flex-1 overflow-hidden relative">
        <Board />
      </main>
    </div>
  );
}