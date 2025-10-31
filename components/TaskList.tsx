import React from 'react';
import { Task, SortBy, SortOrder } from '../types';
import Button from './Button';

// Heroicons imports for action buttons
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  filterStatus: 'All' | 'Pending' | 'Completed';
  onFilterChange: (status: 'All' | 'Pending' | 'Completed') => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  searchText: string; // New prop for search text
  onSearchTextChange: (text: string) => void; // New prop for search text handler
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onEdit, onDelete, filterStatus, onFilterChange, sortBy, sortOrder, onSortChange, searchText, onSearchTextChange }) => {

  const getTaskRowClassName = (task: Task): string => {
    if (task.completed) {
      return 'bg-green-100 text-green-800'; // Completed: Green
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0); // Normalize to start of day

    if (dueDate < today) {
      return 'bg-red-100 text-red-800'; // Past due: Red
    } else if (dueDate <= twoDaysFromNow) {
      return 'bg-yellow-100 text-yellow-800'; // Due in next 2 days: Yellow
    } else {
      return 'bg-white text-gray-900'; // Beyond 2 days: White (default)
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Filter and Sort controls - always visible */}
      <div className="p-4 bg-white shadow-md rounded-lg border-b border-gray-200">
        {/* Search Input */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by description..."
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center space-x-2 space-y-2 md:space-y-0 mt-4">
          <span className="text-sm font-medium text-gray-700 mr-2">Filter by Status:</span>
          <Button
            onClick={() => onFilterChange('All')}
            variant={filterStatus === 'All' ? 'primary' : 'secondary'}
            className="px-3 py-1.5 text-sm"
          >
            All
          </Button>
          <Button
            onClick={() => onFilterChange('Pending')}
            variant={filterStatus === 'Pending' ? 'primary' : 'secondary'}
            className="px-3 py-1.5 text-sm"
          >
            Pending
          </Button>
          <Button
            onClick={() => onFilterChange('Completed')}
            variant={filterStatus === 'Completed' ? 'primary' : 'secondary'}
            className="px-3 py-1.5 text-sm"
          >
            Completed
          </Button>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center space-x-2 space-y-2 md:space-y-0 mt-4">
          <span className="text-sm font-medium text-gray-700 mr-2">Sort by Due Date:</span>
          <Button
            onClick={() => onSortChange('dueDate', 'asc')}
            variant={sortBy === 'dueDate' && sortOrder === 'asc' ? 'primary' : 'secondary'}
            className="px-3 py-1.5 text-sm"
          >
            Asc
          </Button>
          <Button
            onClick={() => onSortChange('dueDate', 'desc')}
            variant={sortBy === 'dueDate' && sortOrder === 'desc' ? 'primary' : 'secondary'}
            className="px-3 py-1.5 text-sm"
          >
            Desc
          </Button>
        </div>
      </div>

      {/* Task display area - conditionally renders table or "no tasks" message */}
      <div className="bg-white shadow-md rounded-lg">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No tasks found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className={getTaskRowClassName(task)}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {task.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {task.completed ? 'Completed' : 'Pending'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium md:whitespace-nowrap md:text-right">
                      <div className="flex flex-col space-y-2 md:flex-row md:justify-end md:space-x-2 md:space-y-0">
                        <Button
                          onClick={() => onToggleComplete(task.id)}
                          variant="secondary"
                          className="w-full md:w-auto p-1.5"
                          title={task.completed ? 'Mark as Pending' : 'Mark as Complete'}
                        >
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </Button>
                        <Button
                          onClick={() => onEdit(task)}
                          variant="secondary"
                          className="w-full md:w-auto p-1.5"
                          title="Edit Task"
                        >
                          <PencilIcon className="h-5 w-5 text-blue-600" />
                        </Button>
                        <Button
                          onClick={() => onDelete(task.id)}
                          variant="danger"
                          className="w-full md:w-auto p-1.5"
                          title="Delete Task"
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;