// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../redux/categories/categoryThunk';
import {
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} from '../redux/categories/categorySlice';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryForm from '../components/categories/CategoryForm';
import { Modal, ConfirmModal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { LoadingCard, SkeletonCard } from '../components/common/Loading';
import { ErrorCard, EmptyState } from '../components/common/ErrorMessage';
import Toast from '../components/common/Toast';

export const CategoriesPage = () => {
  const dispatch = useDispatch();
  const {
    categories,
    loadingFetch,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,
    hasMore,
    page,
    createStatus,
    updateStatus,
    deleteStatus,
  } = useSelector((state) => state.category);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories({ page: 1 }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (createStatus) {
      if (createStatus.success) {
        setToast({ type: 'success', message: createStatus.message });
        setShowForm(false);
        setServerErrors(null);
      } else if (!createStatus.success) {
        // Handle validation errors (VALIDATION)
        if (createStatus.errorType === "VALIDATION" && Array.isArray(createStatus.errFields)) {
          setServerErrors({
            errFields: createStatus.errFields
          });
        } 
        // Handle server errors (SERVER_ERROR)
        else if (createStatus.errorType === "SERVER_ERROR") {
          setToast({ type: 'error', message: createStatus.message });
        }
      }
      dispatch(resetCreateStatus());
    }
  }, [createStatus, dispatch]);

  useEffect(() => {
    if (updateStatus) {
      if (updateStatus.success) {
        setToast({ type: 'success', message: updateStatus.message });
        setShowForm(false);
        setEditingCategory(null);
        setServerErrors(null);
      } else {
        // Handle validation errors
        if (updateStatus.errorType === "VALIDATION" && Array.isArray(updateStatus.errFields)) {
          setServerErrors({
            errFields: updateStatus.errFields
          });
        } else {
          setToast({ type: 'error', message: updateStatus.message });
        }
      }
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, dispatch]);

  useEffect(() => {
    if (deleteStatus) {
      if (deleteStatus.success) {
        setToast({ type: 'success', message: deleteStatus.message });
        setDeletingCategory(null);
      } else {
        setToast({ type: 'error', message: deleteStatus.message });
      }
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus, dispatch]);

  const handleCreate = (data) => {
    setServerErrors(null); // Clear previous errors
    dispatch(createCategory(data));
  };

  const handleUpdate = (data) => {
    setServerErrors(null); // Clear previous errors
    dispatch(updateCategory({ id: editingCategory.id, data }));
  };

  const handleDelete = (category) => {
    dispatch(deleteCategory(category.id));
  };

  const handleLoadMore = () => {
    dispatch(fetchCategories({ page: page + 1 }));
  };

  const handleRetry = () => {
    dispatch(fetchCategories({ page: 1 }));
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setServerErrors(null);
    setShowForm(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setServerErrors(null);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingCategory(null);
    setServerErrors(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage your todo categories</p>
          </div>
          <Button
            variant="primary"
            onClick={openCreateModal}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Category
          </Button>
        </div>

        {error && !loadingFetch ? (
          <ErrorCard message={error} onRetry={handleRetry} />
        ) : loadingFetch && categories?.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)]?.map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : categories?.length === 0 ? (
          <EmptyState
            message="No categories yet. Create your first category to get started."
            action={
              <Button variant="primary" onClick={openCreateModal}>
                Create Category
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={openEditModal}
                  onDelete={setDeletingCategory}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  loading={loadingFetch}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        size="sm"
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={closeModal}
          loading={loadingCreate || loadingUpdate}
          serverErrors={serverErrors}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => handleDelete(deletingCategory)}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;