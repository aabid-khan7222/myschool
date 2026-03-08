import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: number;
  username: string;
  displayName: string;
  role: string;
  user_role_id?: number;
  staff_id?: number;
  accountDisabled?: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token?: string; user: AuthUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authChecked = true;
      state.token = action.payload.token ?? null;
    },
    setAuthFromSession: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authChecked = true;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },
});

export const { setAuth, setAuthFromSession, setAuthChecked, clearAuth } = authSlice.actions;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthChecked = (state: { auth: AuthState }) => state.auth.authChecked;
export default authSlice.reducer;
