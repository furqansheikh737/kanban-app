"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BoardData, INITIAL_DATA, Task } from '@/src/types/kanban';
import { DropResult } from '@hello-pangea/dnd';

interface KanbanContextType {
  boards: BoardData[];
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addBoard: (title: string) => void;
  addTask: (columnId: string, title: string) => void;
  deleteTask: (taskId: string, columnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (result: DropResult) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  // Boards ki array state
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('kanban-multi-boards');
    const initialBoards = saved ? JSON.parse(saved) : [INITIAL_DATA];
    
    setBoards(initialBoards);
    setActiveBoardId(initialBoards[0].id);
    
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 2. Save to LocalStorage whenever boards change
  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem('kanban-multi-boards', JSON.stringify(boards));
    }
  }, [boards]);

  // Helper: Active board nikalne ke liye
  const updateActiveBoard = (updater: (prevBoard: BoardData) => BoardData) => {
    setBoards(prevBoards => 
      prevBoards.map(board => board.id === activeBoardId ? updater(board) : board)
    );
  };

  // --- Board Functions ---
  const addBoard = (title: string) => {
    const newBoard: BoardData = {
      id: `board-${Date.now()}`,
      title: title,
      tasks: {},
      columns: {
        'col-1': { id: 'col-1', title: 'To Do', taskIds: [] },
        'col-2': { id: 'col-2', title: 'In Progress', taskIds: [] },
      },
      columnOrder: ['col-1', 'col-2'],
    };
    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  // --- Column Functions ---
  const addColumn = (title: string) => {
    const newColumnId = `col-${Date.now()}`;
    const newColumn = { id: newColumnId, title, taskIds: [] };

    updateActiveBoard(board => ({
      ...board,
      columns: { ...board.columns, [newColumnId]: newColumn },
      columnOrder: [...board.columnOrder, newColumnId],
    }));
  };

  const deleteColumn = (columnId: string) => {
    updateActiveBoard(board => {
      const newColumns = { ...board.columns };
      const taskIdsToRemove = newColumns[columnId].taskIds;
      delete newColumns[columnId];

      const newTasks = { ...board.tasks };
      taskIdsToRemove.forEach(id => delete newTasks[id]);

      return {
        ...board,
        tasks: newTasks,
        columns: newColumns,
        columnOrder: board.columnOrder.filter(id => id !== columnId),
      };
    });
  };

  // --- Task Functions ---
  const addTask = (columnId: string, title: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = { id: newTaskId, title, description: "", priority: "medium" as const };

    updateActiveBoard(board => ({
      ...board,
      tasks: { ...board.tasks, [newTaskId]: newTask },
      columns: {
        ...board.columns,
        [columnId]: {
          ...board.columns[columnId],
          taskIds: [...board.columns[columnId].taskIds, newTaskId]
        }
      }
    }));
  };

  const deleteTask = (taskId: string, columnId: string) => {
    updateActiveBoard(board => {
      const newTasks = { ...board.tasks };
      delete newTasks[taskId];
      return {
        ...board,
        tasks: newTasks,
        columns: {
          ...board.columns,
          [columnId]: {
            ...board.columns[columnId],
            taskIds: board.columns[columnId].taskIds.filter(id => id !== taskId)
          }
        }
      };
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    updateActiveBoard(board => ({
      ...board,
      tasks: {
        ...board.tasks,
        [taskId]: { ...board.tasks[taskId], ...updates }
      }
    }));
  };

  const moveTask = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    updateActiveBoard(board => {
      const start = board.columns[source.droppableId];
      const finish = board.columns[destination.droppableId];

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        return {
          ...board,
          columns: { ...board.columns, [start.id]: { ...start, taskIds: newTaskIds } }
        };
      }

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      return {
        ...board,
        columns: {
          ...board.columns,
          [start.id]: { ...start, taskIds: startTaskIds },
          [finish.id]: { ...finish, taskIds: finishTaskIds }
        }
      };
    });
  };

  return (
    <KanbanContext.Provider 
      value={{ 
        boards,
        activeBoardId,
        setActiveBoardId,
        isLoading, 
        searchTerm, 
        setSearchTerm, 
        addBoard,
        addTask, 
        deleteTask, 
        updateTask, 
        moveTask, 
        addColumn,
        deleteColumn 
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