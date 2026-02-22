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
    /* Column Container: 'group/column' name de diya taake nesting clear rahe */
    <div className="flex flex-col w-72 bg-[#ebecf0] rounded-xl max-h-full shadow-xl border border-white/20 overflow-hidden group/column shrink-0">
      
      {/* --- Column Header --- */}
      <div className="p-3 pb-1 flex justify-between items-center">
        <h2 className="font-bold text-[#172b4d] text-sm px-2 py-1 flex-1 cursor-pointer truncate">
          {column.title}
        </h2>
        
        <div className="flex items-center gap-1">
          {/* Delete Button: Ab sirf is column ke hover par hi dikhega */}
          <button 
            onClick={handleDeleteList}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-all opacity-0 group-hover/column:opacity-100"
            title="Delete list"
          >
            <Trash2 size={14} />
          </button>
          
          <button className="p-1.5 text-[#44546f] hover:bg-[#dcdfe4] rounded-md transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* --- Droppable Task Area --- */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            /* Scrollbar styling for column tasks */
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
        {/* Note: Ensure NewTaskForm uses 'group/btn' inside it for the Plus icon animation */}
        <NewTaskForm onAdd={onAddTask} />
      </div>
    </div>
  );
}