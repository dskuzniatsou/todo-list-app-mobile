export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: number;
}

export type FilterMode = 'all' | 'active' | 'completed';
