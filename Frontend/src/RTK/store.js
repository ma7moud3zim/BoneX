import { configureStore } from '@reduxjs/toolkit';
import userActiveSlice from './slices/usersActiveslice'; // Import the slice
import userInfo from './slices/UserInfoSlice'
export const store = configureStore({
  reducer: {
    isActive:userActiveSlice, // Register your slice here
    user:userInfo
  },
});
