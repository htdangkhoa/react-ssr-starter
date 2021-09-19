import { createSlice } from '@reduxjs/toolkit';
import { getUser } from 'client/api';
import { STATUS } from 'configs/constants';

const userInfoSlice = createSlice({
  name: 'user-info-slice',
  initialState: {},
  reducers: {
    checkUserExist: (state, { payload }) => {
      state[payload] = { loading: STATUS.IDLE };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state, { meta: { arg } }) => {
        state[arg].loading = STATUS.LOADING;
      })
      .addCase(getUser.rejected, (state, { meta: { arg }, error }) => {
        state[arg].loading = STATUS.FAILED;
        state.error = error;
      })
      .addCase(getUser.fulfilled, (state, { meta: { arg }, payload }) => {
        state[arg].loading = STATUS.SUCCEED;
        state[arg].data = payload;
      });
  },
});

const shouldGetUserInfo = (state, id) => !Object.values(STATUS).includes(state.userInfo[id]?.loading);

export const getUserInfoIfNeed = (id) => (dispatch, getState) => {
  if (shouldGetUserInfo(getState())) {
    dispatch(userInfoSlice.actions.checkUserExist(id));

    return dispatch(getUser(id));
  }

  return null;
};

export default userInfoSlice.reducer;
