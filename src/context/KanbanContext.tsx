"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BoardData, INITIAL_DATA, Task } from '@/src/types/kanban';
import { DropResult } from '@hello-pangea/dnd';

interface KanbanContextType {
  data: BoardData | null;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addTask: (columnId: string, title: string) => void;
  deleteTask: (taskId: string, columnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (result: DropResult) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void; // Naya function interface mein
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BoardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('kanban-data');
    setData(saved ? JSON.parse(saved) : INITIAL_DATA);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('kanban-data', JSON.stringify(data));
    }
  }, [data]);

  // --- List Delete Karne Ka Logic ---
  const deleteColumn = (columnId: string) => {
    setData((prev) => {
      if (!prev) return prev;

      const newColumns = { ...prev.columns };
      const taskIdsToRemove = newColumns[columnId].taskIds;
      
      // 1. Column delete karo
      delete newColumns[columnId];

      // 2. Us column ke saare tasks bhi delete karo
      const newTasks = { ...prev.tasks };
      taskIdsToRemove.forEach((id) => {
        delete newTasks[id];
      });

      // 3. columnOrder se ID nikalo
      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns,
        columnOrder: prev.columnOrder.filter((id) => id !== columnId),
      };
    });
  };

  const addColumn = (title: string) => {
    const newColumnId = `col-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: title,
      taskIds: [],
    };

    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [newColumnId]: newColumn,
        },
        columnOrder: [...prev.columnOrder, newColumnId],
      };
    });
  };

  const addTask = (columnId: string, title: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = { 
      id: newTaskId, 
      title, 
      description: "", 
      priority: "medium" as const 
    };

    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: { ...prev.tasks, [newTaskId]: newTask },
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            taskIds: [...prev.columns[columnId].taskIds, newTaskId]
          }
        }
      };
    });
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setData(prev => {
      if (!prev) return prev;
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      
      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            taskIds: prev.columns[columnId].taskIds.filter(id => id !== taskId)
          }
        }
      };
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...prev.tasks[taskId], ...updates }
        }
      };
    });
  };

  const moveTask = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    setData(prev => {
      if (!prev) return prev;

      const start = prev.columns[source.droppableId];
      const finish = prev.columns[destination.droppableId];

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [start.id]: { ...start, taskIds: newTaskIds }
          }
        };
      }

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [start.id]: { ...start, taskIds: startTaskIds },
          [finish.id]: { ...finish, taskIds: finishTaskIds }
        }
      };
    });
  };

  return (
    <KanbanContext.Provider 
      value={{ 
        data, 
        isLoading, 
        searchTerm, 
        setSearchTerm, 
        addTask, 
        deleteTask, 
        updateTask, 
        moveTask, 
        addColumn,
        deleteColumn // Value mein pass kiya
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) throw new Error("useKanban must be used within KanbanProvider");
  return context;
};