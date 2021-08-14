import { combineReducers } from '@reduxjs/toolkit';

import todoList from './slices/todo-list-slice';
import todoInfo from './slices/todo-info-slice';

const reducer = combineReducers({
  todoList,
  todoInfo,
});

export default reducer;
