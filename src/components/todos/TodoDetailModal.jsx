// src/components/todos/TodoDetailModal.jsx
import React from 'react';
import { Modal } from '../common/Modal';
import { Button, IconButton } from '../common/Button';
import { formatDate, getPriorityConfig, getCategoryColorConfig } from '../../utils/helpers';

export const TodoDetailModal = ({ isOpen, todo, categories, onClose, onEdit, onDelete, onToggle }) => {
  if (!todo) return null;

  const priorityConfig = getPriorityConfig(todo.priority);
  const category = categories.find(c => c.id === todo.category_id);
  const categoryColor = category ? getCategoryColorConfig(category.color) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Todo Details"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onEdit(todo)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(todo)}>
            Delete
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className={`text-2xl font-bold text-gray-900 mb-2 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h2>
            <button
              onClick={() => onToggle(todo)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                todo.completed
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {todo.completed ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Complete
                </>
              )}
            </button>
          </div>
        </div>

        {todo.description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{todo.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Priority</h3>
            <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${priorityConfig.color}`}>
              {todo.priority}
            </span>
          </div>

          {category && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${categoryColor.bg}`} />
                <span className="text-gray-900 font-medium">{category.name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(todo.due_date)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Created</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(todo.created_at)}
            </div>
          </div>
        </div>

        {todo.updated_at && todo.updated_at !== todo.created_at && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Last Updated</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {formatDate(todo.updated_at)}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TodoDetailModal;