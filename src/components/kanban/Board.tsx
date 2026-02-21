"use client";

import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import SkeletonBoard from './SkeletonBoard';
import { useKanban } from '@/src/context/KanbanContext';
import { Plus, X } from 'lucide-react';

export default function Board() {
  // Context se boards aur activeBoardId nikaala
  const { 
    boards, 
    activeBoardId, 
    isLoading, 
    moveTask, 
    addTask, 
    deleteTask, 
    addColumn, 
    searchTerm 
  } = useKanban();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  // 1. Current Active Board ka data nikalna
  const activeBoard = boards.find(b => b.id === activeBoardId);

  if (isLoading) return <SkeletonBoard />;
  if (!activeBoard) return null;

  const handleAddList = () => {
    if (title.trim()) {
      addColumn(title);
      setTitle("");
      setIsAdding(false);
    }
  };

  return (
    <DragDropContext onDragEnd={moveTask}>
      {/* Background Image & Galaxy Look */}
      <div 
        className="flex h-full min-h-[calc(100vh-64px)] overflow-x-auto p-6 gap-6 items-start scrollbar-thin relative transition-all duration-500"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1673890229294-d7ef433cadcc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDk0fHx8ZW58MHx8fHx8')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark Overlay for better card visibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Board Content */}
        <div className="relative z-10 flex gap-6 items-start">
          {activeBoard.columnOrder.map((columnId) => {
            const column = activeBoard.columns[columnId];
            
            // --- Search Filtering Logic (Specific to Active Board) ---
            const filteredTasks = column.taskIds
              .map((taskId) => activeBoard.tasks[taskId])
              .filter((task) => 
                task && task.title.toLowerCase().includes(searchTerm.toLowerCase())
              );

            return (
              <Column
                key={column.id}
                column={column}
                tasks={filteredTasks} 
                onAddTask={(taskTitle) => addTask(column.id, taskTitle)}
                onDeleteTask={(taskId) => deleteTask(taskId, column.id)}
              />
            );
          })}

          {/* Add Another List (Glassmorphism Style) */}
          <div className="min-w-[272px]">
            {isAdding ? (
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                  placeholder="Enter list title..."
                  className="w-full p-2 text-sm border-2 border-blue-500 rounded-lg outline-none mb-2 bg-white text-[#172B4D]"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleAddList} 
                    className="bg-[#0052CC] text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-md hover:bg-[#0747A6] transition-colors"
                  >
                    Add list
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)} 
                    className="text-slate-600 hover:text-red-500 p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-white font-bold transition-all shadow-lg group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                <span className="text-sm">Add another list</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}