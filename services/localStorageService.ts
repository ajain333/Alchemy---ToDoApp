
import { Task } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

/**
 * Loads tasks from local storage.
 * @returns An array of Task objects.
 */
export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? (JSON.parse(data) as Task[]) : [];
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
};

/**
 * Saves tasks to local storage.
 * @param tasks The array of Task objects to save.
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
};

// NOTE: For actual Google Sheet integration, this service would instead
// make API calls to a backend that interacts with the Google Sheets API.
// This local storage implementation serves as a client-side simulation.
