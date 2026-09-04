import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'hans_solar_admin_auth';

const loadStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storedAuth = loadStoredAuth();

const initialState = {
  isAuthenticated: Boolean(storedAuth?.token),
  admin: storedAuth?.admin ?? null,
  token: storedAuth?.token ?? null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          admin: action.payload.admin,
          token: action.payload.token,
        }),
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
    updateSession: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          admin: state.admin,
          token: action.payload.token,
        }),
      );
    },
  },
});

export const { login, logout, updateSession } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
