# 📝 Todo App - React Frontend

A modern and intuitive Todo Management Web Application built with React, Tailwind CSS, Redux Toolkit, and Axios. This application focuses on efficient category and todo item management with an emphasis on fast and responsive user experience.

![Todo App](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat&logo=redux&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📸 Screenshots

### Todos Page
Manage your daily tasks with an intuitive interface featuring search, filters, and quick actions.

### Categories Page
Organize your todos with color-coded categories, complete with creation dates and management controls.

### Modal Interfaces
- **Create/Edit Todo**: Full-featured form with title, description, category, priority, and due date
- **Edit Category**: Simple interface to update category names and colors
- **Delete Confirmations**: Clear confirmation dialogs to prevent accidental deletions

## ✨ Key Features

### 🗂️ Advanced Category Management
- **Create** new categories with custom colors
- **Edit** category names and color indicators
- **Delete** categories with confirmation dialogs
- **View** creation timestamps for each category
- **Color-coded** labels for visual organization
- **Pagination** support with "Load More" functionality

### ✅ Comprehensive Todo Management
- **Create** todos with detailed information (title, description, category, priority, due date)
- **Edit** existing todos with all fields editable
- **Mark as completed** with checkbox functionality
- **Filter** todos by status, priority, and category
- **Search** todos by title
- **View** todo details on dedicated pages
- **Category grouping** for better organization

### ⚡ Optimized Performance
- **No redundant API calls** - intelligent state management prevents unnecessary refetching
- **Instant UI updates** - changes are immediately reflected using Redux reducers
- **Persistent state** - Redux Persist keeps data available across page refreshes
- **Efficient pagination** - load data incrementally without duplication
- **Optimistic updates** - UI responds immediately while API calls process in background

### 🎨 Modern User Interface
- Clean and minimalist design
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Color-coded priority levels (High, Medium, Low)
- Intuitive modal dialogs
- Loading states and error handling
- Toast notifications for user feedback

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18.x** | Core UI library for building user interfaces |
| **Tailwind CSS 3.x** | Utility-first CSS framework for rapid styling |
| **Lucide React** | Modern icon set (edit, delete, add, calendar, etc.) |
| **Redux Toolkit** | Primary state management solution |
| **Redux Persist** | Persist Redux state to avoid unnecessary refetching |
| **Axios** | HTTP client for API requests |
| **React Router DOM** | Client-side routing and navigation |

## 📦 Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd todo-app-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8080
```

4. **Start the development server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode with hot reloading enabled.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `build` folder.

### Testing
```bash
npm test
```
Launches the test runner in interactive watch mode.

### Code Linting
```bash
npm run lint
```
Checks code quality and enforces coding standards.

## 📁 Project Structure

```
src/
├── components/
│   ├── categories/          # Category-related components
│   │   ├── CategoryCard.jsx
│   │   ├── CategoryForm.jsx
│   │   └── CategoryList.jsx
│   ├── common/              # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   └── Loading.jsx
│   └── todos/               # Todo-related components
│       ├── TodoCard.jsx
│       ├── TodoForm.jsx
│       ├── TodoList.jsx
│       └── TodoFilters.jsx
│
├── pages/                   # Route pages
│   ├── TodosPage.jsx
│   ├── CategoriesPage.jsx
│   └── TodoDetailPage.jsx
│
├── redux/                   # State management
│   ├── store.js
│   ├── slices/
│   │   ├── todosSlice.js
│   │   └── categoriesSlice.js
│   └── middleware/
│
├── services/                # API integration
│   ├── api.js
│   ├── todoService.js
│   └── categoryService.js
│
├── utils/                   # Helpers & constants
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
│
├── App.js                   # Main application component
└── index.js                 # Application entry point
```

## 🔄 State Management Architecture

### Redux Store Configuration

The application uses Redux Toolkit with Redux Persist to maintain state across page refreshes:

```javascript
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
```

### Redux State Structure

```javascript
// Todos State
{
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
}

// Categories State
{
  categories: [],
  loadingFetch: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  error: null,
  page: 1,
  hasMore: false,
  createStatus: null,
  updateStatus: null,
  deleteStatus: null,
}
```

### Async Thunks with Optimistic Updates

The application implements optimistic UI updates by dispatching custom reducers immediately after API calls:

```javascript
// src/redux/categories/categoryThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    replaceCategoryById,
    removeCategoryById,
    addCategory,
} from "./categorySlice";
import axios from "axios";

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
      // Optimistic update: immediately add to state
      thunkAPI.dispatch(addCategory(response.data?.data))
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || "Failed to create category",
        errorType: error.response?.data?.errorType,
        errFields: error.response?.data?.errFields,
      });
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
      // Optimistic update: immediately replace in state
      thunkAPI.dispatch(replaceCategoryById(data))
      return { message: response.data.message, data: { ID: id, ...data } };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || "Failed to update category",
        errorType: error.response?.data?.errorType,
        errFields: error.response?.data?.errFields,
      });
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
      // Optimistic update: immediately remove from state
      thunkAPI.dispatch(removeCategoryById(id))
      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);
