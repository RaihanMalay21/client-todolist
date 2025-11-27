// src/components/categories/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { CATEGORY_COLORS } from '../../utils/constants';

export const CategoryForm = ({ category, onSubmit, onCancel, loading, serverErrors }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: 'green',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || 'green',
      });
    }
  }, [category]);

  // Handle server-side validation errors
  useEffect(() => {
    if (serverErrors && Array.isArray(serverErrors.errFields)) {
      const newErrors = {};
      serverErrors.errFields.forEach(fieldError => {
        // Backend mengirim object dengan key sebagai field name (bukan property 'field')
        // Contoh: {Name: 'error message'} atau {Color: 'error message'}
        if (fieldError && typeof fieldError === 'object') {
          Object.keys(fieldError).forEach(key => {
            if (key && typeof key === 'string') {
              const fieldName = key.toLowerCase();
              newErrors[fieldName] = fieldError[key];
            }
          });
        }
      });
      setErrors(newErrors);
    }
  }, [serverErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Category name must not exceed 100 characters';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter category name"
        error={errors.name}
        required
        disabled={loading}
      />

      <Select
        label="Color"
        name="color"
        value={formData.color}
        onChange={handleChange}
        options={CATEGORY_COLORS}
        error={errors.color}
        required
        disabled={loading}
      />

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
        >
          {category ? 'Update Category' : 'Create Category'}
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

export default CategoryForm;