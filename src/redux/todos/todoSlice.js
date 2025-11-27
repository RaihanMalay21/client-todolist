// src/redux/todos/todoSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTodos,
  fetchTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleCompleteTodo,
} from "./todoThunk";

const initialState = {
  todos: [],
  currentTodo: null,
  loadingFetch: false,
  loadingFetchById: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingToggleComplete: false,
  error: null,
  page: 1,
  hasMore: false,
  createStatus: null,
  updateStatus: null,
  deleteStatus: null,
  toggleCompleteStatus: null,
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    resetTodos: (state) => {
      state.todos = [];
      state.currentTodo = null;
      state.page = 1;
      state.hasMore = false;
      state.error = null;
      state.createStatus = null;
      state.updateStatus = null;
      state.deleteStatus = null;
      state.toggleCompleteStatus = null;
    },
    resetCurrentTodo: (state) => {
      state.currentTodo = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = null;
    },
    resetToggleCompleteStatus: (state) => {
      state.toggleCompleteStatus = null;
    },
    replaceTodosById: (state, action) => {
      const index = state.todos.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    removeTodosById: (state, action) => {
      state.todos = state.todos.filter(cat => cat.id !== action.payload);
    },
    addTodos: (state, action) => {
      state.todos.unshift(action.payload);
    },
    toggleTodoCompletedById: (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload);
        if (index !== -1) {
            state.todos[index].IsCompleted = !state.todos[index].IsCompleted;
        }
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL TODOS
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loadingFetch = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loadingFetch = false;
        if (action.payload.page === 1) {
          state.todos = action.payload.data || [];
        } else {
          state.todos.push(...action.payload.data);
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loadingFetch = false;
        state.error = action.payload;
      });

    // FETCH TODO BY ID
    builder
      .addCase(fetchTodoById.pending, (state) => {
        state.loadingFetchById = true;
        state.error = null;
      })
      .addCase(fetchTodoById.fulfilled, (state, action) => {
        state.loadingFetchById = false;
        state.currentTodo = action.payload;
      })
      .addCase(fetchTodoById.rejected, (state, action) => {
        state.loadingFetchById = false;
        state.error = action.payload;
      });

    // CREATE TODO
    builder
      .addCase(createTodo.pending, (state) => {
        state.loadingCreate = true;
        state.createStatus = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createStatus = { success: true, message: action.payload.message };
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createStatus = { 
          success: false, 
          message: action.payload.message,
          errorType: action.payload.errorType,
          errFields: action.payload.errFields,
        };
      });

    // UPDATE TODO
    builder
      .addCase(updateTodo.pending, (state) => {
        state.loadingUpdate = true;
        state.updateStatus = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.updateStatus = { success: true, message: action.payload.message };
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.data.id
        );
        if (index !== -1) {
          state.todos[index] = { ...state.todos[index], ...action.payload.data };
        }
        // Update currentTodo if it's the same item
        if (state.currentTodo?.id === action.payload.data.id) {
          state.currentTodo = { ...state.currentTodo, ...action.payload.data };
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.updateStatus = { 
          success: false, 
          message: action.payload.message,
          errorType: action.payload.errorType,
          errFields: action.payload.errFields,
        };
      });

    // DELETE TODO
    builder
      .addCase(deleteTodo.pending, (state) => {
        state.loadingDelete = true;
        state.deleteStatus = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.deleteStatus = { success: true, message: action.payload.message };
        state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
        // Clear currentTodo if it was deleted
        if (state.currentTodo?.id === action.payload.id) {
          state.currentTodo = null;
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loadingDelete = false;
        state.deleteStatus = { success: false, message: action.payload };
      });

    // TOGGLE COMPLETE TODO
    builder
      .addCase(toggleCompleteTodo.pending, (state) => {
        state.loadingToggleComplete = true;
        state.toggleCompleteStatus = null;
      })
      .addCase(toggleCompleteTodo.fulfilled, (state, action) => {
        state.loadingToggleComplete = false;
        state.toggleCompleteStatus = {
          success: true,
          message: action.payload.message,
        };
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index].completed = !state.todos[index].completed;
        }
        // Update currentTodo if it's the same item
        if (state.currentTodo?.id === action.payload.id) {
          state.currentTodo.completed = !state.currentTodo.completed;
        }
      })
      .addCase(toggleCompleteTodo.rejected, (state, action) => {
        state.loadingToggleComplete = false;
        state.toggleCompleteStatus = { success: false, message: action.payload };
      });
  },
});

export const {
  resetTodos,
  resetCurrentTodo,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  resetToggleCompleteStatus,
  replaceTodosById,
  removeTodosById,
  addTodos,
  toggleTodoCompletedById,
} = todoSlice.actions;

export default todoSlice.reducer;