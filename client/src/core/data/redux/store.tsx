import { configureStore } from '@reduxjs/toolkit';
import themeSettingSlice from './themeSettingSlice';
import sidebarSlice from './sidebarSlice';
import authSlice from './authSlice';
import academicYearSlice from './academicYearSlice';

const store = configureStore({
  reducer: {
    themeSetting: themeSettingSlice,
    sidebarSlice: sidebarSlice,
    auth: authSlice,
    academicYear: academicYearSlice,
  },
});

export default store;
