import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApiSlice';

// В authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
    },
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user; // Передаем все данные пользователя
      state.status = 'succeeded';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const token = action.payload.login.token;
        const user = action.payload.login.user;
        if (token) {
          state.status = 'succeeded';
          state.token = token;
          state.user = user;
        } else {
          state.status = 'failed';
          state.error = 'Неправильный логин или пароль';
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;