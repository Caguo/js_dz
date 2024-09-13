// src/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import { authApi } from './authApiSlice';
import { apiSlice } from './apiSlice';
import { userApiSlice } from './userApiSlice';
import { userAboutApi } from './userAbout'; 
import { commentsApi } from '../hooks/commentsApi'; // Импортируйте commentsApi

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Сохраняем только часть состояния
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [userAboutApi.reducerPath]: userAboutApi.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer, // Добавьте reducer для commentsApi
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      userApiSlice.middleware,
      userAboutApi.middleware,
      authApi.middleware,
      commentsApi.middleware // Добавьте middleware для commentsApi
    ),
});

export const persistor = persistStore(store);
export default store;
