// src/redux/categories/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "./categoryThunk";

const initialState = {
  categories: [],
  loadingFetch: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  ValidationError: null,
  error: null,
  page: 1,
  hasMore: false,
  createStatus: null,
  updateStatus: null,
  deleteStatus: null,
  ErrorFieldsCreate: null,
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategories: (state) => {
      state.categories = [];
      state.page = 1;
      state.hasMore = false;
      state.error = null;
      state.createStatus = null;
      state.updateStatus = null;
      state.deleteStatus = null;
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
    replaceCategoryById: (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    removeCategoryById: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },
    addCategory: (state, action) => {
      state.categories.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    // FETCH CATEGORIES
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loadingFetch = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingFetch = false;
        if (action.payload.page === 1) {
          state.categories = action.payload.data || [];
        } else {
          state.categories.push(...action.payload.data);
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingFetch = false;
        state.error = action.payload;
      });

    // CREATE CATEGORY
    builder
      .addCase(createCategory.pending, (state) => {
        state.loadingCreate = true;
        state.createStatus = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createStatus = { success: true, message: action.payload.message };
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createStatus = { 
          success: false, 
          message: action.payload.message,
          errorType: action.payload.errorType,
          errFields: action.payload.errFields,
        };
      });

    // UPDATE CATEGORY
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loadingUpdate = true;
        state.updateStatus = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.updateStatus = { success: true, message: action.payload.message };
        const index = state.categories.findIndex(
          (cat) => cat.ID === action.payload.data.ID
        );
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], ...action.payload.data };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.updateStatus = { 
          success: false, 
          message: action.payload.message,
          errorType: action.payload.errorType,
          errFields: action.payload.errFields,
        };
      });

    // DELETE CATEGORY
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loadingDelete = true;
        state.deleteStatus = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.deleteStatus = { success: true, message: action.payload.message };
        state.categories = state.categories.filter(
          (cat) => cat.ID !== action.payload.id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loadingDelete = false;
        state.deleteStatus = { success: false, message: action.payload };
      });
  },
});

export const {
  resetCategories,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  replaceCategoryById,
  removeCategoryById,
  addCategory,
} = categorySlice.actions;

export default categorySlice.reducer;