import { type } from 'os';

export interface Task {
  id: string;
  description: string;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: string; // ISO string
}

export enum TaskCategory {
  PERSONAL = 'Personal',
  WORK = 'Work',
}

export type SortOrder = 'asc' | 'desc' | null;
export type SortBy = 'dueDate' | null;
