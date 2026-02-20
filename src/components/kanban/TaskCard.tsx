"use client";

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/src/types/kanban';
import { Trash2, AlignLeft, CheckSquare, Clock } from 'lucide-react';

interface Props {
  task: Task;
  index: number;
  onDelete: () => void;
}

export default function TaskCard({ task, index, onDelete }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative mb-2 p-3 rounded-lg transition-all duration-200 cursor-pointer
            ${snapshot.isDragging 
              ? 'bg-white shadow-2xl rotate-2 ring-2 ring-blue-500/20' 
              : 'bg-white shadow-sm border-b border-[#091e42]/20 hover:bg-[#f7f8f9] hover:shadow-md'
            }
          `}
        >
          {/* --- TOP ROW: Trello Labels (Colored Bars) --- */}
          <div className="flex flex-wrap gap-1 mb-2">
            <div className={`h-2 w-10 rounded-full ${
              task.priority === 'high' ? 'bg-red-500' : 
              task.priority === 'medium' ? 'bg-amber-400' : 
              'bg-emerald-500'
            }`} />
          </div>

          {/* --- MIDDLE ROW: Task Title (Dark Text Fix) --- */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-[14px] font-medium text-[#172b4d] leading-snug break-words">
              {task.title}
            </h3>
            
            {/* Delete Button (Visible on Hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-[#44546f] hover:text-red-600 hover:bg-red-50 rounded transition-all ml-2"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* --- BOTTOM ROW: Metadata & Avatars --- */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-[#44546f]">
              {/* Description Indicator */}
              <div className="flex items-center gap-1 hover:text-[#172b4d]">
                <AlignLeft size={14} />
              </div>

              {/* ID or Date Badge */}
              <div className="flex items-center gap-1 bg-[#091e42]/5 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#44546f] uppercase tracking-wider">
                <Clock size={10} className="mr-0.5" />
                {task.id.slice(-4)}
              </div>
            </div>
            
            {/* Member Avatar Circle (JD like your header) */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] font-bold text-white border-white shadow-sm ring-1 ring-black/5">
              JD
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}