"use client";

import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/src/types/kanban";
import {
  Trash2,
  AlignLeft,
  Calendar,
  Edit2,
  Check,
  X,
  CheckSquare,
} from "lucide-react";
import { useKanban } from "@/src/context/KanbanContext";
import TaskModal from "./TaskModal";

interface Props {
  task: Task;
  index: number;
  onDelete: () => void;
}

export default function TaskCard({ task, index, onDelete }: Props) {
  const { updateTask } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(task.title);
    }
  };

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  // Checklist progress calculation
  const totalItems = task.checklists?.length || 0;
  const completedItems =
    task.checklists?.filter((i) => i.completed).length || 0;

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => !isEditing && setIsModalOpen(true)}
            className={`
              group/card relative mb-2 p-3 rounded-lg transition-all duration-200 cursor-pointer
              ${
                snapshot.isDragging
                  ? "bg-white shadow-2xl rotate-2 ring-2 ring-blue-500/20 z-50"
                  : "bg-white shadow-sm border-b border-[#091e42]/20 hover:bg-[#f7f8f9] hover:shadow-md"
              }
            `}
          >
            {/* --- TOP ROW: Labels & Priority --- */}
            <div className="flex flex-col gap-1.5 mb-2">
              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.labels.map((label) => (
                    <span
                      key={label.id}
                      className={`${label.color} text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider`}
                    >
                      {label.text}
                    </span>
                  ))}
                </div>
              )}

              <div
                className={`h-1 w-8 rounded-full ${
                  task.priority === "high"
                    ? "bg-red-500"
                    : task.priority === "medium"
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                }`}
              />
            </div>

            {/* --- MIDDLE ROW: Title / Edit Mode --- */}
            <div className="flex justify-between items-start mb-1 gap-2">
              {isEditing ? (
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    autoFocus
                    className="w-full text-[14px] p-1 text-[#172b4d] border-2 border-[#0052cc] rounded outline-none resize-none bg-white"
                    rows={2}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onMouseDown={handleSave}
                      className="bg-[#0052cc] text-white p-1 rounded hover:bg-[#0747a6]"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onMouseDown={() => {
                        setIsEditing(false);
                        setEditedTitle(task.title);
                      }}
                      className="bg-gray-200 text-gray-600 p-1 rounded hover:bg-gray-300"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <h3 className="text-[14px] font-medium text-[#172b4d] leading-snug break-words flex-1">
                  {task.title}
                </h3>
              )}

              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-1 text-[#44546f] hover:text-[#0052cc] hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-1 text-[#44546f] hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* --- BOTTOM ROW: Metadata (Updated with Date & Checklist) --- */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-[#44546f]">
                {task.description && <AlignLeft size={14} />}

                {/* Due Date Badge */}
                <div className="flex items-center gap-1 bg-[#091e42]/5 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#44546f] hover:bg-[#091e42]/10 transition-colors">
                  <Calendar size={11} className="text-[#44546f]" />
                  <span>{task.dueDate || "16 July"}</span>
                </div>

                {/* Checklist Badge (Only shows if items exist) */}
                {totalItems > 0 && (
                  <div
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${completedItems === totalItems ? "bg-green-500 text-white" : "bg-[#091e42]/5 text-[#44546f]"}`}
                  >
                    <CheckSquare size={11} />
                    <span>
                      {completedItems}/{totalItems}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all cursor-pointer shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {isModalOpen && (
        <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
