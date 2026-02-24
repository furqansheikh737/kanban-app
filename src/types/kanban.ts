export interface Label {
  id: string;
  text: string;
  color: string; // e.g., 'bg-red-500', 'bg-blue-500'
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  labels: Label[];
  checklists: ChecklistItem[];
  dueDate?: string;            // Date ke liye (Optional)
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  id: string;
  title: string;
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

// Yahan "Sales Pipeline" ko badal kar "Default" kar diya hai
export const INITIAL_DATA: BoardData = {
  id: 'board-1',
  title: 'Default', 
  tasks: {
    'task-1': { 
      id: 'task-1', 
      title: 'Welcome to your Kanban!', 
      description: 'This is a sample task.', 
      priority: 'low' 
    },
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'To Do',
      taskIds: ['task-1'],
    },
    'col-2': {
      id: 'col-2',
      title: 'In Progress',
      taskIds: [],
    },
    'col-3': {
      id: 'col-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};