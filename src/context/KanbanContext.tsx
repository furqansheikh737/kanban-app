"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BoardData, INITIAL_DATA, Task, Label } from '@/src/types/kanban';
import { DropResult } from '@hello-pangea/dnd';

interface KanbanContextType {
  boards: BoardData[];
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  // --- Filter Logic ---
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  filteredBoard: BoardData | null;
  // --------------------
  addBoard: (title: string) => void;
  deleteBoard: (id: string) => void;
  addTask: (columnId: string, title: string) => void;
  deleteTask: (taskId: string, columnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (result: DropResult) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  moveColumn: (result: DropResult) => void;
  toggleLabel: (taskId: string, label: Label) => void;
  // --- Checklist Functions (Added) ---
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kanban-multi-boards');
    const initialBoards = saved ? JSON.parse(saved) : [INITIAL_DATA];
    setBoards(initialBoards);
    setActiveBoardId(initialBoards[0]?.id || "");
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && boards.length > 0) {
      localStorage.setItem('kanban-multi-boards', JSON.stringify(boards));
    }
  }, [boards, isLoading]);

  const filteredBoard = useMemo(() => {
    const activeBoard = boards.find(b => b.id === activeBoardId);
    if (!activeBoard) return null;
    if (!searchTerm && !filterPriority) return activeBoard;

    const newTasks = { ...activeBoard.tasks };
    const filteredTasks: { [key: string]: Task } = {};

    Object.keys(newTasks).forEach(taskId => {
      const task = newTasks[taskId];
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority ? task.priority === filterPriority : true;

      if (matchesSearch && matchesPriority) {
        filteredTasks[taskId] = task;
      }
    });

    const newColumns = { ...activeBoard.columns };
    Object.keys(newColumns).forEach(colId => {
      newColumns[colId] = {
        ...newColumns[colId],
        taskIds: newColumns[colId].taskIds.filter(id => filteredTasks[id])
      };
    });

    return { ...activeBoard, tasks: filteredTasks, columns: newColumns };
  }, [boards, activeBoardId, searchTerm, filterPriority]);

  const updateActiveBoard = (updater: (prevBoard: BoardData) => BoardData) => {
    setBoards(prevBoards => 
      prevBoards.map(board => board.id === activeBoardId ? updater(board) : board)
    );
  };

  const addBoard = (title: string) => {
    const newBoard: BoardData = {
      id: `board-${crypto.randomUUID()}`,
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

  const deleteBoard = (id: string) => {
    setBoards(prevBoards => {
      const filteredBoards = prevBoards.filter(board => board.id !== id);
      if (id === activeBoardId && filteredBoards.length > 0) {
        setActiveBoardId(filteredBoards[0].id);
      }
      return filteredBoards;
    });
  };

  const addColumn = (title: string) => {
    const newColumnId = `col-${crypto.randomUUID()}`;
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
      const taskIdsToRemove = newColumns[columnId]?.taskIds || [];
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

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    updateActiveBoard(board => ({
      ...board,
      columns: { ...board.columns, [columnId]: { ...board.columns[columnId], title: newTitle } }
    }));
  };

  const addTask = (columnId: string, title: string) => {
    const newTaskId = `task-${crypto.randomUUID()}`;
    const newTask: Task = { 
      id: newTaskId, 
      title, 
      description: "", 
      priority: "medium",
      labels: [],
      checklists: [] // Initialize empty checklist
    };
    updateActiveBoard(board => ({
      ...board,
      tasks: { ...board.tasks, [newTaskId]: newTask },
      columns: {
        ...board.columns,
        [columnId]: { ...board.columns[columnId], taskIds: [...board.columns[columnId].taskIds, newTaskId] }
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
          [columnId]: { ...board.columns[columnId], taskIds: board.columns[columnId].taskIds.filter(id => id !== taskId) }
        }
      };
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    updateActiveBoard(board => ({
      ...board,
      tasks: { ...board.tasks, [taskId]: { ...board.tasks[taskId], ...updates } }
    }));
  };

  const toggleLabel = (taskId: string, label: Label) => {
    updateActiveBoard(board => {
      const task = board.tasks[taskId];
      const labels = task.labels || [];
      const hasLabel = labels.some(l => l.id === label.id);
      const updatedLabels = hasLabel ? labels.filter(l => l.id !== label.id) : [...labels, label];
      return {
        ...board,
        tasks: { ...board.tasks, [taskId]: { ...task, labels: updatedLabels } }
      };
    });
  };

  // --- Checklist Functions Implementation ---
  const addChecklistItem = (taskId: string, text: string) => {
    const newItem = { id: `item-${crypto.randomUUID()}`, text, completed: false };
    updateActiveBoard(board => {
      const task = board.tasks[taskId];
      return {
        ...board,
        tasks: { ...board.tasks, [taskId]: { ...task, checklists: [...(task.checklists || []), newItem] } }
      };
    });
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    updateActiveBoard(board => {
      const task = board.tasks[taskId];
      const updatedChecklist = (task.checklists || []).map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      return {
        ...board,
        tasks: { ...board.tasks, [taskId]: { ...task, checklists: updatedChecklist } }
      };
    });
  };

  const deleteChecklistItem = (taskId: string, itemId: string) => {
    updateActiveBoard(board => {
      const task = board.tasks[taskId];
      return {
        ...board,
        tasks: { ...board.tasks, [taskId]: { ...task, checklists: (task.checklists || []).filter(i => i.id !== itemId) } }
      };
    });
  };

  const moveColumn = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.index === source.index) return;
    updateActiveBoard(board => {
      const newColumnOrder = Array.from(board.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      return { ...board, columnOrder: newColumnOrder };
    });
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
        boards, activeBoardId, setActiveBoardId, isLoading, 
        searchTerm, setSearchTerm,
        filterPriority, setFilterPriority, filteredBoard,
        addBoard, deleteBoard, addTask, deleteTask, updateTask, moveTask, 
        addColumn, deleteColumn, updateColumnTitle, moveColumn, toggleLabel,
        addChecklistItem, toggleChecklistItem, deleteChecklistItem // Exported
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