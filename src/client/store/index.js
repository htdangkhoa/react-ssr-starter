import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const createStore = ({ initialState } = {}) => {
  const store = configureStore({
    preloadedState: initialState,
    reducer,
    devTools: __DEV__,
  });

  return { store };
};

export default createStore;
