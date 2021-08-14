import { createSlice } from '@reduxjs/toolkit';
import { getTodos } from 'client/api';
import { STATUS } from 'configs/constants';

const todoListSlice = createSlice({
  name: 'app-slice',
  initialState: {
    loading: STATUS.IDLE,
    todos: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.loading = STATUS.LOADING;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.loading = STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.loading = STATUS.SUCCEED;
        state.todos = [].concat(...action.payload);
      });
  },
});

const shouldGetTodoList = (state) => state.todoList.loading === STATUS.IDLE;

export const getTodoListIfNeed = () => (dispatch, getState) => {
  if (shouldGetTodoList(getState())) return dispatch(getTodos());

  return null;
};

export default todoListSlice.reducer;
