"use client";

import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import NewTaskForm from './NewTaskForm';
import { Column as ColumnType, Task } from '@/src/types/kanban';
import { Trash2, MoreHorizontal } from 'lucide-react';
import { useKanban } from '@/src/context/KanbanContext';

interface Props {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function Column({ column, tasks, onAddTask, onDeleteTask }: Props) {
  const { deleteColumn, searchTerm } = useKanban();

  const handleDeleteList = () => {
    if (window.confirm("Bhai, kya aap waqai ye poori list delete karna chahte hain?")) {
      deleteColumn(column.id);
    }
  };

  return (
    /* Background ko bg-transparent ya bohat halka bg-white/10 rakha hai */
    <div className="flex flex-col w-72 bg-white/10 backdrop-blur-md rounded-2xl max-h-full border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden group transition-all duration-300">
      
      {/* Column Header: Text ko white kiya taake dark background par nazar aaye */}
      <div className="p-4 flex justify-between items-center bg-white/10 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-bold text-white text-sm px-1 truncate drop-shadow-md">
            {column.title}
          </h2>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-bold backdrop-blur-sm border border-white/10">
            {tasks.length}
          </span>
        </div>

        {/* List Actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleDeleteList}
            className="p-1.5 text-white/70 hover:bg-red-500/80 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90"
          >
            <Trash2 size={15} />
          </button>
          <button className="p-1.5 text-white/70 hover:bg-white/10 rounded-lg">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-3 transition-colors flex-1 min-h-[150px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide ${
              snapshot.isDraggingOver ? 'bg-white/5' : ''
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

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-xl text-white/40 text-[11px] font-medium italic">
                {searchTerm ? "No matching tasks" : "No cards here"}
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Task Creation Form: Iska input bhi glass style ka hona chahiye */}
      <div className="p-3 bg-white/5 border-t border-white/10">
        <NewTaskForm onAdd={onAddTask} />
      </div>
    </div>
  );
}