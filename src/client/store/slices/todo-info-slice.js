import { createSlice } from '@reduxjs/toolkit';
import { getTodo } from 'client/api';
import { STATUS } from 'configs/constants';

const todoInfoSlice = createSlice({
  name: 'app-slice',
  initialState: {},
  reducers: {
    checkUserExist: (state, { payload }) => {
      state[payload] = { loading: STATUS.IDLE };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodo.pending, (state, { meta: { arg } }) => {
        state[arg].loading = STATUS.LOADING;
      })
      .addCase(getTodo.rejected, (state, { meta: { arg }, payload }) => {
        state[arg].loading = STATUS.FAILED;
        state[arg].error = payload;
      })
      .addCase(getTodo.fulfilled, (state, { meta: { arg }, payload }) => {
        state[arg].loading = STATUS.SUCCEED;
        state[arg].data = payload;
      });
  },
});

const shouldGetTodoInfo = (state, id) => !Object.values(STATUS).includes(state.todoInfo[id]?.loading);

export const getTodoInfoIfNeed = (id) => (dispatch, getState) => {
  if (shouldGetTodoInfo(getState())) {
    dispatch(todoInfoSlice.actions.checkUserExist(id));

    return dispatch(getTodo(id));
  }

  return null;
};

export default todoInfoSlice.reducer;
