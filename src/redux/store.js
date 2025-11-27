// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import categoryReducer from './categories/categorySlice';
import todoReducer from './todos/todoSlice';

const categoryPersistConfig = {
  key: 'category',
  storage: sessionStorage,
  whitelist: ['categories', 'page', 'hasMore'], 
};

const todoPersistConfig = {
  key: 'todo',
  storage: sessionStorage,
  whitelist: ['todos', 'page', 'hasMore'],
};

const appReducer = combineReducers({
  category: persistReducer(categoryPersistConfig, categoryReducer),
  todos: persistReducer(todoPersistConfig, todoReducer),
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export const resetApp = async () => {
  persistor.pause();
  await persistor.purge();
  window.sessionStorage.clear();
  store.dispatch({ type: 'RESET_ALL' });
  persistor.persist();
};

export default store;