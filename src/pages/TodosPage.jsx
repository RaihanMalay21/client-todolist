// src/pages/TodosPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleCompleteTodo,
  fetchTodoById,
} from '../redux/todos/todoThunk';
import {
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  resetToggleCompleteStatus,
  resetCurrentTodo,
} from '../redux/todos/todoSlice';
import { fetchCategories } from '../redux/categories/categoryThunk';
import TodoCard from '../components/todos/TodoCard';
import TodoForm from '../components/todos/TodoForm';
import TodoDetailModal from '../components/todos/TodoDetailModal';
import { Modal, ConfirmModal, EmptyTodos } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { LoadingCard, SkeletonCard } from '../components/common/Loading';
import { ErrorCard, EmptyState } from '../components/common/ErrorMessage';
import Toast from '../components/common/Toast';

export const TodosPage = () => {
  const dispatch = useDispatch();
  const {
    todos,
    currentTodo,
    loadingFetch,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingToggleComplete,
    error,
    hasMore,
    page,
    createStatus,
    updateStatus,
    deleteStatus,
    toggleCompleteStatus,
  } = useSelector((state) => state.todos);

  const { categories } = useSelector((state) => state.category);

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);
  const [viewingTodo, setViewingTodo] = useState(null);
  const [toast, setToast] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (todos?.length === 0) {
      dispatch(fetchTodos({ page: 1 }));
    }
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
        setEditingTodo(null);
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
        setDeletingTodo(null);
      } else {
        setToast({ type: 'error', message: deleteStatus.message });
      }
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus, dispatch]);

  useEffect(() => {
    if (toggleCompleteStatus) {
      if (toggleCompleteStatus.success) {
        setToast({ type: 'success', message: toggleCompleteStatus.message });
      } else {
        setToast({ type: 'error', message: toggleCompleteStatus.message });
      }
      dispatch(resetToggleCompleteStatus());
    }
  }, [toggleCompleteStatus, dispatch]);

  const handleCreate = (data) => {
    setServerErrors(null); // Clear previous errors
    dispatch(createTodo(data));
  };

  const handleUpdate = (data) => {
    setServerErrors(null); // Clear previous errors
    dispatch(updateTodo({ id: editingTodo.id, data }));
  };

  const handleDelete = (todo) => {
    dispatch(deleteTodo(todo.id));
  };

  const handleToggle = (todo) => {
    dispatch(toggleCompleteTodo({ id: todo.id, completed: todo.completed }));
  };

  const handleView = (todo) => {
    dispatch(fetchTodoById(todo.id));
    setViewingTodo(todo);
  };

  const handleLoadMore = () => {
    dispatch(fetchTodos({ page: page + 1 }));
  };

  const handleRetry = () => {
    dispatch(fetchTodos({ page: 1 }));
  };

  const openCreateModal = () => {
    setEditingTodo(null);
    setServerErrors(null);
    setShowForm(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setServerErrors(null);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingTodo(null);
    setServerErrors(null);
  };

  const closeViewModal = () => {
    setViewingTodo(null);
    dispatch(resetCurrentTodo());
  };

  const filteredTodos = todos?.filter((todo) => {
    // Filter by search query (title)
    if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter by priority
    if (filterPriority !== 'all' && todo.priority !== filterPriority) return false;
    // Filter by category
    if (filterCategory !== 'all' && todo.category_id !== filterCategory) return false;
    // Filter by status
    if (filterStatus === 'completed' && !todo.completed) return false;
    if (filterStatus === 'active' && todo.completed) return false;
    return true;
  });

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todos</h1>
            <p className="text-gray-600 mt-1">Manage your daily tasks</p>
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
            New Todo
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search todos by title..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && !loadingFetch ? (
          <ErrorCard message={error} onRetry={handleRetry} />
        ) : loadingFetch && todos?.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)]?.map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredTodos?.length === 0 ? (
          <EmptyState
            message={
              todos?.length === 0
                ? 'No todos yet. Create your first todo to get started.'
                : searchQuery
                ? `No todos found matching "${searchQuery}".`
                : 'No todos match your filters.'
            }
            action={
              todos?.length === 0 ? (
                <Button variant="primary" onClick={openCreateModal}>
                  Create Todo
                </Button>
              ) : searchQuery ? (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              ) : null
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {filteredTodos?.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  categories={categories}
                  onToggle={handleToggle}
                  onEdit={openEditModal}
                  onDelete={setDeletingTodo}
                  onView={handleView}
                />
              ))}
            </div>

            {hasMore && filterPriority === 'all' && filterCategory === 'all' && !searchQuery && (
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
        title={editingTodo ? 'Edit Todo' : 'Create New Todo'}
        size="md"
      >
        <TodoForm
          todo={editingTodo}
          categories={categories}
          onSubmit={editingTodo ? handleUpdate : handleCreate}
          onCancel={closeModal}
          loading={loadingCreate || loadingUpdate}
          serverErrors={serverErrors}
        />
      </Modal>

      <TodoDetailModal
        isOpen={!!viewingTodo}
        todo={currentTodo || viewingTodo}
        categories={categories}
        onClose={closeViewModal}
        onEdit={(todo) => {
          closeViewModal();
          openEditModal(todo);
        }}
        onDelete={(todo) => {
          closeViewModal();
          setDeletingTodo(todo);
        }}
        onToggle={handleToggle}
      />

      <ConfirmModal
        isOpen={!!deletingTodo}
        onClose={() => setDeletingTodo(null)}
        onConfirm={() => handleDelete(deletingTodo)}
        title="Delete Todo"
        message={`Are you sure you want to delete "${deletingTodo?.title}"? This action cannot be undone.`}
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

export default TodosPage;