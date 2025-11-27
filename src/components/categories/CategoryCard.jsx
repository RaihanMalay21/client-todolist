// src/components/categories/CategoryCard.jsx
import React from 'react';
import { IconButton } from '../common/Button';
import { getCategoryColorConfig } from '../../utils/helpers';

export const CategoryCard = ({ category, onEdit, onDelete }) => {
  const colorConfig = getCategoryColorConfig(category.color);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-4 h-4 rounded-full ${colorConfig.bg} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Created {new Date(category.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <IconButton
            variant="ghost"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            onClick={() => onEdit(category)}
            title="Edit category"
          />
          <IconButton
            variant="danger"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
            onClick={() => onDelete(category)}
            title="Delete category"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;