"use client";
import React, { useState } from "react";
import { X, AlignLeft, BarChart2 } from "lucide-react";
import { Task } from "@/src/types/kanban";
import { useKanban } from "@/src/context/KanbanContext";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const { updateTask } = useKanban();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);

  const handleSave = () => {
    console.log("Saving description:", description); // Check karne ke liye
    updateTask(task.id, {
      title: title,
      description: description,
      priority: priority,
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#f1f2f4] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start p-4">
          <div className="flex-1">
            <input
              className="w-full bg-transparent text-xl font-bold text-[#172b4d] focus:bg-white border-none rounded px-2 py-1 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => updateTask(task.id, { title })}
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-[#44546f]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Priority Selection */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#44546f] text-sm font-semibold">
              <BarChart2 size={18} /> Priority:
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="bg-white border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#172b4d] font-semibold">
              <AlignLeft size={18} /> Description
            </div>
            <textarea
              placeholder="Add a more detailed description..."
              className="w-full h-32 p-3 bg-white text-[#172b4d] text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#44546f] hover:bg-gray-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-bold text-white bg-[#0052cc] hover:bg-[#0747a6] rounded shadow-md transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
