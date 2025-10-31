
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskCategory, SortBy, SortOrder } from './types';
import { loadTasks, saveTasks } from './services/localStorageService';
import { v4 as uuidv4 } from 'uuid';
import Tabs from './components/Tabs';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TaskCategory>(TaskCategory.PERSONAL);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [sortBy, setSortBy] = useState<SortBy>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchText, setSearchText] = useState(''); // New state for search text


  // Load tasks on initial mount
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // Save tasks whenever the tasks state changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null); // Clear editing state after update
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setEditingTask(null); // Clear editing if deleted task was being edited
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setActiveTab(task.category); // Switch to the category of the task being edited
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleFilterChange = useCallback((status: 'All' | 'Pending' | 'Completed') => {
    setFilterStatus(status);
  }, []);

  const handleSortChange = useCallback((newSortBy: SortBy, newSortOrder: SortOrder) => {
      if (sortBy === newSortBy && sortOrder === newSortOrder) {
          // If clicking the same sort option, toggle off sorting
          setSortBy(null);
          setSortOrder(null);
      } else {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
      }
  }, [sortBy, sortOrder]);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);


  const sortedAndFilteredTasks = useMemo(() => {
    let currentTasks = tasks
      .filter((task) => task.category === activeTab)
      .filter((task) => {
        if (filterStatus === 'Pending') {
          return !task.completed;
        }
        if (filterStatus === 'Completed') {
          return task.completed;
        }
        return true; // 'All' status
      })
      .filter((task) => { // New filter for search text
        if (searchText.trim() === '') {
          return true; // No search text, show all
        }
        return task.description.toLowerCase().includes(searchText.toLowerCase());
      });

    currentTasks.sort((a, b) => {
      // Primary sort: Completed tasks go to the bottom
      if (a.completed && !b.completed) return 1; // a is completed, b is not, a comes after b
      if (!a.completed && b.completed) return -1; // a is not completed, b is completed, a comes before b

      // If both are completed or both are pending, then apply secondary sort (due date)
      if (sortBy === 'dueDate' && sortOrder) {
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();

          if (sortOrder === 'asc') {
              return dateA - dateB;
          } else { // desc
              return dateB - dateA;
          }
      }
      return 0; // No secondary sort or dates are equal
    });

    return currentTasks;
  }, [tasks, activeTab, filterStatus, sortBy, sortOrder, searchText]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Efficient Task Manager</h1>
            </div>
            <div className="flex">
              <Tabs
                tabs={[TaskCategory.PERSONAL, TaskCategory.WORK]}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab as TaskCategory);
                  setEditingTask(null); // Clear editing state when changing tabs
                  setFilterStatus('All'); // Reset filter when changing tabs
                  setSortBy(null); // Reset sort when changing tabs
                  setSortOrder(null); // Reset sort when changing tabs
                  setSearchText(''); // Reset search text when changing tabs
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <TaskForm
          onSubmit={addTask}
          onUpdate={updateTask}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{activeTab} Tasks</h2>
          <TaskList
            tasks={sortedAndFilteredTasks}
            onToggleComplete={toggleTaskCompletion}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            searchText={searchText} // Pass search text to TaskList
            onSearchTextChange={handleSearchTextChange} // Pass search handler to TaskList
          />
        </div>
      </main>
    </div>
  );
};

export default App;
