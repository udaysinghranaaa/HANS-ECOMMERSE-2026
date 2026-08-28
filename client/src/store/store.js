import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '@/admin/store/adminAuthSlice';
import { api } from '@/services/api';
import '@/services/adminAuthApi';
import '@/services/homepageBannerApi';
import '@/services/productsApi';
import '@/services/categoriesApi';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
