
import React, { useState, useEffect } from 'react';
import { Task, TaskCategory } from '../types';
import Button from './Button';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate: (task: Task) => void;
  editingTask: Task | null;
  onCancelEdit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onUpdate, editingTask, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.PERSONAL);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate);
    } else {
      setDescription('');
      setCategory(TaskCategory.PERSONAL);
      setDueDate('');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !dueDate) {
      alert('Description and Due Date are required.');
      return;
    }

    if (editingTask) {
      onUpdate({ ...editingTask, description, category, dueDate });
    } else {
      onSubmit({ description, category, dueDate, completed: false });
    }
    setDescription('');
    setCategory(TaskCategory.PERSONAL);
    setDueDate('');
    onCancelEdit(); // Clear editing state after submission
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Buy groceries"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Object.values(TaskCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        {editingTask && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Cancel Edit
          </Button>
        )}
        <Button type="submit" variant="primary">
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
