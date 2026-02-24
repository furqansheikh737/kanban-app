"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
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
    moveColumn, // NEW: Added from context
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

  // NEW: Handle Drag End for both Tasks and Columns
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
          absolute inset-0 flex overflow-x-auto overflow-y-hidden p-6 gap-6 select-none
          scrollbar-h-4
          scrollbar-thumb-white/80
          scrollbar-track-black/40
          scrollbar-thumb-rounded-full
          scrollbar-track-rounded-full
          hover:scrollbar-thumb-white
          active:scrollbar-thumb-gray-200
        `}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1769708984129-adb918f38ad5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="fixed inset-0 bg-black/30 pointer-events-none" />

        {/* NEW: Horizontal Droppable for Column Sorting */}
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="relative z-10 flex flex-nowrap gap-6 items-start h-full"
            >
              {activeBoard.columnOrder.map((columnId, index) => {
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
                    index={index} // NEW: Added index for Draggable
                    tasks={filteredTasks} 
                    onAddTask={(taskTitle) => addTask(column.id, taskTitle)}
                    onDeleteTask={(taskId) => deleteTask(taskId, column.id)}
                  />
                );
              })}
              {provided.placeholder}

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
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}