import { createSlice } from '@reduxjs/toolkit';
import { isAdminSessionActive } from '@/admin/utils/adminSession';

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
const storedToken = storedAuth?.token ?? null;
const hasActiveSession = isAdminSessionActive(storedToken);

if (storedAuth?.token && !hasActiveSession) {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const initialState = {
  isAuthenticated: Boolean(storedToken && hasActiveSession),
  admin: hasActiveSession ? storedAuth?.admin ?? null : null,
  token: hasActiveSession ? storedToken : null,
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
