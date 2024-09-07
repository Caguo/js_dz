// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { authApi } from './authApiSlice';
import { apiSlice } from './apiSlice';
import { userApiSlice } from './userApiSlice'; // Импортируем userApiSlice

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, userApiSlice.middleware, authApi.middleware),
});

export default store;
