import { configureStore } from '@reduxjs/toolkit';
import userActiveSlice from './slices/usersActiveslice'; // Import the slice

export const store = configureStore({
  reducer: {
    isActive:userActiveSlice, // Register your slice here
  },
});
