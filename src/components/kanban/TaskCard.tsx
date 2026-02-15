"use client";

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/src/types/kanban';
import { Trash2, GripVertical } from 'lucide-react';

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
            group relative mb-3 p-4 rounded-xl transition-all duration-300
            ${snapshot.isDragging 
              ? 'bg-white/30 backdrop-blur-xl border-blue-400/50 shadow-2xl scale-105' 
              : 'bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-white/15 hover:shadow-lg'
            }
          `}
        >
          {/* Top Row: Priority or Category (Optional) */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-blue-200 transition-colors">
                {task.title}
              </h3>
            </div>
            
            {/* Delete Button (Visible on Hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Bottom Row: Metadata */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <GripVertical size={14} className="text-white/20" />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                ID: {task.id.slice(-4)}
              </span>
            </div>
            
            {/* Priority Indicator */}
            <div className={`h-1.5 w-8 rounded-full shadow-sm ${
              task.priority === 'high' ? 'bg-red-500/80 shadow-red-500/20' : 
              task.priority === 'medium' ? 'bg-amber-500/80 shadow-amber-500/20' : 
              'bg-emerald-500/80 shadow-emerald-500/20'
            }`} />
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-white/5 to-purple-500/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
      )}
    </Draggable>
  );
}