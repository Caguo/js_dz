// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
      state.user = user || null; 
      state.error = null;
    },
    setUserInfo(state, action) {
      state.user = action.payload; 
    },
  },
});

export const { logout, setCredentials, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
