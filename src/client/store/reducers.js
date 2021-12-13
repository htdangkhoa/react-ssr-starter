import { combineReducers } from '@reduxjs/toolkit';

import userList from './slices/user-list-slice';
import userInfo from './slices/user-info-slice';

const reducers = combineReducers({
  userList,
  userInfo,
});

export default reducers;
