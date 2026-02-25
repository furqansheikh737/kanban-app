"use client";

import React, { useState } from "react";
import Board from "@/src/components/kanban/Board";
import HeaderDropdown from "@/src/components/kanban/HeaderDropdown";
import FilterMenu from "@/src/components/kanban/FilterMenu";
import { useKanban } from "@/src/context/KanbanContext";
import {
  Search,
  Bell,
  Layout,
  ChevronDown,
  ChevronRight,
  Star,
  Plus,
  X,
  Trash2,
  CheckCircle2,
  Menu,
  Briefcase,
  History,
  Copy,
} from "lucide-react";

export default function KanbanPage() {
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    searchTerm,
    setSearchTerm,
    addBoard,
    deleteBoard,
  } = useKanban();

  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile Sidebar Dropdowns State
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle);
      setNewBoardTitle("");
      setIsModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const toggleMobileSection = (section: string) => {
    setOpenMobileSection(openMobileSection === section ? null : section);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0079bf]">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#172B4D] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-semibold tracking-wide">Action Successful!</span>
          </div>
        </div>
      )}

      {/* Create Board Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#f1f2f4] w-full max-w-[320px] rounded-xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="text-sm font-semibold text-[#44546f] text-center w-full">Create board</h3>
              <button onClick={() => setIsModalOpen(false)} className="absolute right-3 p-1.5 text-[#44546f] hover:bg-[#dcdfe4] rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateBoard} className="p-4 pt-2">
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#44546f] mb-1.5 uppercase">Board title</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter board name..."
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full p-2.5 bg-white text-[#172b4d] text-sm rounded-md border-2 border-transparent focus:border-[#0079bf] outline-none shadow-sm"
                  required
                />
              </div>
              <button type="submit" disabled={!newBoardTitle.trim()} className={`w-full py-2.5 rounded-md font-bold text-sm ${newBoardTitle.trim() ? "bg-[#0052cc] text-white" : "bg-gray-200 text-gray-400"}`}>
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER 1 --- */}
      <header className="h-12 px-2 md:px-4 flex items-center justify-between bg-[#0067a3] border-b border-white/10 z-50">
        <div className="flex items-center gap-1 md:gap-2">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1.5 text-white/80 hover:bg-white/20 rounded transition-colors">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1">
            <Layout size={18} className="text-white/80" />
            <span className="font-bold text-white text-base md:text-lg tracking-tighter">Kanban</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            <HeaderDropdown title="Workspaces" items={[{ label: "Personal Tasks" }]} />
            <HeaderDropdown title="Recent" items={[{ label: "Recent Boards" }]} />
            <HeaderDropdown title="Starred" items={[{ label: "Starred Boards" }]} />
            <HeaderDropdown title="Template" items={[{ label: "New Templates" }]} />

            <button onClick={() => setIsModalOpen(true)} className="ml-1 bg-[#0052cc] hover:bg-[#0747a6] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
              Create
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsModalOpen(true)} className="md:hidden p-1.5 text-white/80 hover:bg-white/20 rounded-full">
            <Plus size={20} />
          </button>
          
          <div className="relative flex items-center group">
            <Search className="absolute left-2.5 text-white/70 group-focus-within:text-[#172b4d] z-10" size={14} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-sm pl-9 pr-3 py-1.5 rounded-md focus:bg-white focus:text-[#172b4d] focus:outline-none w-28 sm:w-40 lg:w-64 transition-all"
            />
          </div>
          <button className="hidden sm:block p-1.5 text-white/80 hover:bg-white/20 rounded-full">
            <Bell size={18} />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-white cursor-pointer">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR (Updated with Dropdowns) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-72 h-full bg-[#f1f2f4] shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <span className="font-bold text-[#172b4d]">Navigation</span>
              <X size={20} className="text-gray-500" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
            
            <div className="p-2 space-y-1">
              {/* Workspaces */}
              <div>
                <button onClick={() => toggleMobileSection('workspaces')} className="w-full flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg text-[#172b4d]">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} />
                    <span className="text-sm font-semibold">Workspaces</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${openMobileSection === 'workspaces' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'workspaces' && (
                  <div className="ml-9 p-2 space-y-2 text-sm text-gray-600 animate-in fade-in slide-in-from-top-1">
                    <p className="p-2 hover:bg-white rounded cursor-pointer">Personal Tasks</p>
                  </div>
                )}
              </div>

              {/* Recent */}
              <div>
                <button onClick={() => toggleMobileSection('recent')} className="w-full flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg text-[#172b4d]">
                  <div className="flex items-center gap-3">
                    <History size={18} />
                    <span className="text-sm font-semibold">Recent</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${openMobileSection === 'recent' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'recent' && (
                  <div className="ml-9 p-2 space-y-1 animate-in fade-in slide-in-from-top-1">
                    {boards.map(board => (
                      <p key={board.id} onClick={() => { setActiveBoardId(board.id); setIsMobileMenuOpen(false); }} 
                         className="p-2 hover:bg-white rounded cursor-pointer text-sm truncate">
                        {board.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Starred */}
              <div>
                <button onClick={() => toggleMobileSection('starred')} className="w-full flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg text-[#172b4d]">
                  <div className="flex items-center gap-3">
                    <Star size={18} />
                    <span className="text-sm font-semibold">Starred</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${openMobileSection === 'starred' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'starred' && (
                  <div className="ml-9 p-2 text-sm text-gray-500 italic">No starred boards</div>
                )}
              </div>

              {/* Templates */}
              <div>
                <button onClick={() => toggleMobileSection('templates')} className="w-full flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg text-[#172b4d]">
                  <div className="flex items-center gap-3">
                    <Copy size={18} />
                    <span className="text-sm font-semibold">Templates</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${openMobileSection === 'templates' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'templates' && (
                  <div className="ml-9 p-2 space-y-2 text-sm text-gray-600">
                    <p className="p-2 hover:bg-white rounded cursor-pointer">Business</p>
                    <p className="p-2 hover:bg-white rounded cursor-pointer">Design</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER 2 --- */}
      <header className="h-14 px-4 flex items-center justify-between bg-black/10 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2 md:gap-3">
          <h2 className="text-white font-bold text-base md:text-lg whitespace-nowrap">
            {activeBoard?.title || "Default"}
          </h2>
          <Star size={16} className="text-white/80 hover:text-yellow-400 cursor-pointer transition-colors" />
          
          <div className="relative">
            <button
              onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white text-[#172b4d] text-sm font-semibold rounded-md shadow-sm"
            >
              <Layout size={16} />
              <span className="inline">Boards</span>
              <ChevronDown size={14} className={isBoardDropdownOpen ? "rotate-180" : ""} />
            </button>

            {isBoardDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 py-2">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Your Boards</p>
                <div className="max-h-60 overflow-y-auto px-1">
                  {boards.map((board) => (
                    <div key={board.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${activeBoardId === board.id ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                      onClick={() => { setActiveBoardId(board.id); setIsBoardDropdownOpen(false); }}>
                      <span className="truncate text-sm">{board.title || "Default"}</span>
                      <Trash2 size={14} onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteBoard(board.id); }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <FilterMenu />
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <Board />
      </main>
    </div>
  );
}