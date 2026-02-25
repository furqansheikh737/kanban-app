"use client";

import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import NewTaskForm from './NewTaskForm';
import { Column as ColumnType, Task } from '@/src/types/kanban';
import { Trash2, MoreHorizontal } from 'lucide-react';
import { useKanban } from '@/src/context/KanbanContext';

interface Props {
  column: ColumnType;
  tasks: Task[];
  index: number; 
  onAddTask: (title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function Column({ column, tasks, index, onAddTask, onDeleteTask }: Props) {
  const { deleteColumn, updateColumnTitle, searchTerm } = useKanban();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleDeleteList = () => {
    if (window.confirm("Bhai, kya aap waqai ye poori list delete karna chahte hain?")) {
      deleteColumn(column.id);
    }
  };

  const handleRename = () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      updateColumnTitle(column.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(column.title);
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="flex flex-col w-72 bg-[#ebecf0] rounded-xl max-h-full shadow-xl border border-white/20 overflow-hidden group/column shrink-0"
        >
          {/* --- Column Header --- */}
          <div 
            {...provided.dragHandleProps} 
            className="p-3 pb-1 flex justify-between items-center cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    className="text-sm font-bold text-[#172b4d] px-2 py-1 w-full border-2 border-blue-500 rounded outline-none bg-white"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              ) : (
                <>
                  <h2 
                    onClick={() => setIsEditing(true)}
                    className="font-bold text-[#172b4d] text-sm px-2 py-1 cursor-pointer truncate hover:bg-black/5 rounded transition-colors"
                  >
                    {column.title}
                  </h2>
                  
                  {/* --- TASK COUNTER BADGE --- */}
                  <span className="bg-[#091e42]/10 text-[#44546f] text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {tasks.length}
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {/* FIX: Mobile par hamesha dikhega (opacity-100), Desktop par sirf hover par (md:opacity-0 md:group-hover/column:opacity-100) */}
              <button 
                onClick={handleDeleteList}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-all opacity-100 md:opacity-0 md:group-hover/column:opacity-100 bg-red-50 md:bg-transparent"
                title="Delete list"
              >
                <Trash2 size={15} />
              </button>
              
              <button className="p-1.5 text-[#44546f] hover:bg-[#dcdfe4] rounded-md transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* --- Droppable Task Area --- */}
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`px-2 py-1 transition-colors flex-1 min-h-[100px] max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent ${
                  snapshot.isDraggingOver ? 'bg-[#dfe1e6]' : 'bg-transparent'
                }`}
              >
                {tasks.map((task, index) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    index={index} 
                    onDelete={() => onDeleteTask(task.id)} 
                  />
                ))}
                
                {provided.placeholder}

                {tasks.length === 0 && searchTerm && (
                  <div className="text-center py-6 text-[#44546f] text-xs font-medium italic">
                    No matching tasks found
                  </div>
                )}
              </div>
            )}
          </Droppable>

          {/* --- Footer: Add Card Section --- */}
          <div className="p-2 mt-auto">
            <NewTaskForm onAdd={onAddTask} />
          </div>
        </div>
      )}
    </Draggable>
  );
}