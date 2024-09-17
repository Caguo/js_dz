import { createSlice } from '@reduxjs/toolkit';

// Создание среза состояния для подписок
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    list: [], // Начальный массив подписок
  },
  reducers: {
    // Редуктор для обновления списка подписок
    updateSubscriptions: (state, action) => {
      state.list = action.payload;
    },
  },
});

// Экспорт действий для обновления состояния
export const { updateSubscriptions } = subscriptionSlice.actions;

// Экспорт редуктора
export default subscriptionSlice.reducer;
   