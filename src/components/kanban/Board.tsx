"use client";

import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import SkeletonBoard from './SkeletonBoard';
import { useKanban } from '@/src/context/KanbanContext';
import { Plus, X } from 'lucide-react';

export default function Board() {
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
      <div 
        className={`
          absolute inset-0 flex overflow-x-auto overflow-y-hidden p-6 gap-6 select-none
          /* --- Tailwind-Scrollbar Plugin Classes --- */
          scrollbar-h-4                    /* Moti height (16px) */
          scrollbar-thumb-white/80         /* Slider ka color (Wazay white) */
          scrollbar-track-black/40         /* Track ka color (Darker for contrast) */
          scrollbar-thumb-rounded-full     /* Slider ke kinare round */
          scrollbar-track-rounded-full     /* Track ke kinare round */
          hover:scrollbar-thumb-white      /* Hover par full chamak */
          active:scrollbar-thumb-gray-200  /* Click karne par halka gray */
        `}
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1762990917190-cab2289b2a7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1MHxpVUlzblZ0akIwWXx8ZW58MHx8fHx8')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="fixed inset-0 bg-black/30 pointer-events-none" />

        {/* Board Content Wrapper */}
        <div className="relative z-10 flex flex-nowrap gap-6 items-start h-full">
          {activeBoard.columnOrder.map((columnId) => {
            const column = activeBoard.columns[columnId];
            if (!column) return null;

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

          {/* Add Another List Section */}
          <div className="min-w-[272px] shrink-0 pb-10">
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