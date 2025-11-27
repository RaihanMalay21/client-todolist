// src/components/todos/TodoForm.jsx
import React, { useState, useEffect } from 'react';
import { Input, Textarea, Select, Checkbox } from '../common/Input';
import { Button } from '../common/Button';
import { PRIORITY_OPTIONS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

export const TodoForm = ({ todo, categories, onSubmit, onCancel, loading, serverErrors }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
    due_date: '',
    completed: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        category_id: todo.category_id || '',
        priority: todo.priority || 'medium',
        due_date: formatDate(todo.due_date, 'YYYY-MM-DD') || '',
        completed: todo.completed || false,
      });
    }
  }, [todo]);

  // Handle server-side validation errors
  useEffect(() => {
    if (serverErrors && Array.isArray(serverErrors.errFields)) {
      const newErrors = {};
      serverErrors.errFields.forEach(fieldError => {
        // Backend mengirim object dengan key sebagai field name
        // Contoh: {Title: 'error message'} atau {CategoryId: 'error message'}
        if (fieldError && typeof fieldError === 'object') {
          Object.keys(fieldError).forEach(key => {
            if (key && typeof key === 'string') {
              // Konversi field name dari backend ke format frontend
              let fieldName = key.toLowerCase();
              
              // Mapping khusus untuk field yang berbeda naming
              if (fieldName === 'categoryid') {
                fieldName = 'category_id';
              } else if (fieldName === 'duedate') {
                fieldName = 'due_date';
              }
              
              newErrors[fieldName] = fieldError[key];
            }
          });
        }
      });
      setErrors(newErrors);
    }
  }, [serverErrors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'Title must not exceed 150 characters';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        due_date: new Date(formData.due_date).toISOString(), 
      };
      onSubmit(payload);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter todo title"
        error={errors.title}
        required
        disabled={loading}
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter description"
        error={errors.description}
        disabled={loading}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          options={categoryOptions}
          error={errors.category_id}
          required
          disabled={loading}
          placeholder="Select a category"
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={PRIORITY_OPTIONS}
          error={errors.priority}
          required
          disabled={loading}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        error={errors.due_date}
        required
        disabled={loading}
      />

      {todo && (
        <Checkbox
          label="Mark as completed"
          name="completed"
          checked={formData.completed}
          onChange={handleChange}
          disabled={loading}
        />
      )}

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
        >
          {todo ? 'Update Todo' : 'Create Todo'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;