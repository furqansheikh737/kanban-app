export type Column = { id: string; title: string; taskIds: string[] };
export type Priority = 'low' | 'medium' | 'high';
export type BoardData = {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
};

export type Task = { 
  id: string; 
  title: string; 
  description: string; 
  priority?: Priority; // Naya field
};

export const INITIAL_DATA: BoardData = {
  tasks: {
    "task-1": { id: "task-1", title: "Setup Project", description: "Initialize Next.js and Tailwind" },
    "task-2": { id: "task-2", title: "Design UI", description: "Create Figma wireframes" },
  },
  columns: {
    "col-1": { id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] },
    "col-2": { id: "col-2", title: "In Progress", taskIds: [] },
    "col-3": { id: "col-3", title: "Done", taskIds: [] },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};