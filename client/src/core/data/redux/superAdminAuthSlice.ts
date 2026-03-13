import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SuperAdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface SuperAdminAuthState {
  user: SuperAdminUser | null;
  isAuthenticated: boolean;
  authChecked: boolean;
}

const initialState: SuperAdminAuthState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
};

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState,
  reducers: {
    setSuperAdminAuth: (state, action: PayloadAction<{ user: SuperAdminUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authChecked = true;
    },
    setSuperAdminAuthFromSession: (state, action: PayloadAction<{ user: SuperAdminUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authChecked = true;
    },
    setSuperAdminAuthChecked: (state) => {
      state.authChecked = true;
    },
    clearSuperAdminAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },
});

export const {
  setSuperAdminAuth,
  setSuperAdminAuthFromSession,
  setSuperAdminAuthChecked,
  clearSuperAdminAuth,
} = superAdminAuthSlice.actions;

export const selectSuperAdminUser = (state: { superAdminAuth: SuperAdminAuthState }) =>
  state.superAdminAuth.user;
export const selectSuperAdminIsAuthenticated = (state: { superAdminAuth: SuperAdminAuthState }) =>
  state.superAdminAuth.isAuthenticated;
export const selectSuperAdminAuthChecked = (state: { superAdminAuth: SuperAdminAuthState }) =>
  state.superAdminAuth.authChecked;

export default superAdminAuthSlice.reducer;

