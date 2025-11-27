// src/components/todos/TodoCard.jsx
import React from 'react';
import { IconButton } from '../common/Button';
import { formatDate, getPriorityConfig, isDatePast, isDateToday } from '../../utils/helpers';

export const TodoCard = ({ todo, categories, onToggle, onEdit, onDelete, onView }) => {
  const priorityConfig = getPriorityConfig(todo.priority);
  const category = categories.find(c => c.id === todo.category_id);
  const isPast = isDatePast(todo.due_date);
  const isToday = isDateToday(todo.due_date);

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-all ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-1 ${
            todo.completed
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 hover:border-blue-600'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
              onClick={() => onView(todo)}
            >
              {todo.title}
            </h3>
          </div>

          {todo.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfig.color}`}>
              {todo.priority}
            </span>

            {category && (
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                {category.name}
              </span>
            )}

            <span className={`text-xs flex items-center gap-1 ${
              isPast && !todo.completed ? 'text-red-600 font-medium' :
              isToday ? 'text-yellow-600 font-medium' : 'text-gray-500'
            }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(todo.due_date)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <IconButton
            variant="ghost"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            onClick={() => onEdit(todo)}
            title="Edit todo"
          />
          <IconButton
            variant="danger"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
            onClick={() => onDelete(todo)}
            title="Delete todo"
          />
        </div>
      </div>
    </div>
  );
};

export default TodoCard;