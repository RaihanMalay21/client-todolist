// src/redux/categories/categoryThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    replaceCategoryById,
    removeCategoryById,
    addCategory,
} from "./categorySlice";
import axios from "axios";

// GET categories (pagination)
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async ({ page = 1 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/categories?page=${page}`,
        {
          withCredentials: true,
        }
      );
      return {
        data: response.data.data,
        hasMore: response.data.hasMore,
        page,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// CREATE category
export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/categories`,
        categoryData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(addCategory(response.data?.data))

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        {
            message: error.response?.data?.message || "Failed to create category",
            errorType: error.response?.data?.errorType,
            errFields: error.response?.data?.errFields,
        }   
      );
    }
  }
);

// UPDATE category
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/categories/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(replaceCategoryById(data))

      return { message: response.data.message, data: { ID: id, ...data } };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        {
            message: error.response?.data?.message || "Failed to update category",
            errorType: error.response?.data?.errorType,
            errFields: error.response?.data?.errFields,
        }
      );
    }
  }
);

// DELETE category
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/categories/${id}`,
        {
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(removeCategoryById(id))

      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);