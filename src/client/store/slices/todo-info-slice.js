import { createSlice } from '@reduxjs/toolkit';
import { getTodo } from 'client/api';
import { STATUS } from 'configs/constants';

const todoInfoSlice = createSlice({
  name: 'app-slice',
  initialState: {
    loading: STATUS.IDLE,
    todo: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodo.pending, (state) => {
        state.loading = STATUS.LOADING;
      })
      .addCase(getTodo.rejected, (state, action) => {
        state.loading = STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getTodo.fulfilled, (state, action) => {
        state.loading = STATUS.SUCCEED;
        state.todo = action.payload;
      });
  },
});

const shouldGetTodoInfo = (state) => state.todoInfo.loading === STATUS.IDLE;

export const getTodoInfoIfNeed = (id) => (dispatch, getState) => {
  if (shouldGetTodoInfo(getState())) return dispatch(getTodo(id));

  return null;
};

export default todoInfoSlice.reducer;
