import { createSlice } from '@reduxjs/toolkit';
import { getUsers } from 'client/api';
import { STATUS } from 'configs/constants';

const userListSlice = createSlice({
  name: 'user-list-slice',
  initialState: {
    loading: STATUS.IDLE,
    users: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = STATUS.LOADING;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = STATUS.FAILED;
        state.error = action.error;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = STATUS.SUCCEED;
        state.users = [].concat(...action.payload.users);
      });
  },
});

const shouldGetUserList = (state) => state.userList.loading === STATUS.IDLE;

export const getUserListIfNeed = () => (dispatch, getState) => {
  if (shouldGetUserList(getState())) return dispatch(getUsers());

  return null;
};

export default userListSlice.reducer;
