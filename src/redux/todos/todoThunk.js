// src/redux/todos/todoThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    removeTodosById,
    replaceTodosById,
    addTodos,
    toggleTodoCompletedById,
} from "./todoSlice";
import axios from "axios";

// GET all todos (pagination)
export const fetchTodos = createAsyncThunk(
  "todos/fetchAll",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/todos?page=${page}`,
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
        error.response?.data?.message || "Failed to fetch todos"
      );
    }
  }
);

// GET todo by ID
export const fetchTodoById = createAsyncThunk(
  "todos/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/todos/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch todo"
      );
    }
  }
);

// CREATE todo
export const createTodo = createAsyncThunk(
  "todos/create",
  async (todoData, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/todos`,
        todoData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(addTodos(response.data?.data))

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
         {
            message: error.response?.data?.message || "Failed to create todo",
            errorType: error.response?.data?.errorType,
            errFields: error.response?.data?.errFields,
        }   
      );
    }
  }
);

// UPDATE todo
export const updateTodo = createAsyncThunk(
  "todos/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/todos/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(replaceTodosById(data))

      return { message: response.data.message, data: { id, ...data } };
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

// DELETE todo
export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/todos/${id}`,
        {
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(removeTodosById(id))

      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete todo"
      );
    }
  }
);

// COMPLETE/UNCOMPLETE todo
export const toggleCompleteTodo = createAsyncThunk(
  "todos/toggleComplete",
  async ({id, completed}, thunkAPI) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/todos/complete/${id}?is_completed=${completed}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      thunkAPI.dispatch(toggleTodoCompletedById(id))

      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle todo completion"
      );
    }
  }
);