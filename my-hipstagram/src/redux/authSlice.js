import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userLogin');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const token = action.payload?.login; // Обратите внимание на это поле
        if (token) {
          state.status = 'succeeded';
          state.token = token;
          localStorage.setItem('token', token);
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


export const { logout } = authSlice.actions;
export default authSlice.reducer;
