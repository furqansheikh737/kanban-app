"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import SkeletonBoard from './SkeletonBoard';
import { useKanban } from '@/src/context/KanbanContext';
import { Plus, X } from 'lucide-react';

export default function Board() {
  const { 
    isLoading, 
    moveTask, 
    moveColumn,
    addTask, 
    deleteTask, 
    addColumn, 
    filteredBoard 
  } = useKanban();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  if (isLoading) return <SkeletonBoard />;
  if (!filteredBoard) return null;

  const handleAddList = () => {
    if (title.trim()) {
      addColumn(title);
      setTitle("");
      setIsAdding(false);
    }
  };

  const onDragEnd = (result: any) => {
    const { type } = result;
    if (type === 'column') {
      moveColumn(result);
    } else {
      moveTask(result);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div 
        className={`
          absolute inset-0 flex overflow-x-auto overflow-y-hidden 
          p-3 md:p-6 gap-4 md:gap-6 select-none
          scrollbar-thin md:scrollbar-h-4
          scrollbar-thumb-white/80
          scrollbar-track-black/40
          scrollbar-thumb-rounded-full
          hover:scrollbar-thumb-white
        `}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1769708984129-adb918f38ad5?w=1200&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black/30 pointer-events-none" />

        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="relative z-10 flex flex-nowrap gap-4 md:gap-6 items-start h-full"
            >
              {filteredBoard.columnOrder.map((columnId, index) => {
                const column = filteredBoard.columns[columnId];
                if (!column) return null;

                const tasks = column.taskIds
                  .map((taskId) => filteredBoard.tasks[taskId])
                  .filter(Boolean);

                return (
                  <Column
                    key={column.id}
                    column={column}
                    index={index}
                    tasks={tasks} 
                    onAddTask={(taskTitle) => addTask(column.id, taskTitle)}
                    onDeleteTask={(taskId) => deleteTask(taskId, column.id)}
                  />
                );
              })}
              {provided.placeholder}

              {/* Add Another List Section - Responsive Width */}
              <div className="w-[272px] md:w-[300px] shrink-0 pb-10">
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
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}