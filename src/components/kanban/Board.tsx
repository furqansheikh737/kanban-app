"use client";

import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import SkeletonBoard from './SkeletonBoard';
import { useKanban } from '@/src/context/KanbanContext';
import { Plus, X } from 'lucide-react';

export default function Board() {
  // Context se searchTerm bhi nikala filter karne ke liye
  const { data, isLoading, moveTask, addTask, deleteTask, addColumn, searchTerm } = useKanban();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  if (isLoading) return <SkeletonBoard />;
  if (!data) return null;

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
          backgroundImage: `url('https://images.unsplash.com/photo-1770110000218-e9376e581258?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark Overlay for better card visibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Board Content */}
        <div className="relative z-10 flex gap-6 items-start">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            
            // --- Search Filtering Logic ---
            // Har column ke tasks ko filter kar rahe hain title ke basis par
            const filteredTasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter((task) => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
              );

            return (
              <Column
                key={column.id}
                column={column}
                tasks={filteredTasks} // Sirf filtered tasks pass honge
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