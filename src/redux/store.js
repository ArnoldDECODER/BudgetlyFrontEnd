import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // adjust this path if it's located elsewhere

const store = configureStore({
  reducer: {
    auth: authReducer, // you can add more slices like 'transactions', 'goals', etc.
  },
  // Optional: enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;