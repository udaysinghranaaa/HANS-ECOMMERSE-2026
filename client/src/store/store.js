import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '@/admin/store/adminAuthSlice';
import { api } from '@/services/api';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
