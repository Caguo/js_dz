import { createSelector } from '@reduxjs/toolkit';

// Предположим, что у вас есть следующее состояние
const selectUserState = (state) => state.user;

export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState ? userState.UserFindOne : null
);
