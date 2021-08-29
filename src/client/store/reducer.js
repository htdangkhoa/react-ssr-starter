import { combineReducers } from '@reduxjs/toolkit';

import userList from './slices/user-list-slice';
import userInfo from './slices/user-info-slice';

const reducer = combineReducers({
  userList,
  userInfo,
});

export default reducer;
