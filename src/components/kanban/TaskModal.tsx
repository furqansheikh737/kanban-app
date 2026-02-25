"use client";

import React, { useState } from 'react';
import { X, AlignLeft, Tag, Check, CheckSquare, Trash2, Calendar } from 'lucide-react';
import { Task, Label } from '@/src/types/kanban';
import { useKanban } from '@/src/context/KanbanContext';
import { motion } from 'framer-motion';

interface Props {
  task: Task;
  onClose: () => void;
}

const AVAILABLE_LABELS: Label[] = [
  { id: 'l1', text: 'Urgent', color: 'bg-red-500' },
  { id: 'l2', text: 'Feature', color: 'bg-blue-500' },
  { id: 'l3', text: 'Bug', color: 'bg-orange-500' },
  { id: 'l4', text: 'Tech Debt', color: 'bg-purple-500' },
  { id: 'l5', text: 'Design', color: 'bg-pink-500' },
];

export default function TaskModal({ task, onClose }: Props) {
  const { updateTask, toggleLabel, addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useKanban();
  
  const [description, setDescription] = useState(task.description || "");
  const [newCheckItem, setNewCheckItem] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleDescBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description });
    }
  };

  const handleAddCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCheckItem.trim()) {
      addChecklistItem(task.id, newCheckItem.trim());
      setNewCheckItem("");
      setIsAddingItem(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value; // yyyy-mm-dd
    if (rawDate) {
      const dateObj = new Date(rawDate);
      const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
      });
      updateTask(task.id, { dueDate: formattedDate });
    }
  };

  const totalItems = task.checklists?.length || 0;
  const completedItems = task.checklists?.filter(i => i.completed).length || 0;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#f4f5f7] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 md:p-6 pb-2">
          <div className="flex gap-3 items-start pr-8">
            <div className="mt-1 text-[#44546f] hidden sm:block"><AlignLeft size={20} /></div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-[#172b4d]">{task.title}</h2>
              <p className="text-xs text-[#44546f]">in list <span className="underline cursor-pointer">In Progress</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#44546f]">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto space-y-6 md:space-y-8 scrollbar-thin scrollbar-thumb-gray-300">
          
          {/* Labels, Priority & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#44546f] uppercase flex items-center gap-2">
                <Tag size={12} /> Labels
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LABELS.map((label) => {
                  const isSelected = task.labels?.some(l => l.id === label.id);
                  return (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(task.id, label)}
                      className={`h-8 px-2 rounded text-[11px] font-bold text-white transition-all ${label.color} ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {label.text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#44546f] uppercase">Priority</h3>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateTask(task.id, { priority: p })}
                    className={`flex-1 py-1.5 rounded text-[11px] font-bold capitalize transition-all ${task.priority === p ? 'bg-[#0052cc] text-white shadow-md' : 'bg-black/5 text-[#44546f] hover:bg-black/10'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#44546f] uppercase flex items-center gap-2">
                <Calendar size={12} /> Due Date
              </h3>
              <div className="relative group">
                <input 
                  type="date" 
                  onChange={handleDateChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded text-[11px] font-bold text-[#172b4d] flex items-center justify-between transition-colors">
                  <span>{task.dueDate || "Select date"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AlignLeft size={18} className="text-[#44546f]" />
              <h3 className="font-semibold text-[#172b4d]">Description</h3>
            </div>
            <textarea
              className="w-full bg-white border-2 border-transparent focus:border-[#0052cc] rounded-lg p-3 text-sm text-[#172b4d] outline-none transition-all shadow-sm min-h-[100px] md:min-h-[120px] resize-none"
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescBlur}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare size={18} className="text-[#44546f]" />
                <h3 className="font-semibold text-[#172b4d]">Checklist</h3>
              </div>
              {!isAddingItem && (
                <button 
                  onClick={() => setIsAddingItem(true)}
                  className="bg-black/5 hover:bg-black/10 text-[#172b4d] text-xs font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Add Item
                </button>
              )}
            </div>

            {totalItems > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-[#44546f] w-8">{progress}%</span>
                <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-[#0052cc]'}`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              {task.checklists?.map((item) => (
                <div key={item.id} className="group flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg transition-colors">
                  <button 
                    onClick={() => toggleChecklistItem(task.id, item.id)}
                    className={`w-5 h-5 shrink-0 flex items-center justify-center rounded border-2 transition-all ${item.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300'}`}
                  >
                    {item.completed && <Check size={14} strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-sm break-words ${item.completed ? 'line-through text-[#44546f]' : 'text-[#172b4d]'}`}>
                    {item.text}
                  </span>
                  <button 
                    onClick={() => deleteChecklistItem(task.id, item.id)}
                    className="sm:opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {isAddingItem && (
              <form onSubmit={handleAddCheckItem} className="mt-2 space-y-2">
                <input
                  autoFocus
                  className="w-full bg-white border-2 border-[#0052cc] rounded-lg p-2 text-sm text-[#172b4d] outline-none shadow-md"
                  placeholder="Add an item..."
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <button type="submit" className="bg-[#0052cc] text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-[#0747a6]">Add</button>
                  <button type="button" onClick={() => setIsAddingItem(false)} className="text-[#44546f] p-1.5 hover:bg-black/5 rounded"><X size={18} /></button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t flex justify-end">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-[#0052cc] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0747a6] transition-all shadow-lg active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}