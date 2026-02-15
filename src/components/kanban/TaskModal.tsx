"use client";
import { X, Type, AlignLeft, Tag } from 'lucide-react';
import { Task } from '@/src/types/kanban';

export default function TaskModal({ task, onClose }: { task: Task, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Type className="text-slate-400" size={20} />
            <h2 className="text-xl font-bold text-slate-800">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 pt-0 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-slate-600 font-semibold">
              <AlignLeft size={18} /> Description
            </div>
            <textarea 
              className="w-full min-h-[120px] p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Add a more detailed description..."
              defaultValue={task.description}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2 text-slate-600 font-semibold">
              <Tag size={18} /> Tags
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase">Development</span>
              <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition-colors">
                + Add Tag
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-800">Cancel</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
}