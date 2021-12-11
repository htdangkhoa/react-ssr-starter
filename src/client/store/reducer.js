import { combineReducers } from '@reduxjs/toolkit';

import userList from './slices/user-list-slice';
import userInfo from './slices/user-info-slice';

const configurationReducers = (routerReducer) =>
  combineReducers({
    userList,
    userInfo,
    router: routerReducer,
  });

export default configurationReducers;
