import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import { authApi } from './authApiSlice';
import { apiSlice } from './apiSlice';
import { userApiSlice } from './userApiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Сохраняем только часть состояния
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      userApiSlice.middleware,
      authApi.middleware
    ),
});

export const persistor = persistStore(store);
export default store;