```

### Custom Reducers for Instant UI Updates

```javascript
// src/redux/categories/categorySlice.js (excerpt)
reducers: {
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
}
```

### Optimized Update Flow

1. **User Action** → Triggers Redux async thunk (e.g., `createCategory`)
2. **API Call** → Sends request to backend
3. **Immediate Dispatch** → Custom reducer updates state instantly (`addCategory`)
4. **Pending State** → Loading indicator shows (optional)
5. **Success/Failure** → Status stored for user feedback (toast notification)
6. **No Refetch Needed** → UI already updated, no additional API calls required

**Benefits:**
- ⚡ Instant UI feedback
- 🚀 Reduced API calls
- 💾 Better offline-like experience
- 🎯 Consistent state across components

## 🔌 API Integration

### Axios Configuration
```javascript
// Base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(config => {
  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    // Centralized error handling
    return Promise.reject(error);
  }
);
```

## 🎯 User Flow

1. **Landing Page** → User arrives at Todos page
2. **View Todos** → Browse existing todos with filters
3. **Create Todo** → Click "New Todo" → Fill form → Submit
4. **Edit Todo** → Click edit icon → Modify fields → Update
5. **Complete Todo** → Check checkbox to mark as done
6. **Switch to Categories** → Navigate to Categories page
7. **Manage Categories** → Create, edit, or delete categories
8. **Load More** → Click "Load More" to fetch additional items
9. **Instant Updates** → All changes reflect immediately without reload

## 🎨 Design Principles

- **Simplicity First**: Clean interface that anyone can understand
- **Speed**: Instant feedback on all user actions
- **Consistency**: Uniform design patterns throughout
- **Accessibility**: Keyboard navigation and screen reader support
- **Responsiveness**: Works seamlessly on all device sizes

## 🧪 Testing Strategy

- Unit tests for Redux reducers
- Component tests using React Testing Library
- Integration tests for user flows
- E2E tests for critical paths

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Scalable static hosting
- **Docker**: Containerized deployment

## 📊 Performance Optimization

- Code splitting with React.lazy
- Image optimization and lazy loading
- Memoization with useMemo and useCallback
- Redux state normalization
- Debounced search inputs
- Virtual scrolling for large lists (if needed)

## 🐛 Known Issues & Limitations

- Maximum 1000 todos per category (API limitation)
- Offline mode not yet implemented
- File attachments not supported in current version

## 🗺️ Roadmap

- [ ] Offline support with Service Workers
- [ ] File attachments for todos
- [ ] Recurring todos
- [ ] Collaborative features (shared todos)
- [ ] Mobile native app (React Native)
- [ ] Dark mode theme
- [ ] Export/Import functionality
- [ ] Calendar view

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Country Konoha**

- Open for collaboration & code reviews
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- GitHub: [@countrykonoha](https://github.com/countrykonoha)

## 🙏 Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility-first approach
- Redux team for Redux Toolkit
- Lucide team for beautiful icons
- Open source community

## 📧 Contact & Support

For questions, suggestions, or issues:
- Open an issue on GitHub
- Email: [your-email@example.com]
- Discord: [Your Discord Server]

---

**Made with ❤️ and ☕ by Country Konoha**

*If you find this project helpful, please consider giving it a ⭐!*