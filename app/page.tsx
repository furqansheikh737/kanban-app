"use client";

import React, { useState } from "react";
import Board from "@/src/components/kanban/Board";
import HeaderDropdown from "@/src/components/kanban/HeaderDropdown";
import FilterMenu from "@/src/components/kanban/FilterMenu"; // Naya Filter Component import kiya
import { useKanban } from "@/src/context/KanbanContext";
import {
  Search,
  Bell,
  Share2,
  Layout,
  ChevronDown,
  Star,
  Users,
  Info,
  Plus,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  X,
  Trash2,
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

  const handleShare = async () => {
    const shareData = {
      title: `${activeBoard?.title || "Default"} | Kanban`,
      text: `Check out the ${activeBoard?.title || "Default"} board!`,
      url: typeof window !== "undefined" ? window.location.href : "",
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
      console.error("Share error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0079bf]">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#172B4D] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-semibold tracking-wide">
              Action Successful!
            </span>
          </div>
        </div>
      )}

      {/* Create Board Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-[#f1f2f4] w-full max-w-[320px] rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="text-sm font-semibold text-[#44546f] text-center w-full">
                Create board
              </h3>
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
                    ? "bg-[#0052cc] hover:bg-[#0747a6] text-white"
                    : "bg-[#091e42]/5 text-[#a5adba] cursor-not-allowed shadow-none"
                }`}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <header className="h-12 px-4 flex items-center justify-between bg-[#0067a3] border-b border-white/10 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/20 rounded cursor-pointer transition-colors group">
            <Layout
              size={18}
              className="text-white/80 group-hover:text-white"
            />
            <span className="font-bold text-white text-lg tracking-tighter">
              Kanban
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 ml-2">
            <HeaderDropdown
              title="Workspaces"
              items={[
                { label: "Personal Tasks" },
                { label: "Client Project A" },
              ]}
            />
            <HeaderDropdown
              title="Recent"
              items={[{ label: "Board: My Daily Routine" }]}
            />
            <HeaderDropdown
              title="Starred"
              items={[{ label: "Important Project" }]}
            />
            <HeaderDropdown
              title="Templates"
              items={[{ label: "Kanban Basics" }]}
            />
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
            <Search
              className="absolute left-2.5 text-white/70 group-focus-within:text-[#172b4d] z-10 pointer-events-none"
              size={14}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-sm pl-9 pr-3 py-1.5 rounded-md focus:bg-white focus:text-[#172b4d] focus:outline-none w-40 lg:w-64 transition-all duration-200 shadow-sm"
            />
          </div>
          <button className="p-1.5 text-white/80 hover:bg-white/20 rounded-full transition-colors">
            <Bell size={18} />
          </button>
          <div className="group relative ml-1">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all cursor-pointer shadow-md">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status Dot */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0067a3] rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Sub-Header (Board Controls) */}
      <header className="h-14 px-4 flex items-center justify-between bg-black/10 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-bold text-lg px-2 py-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors">
            {activeBoard?.title || "Default"}
          </h2>
          <button className="p-2 text-white/90 hover:bg-white/10 rounded-md transition-all">
            <Star size={16} />
          </button>
          <div className="h-4 w-[1px] bg-white/20 mx-1" />

          <div className="relative">
            <button
              onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-[#172b4d] text-sm font-semibold rounded-md shadow-sm transition-all active:scale-95"
            >
              <Layout size={16} />
              <span>Board</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isBoardDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isBoardDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsBoardDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                  <p className="px-4 py-2 text-xs font-bold text-[#44546f] uppercase tracking-wider border-b border-gray-100">
                    Your Boards
                  </p>
                  <div className="max-h-60 overflow-y-auto">
                    {boards.map((board) => (
                      <div
                        key={board.id}
                        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                          activeBoardId === board.id
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveBoardId(board.id);
                          setIsBoardDropdownOpen(false);
                        }}
                      >
                        <span className="truncate flex-1 px-1">
                          {board.title || "Default"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Delete board "${board.title || "Default"}"?`,
                              )
                            ) {
                              deleteBoard(board.id);
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);
                            }
                          }}
                          className={`p-1 rounded hover:bg-red-500 hover:text-white transition-opacity ${activeBoardId === board.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 p-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsBoardDropdownOpen(false);
                      }}
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* UPDATED: Ab ye real filter component hai */}
          <FilterMenu />

          <div className="flex items-center -space-x-1.5 ml-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-slate-300 border-2 border-[#0079bf] flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
              >
                U{i}
              </div>
            ))}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-[#dfe1e6] hover:bg-white text-[#172b4d] text-sm font-bold px-3 py-2 rounded-md transition-all ml-2 active:scale-95 shadow-sm"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <Board />
      </main>
    </div>
  );
}
