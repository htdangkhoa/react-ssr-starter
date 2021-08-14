import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import appConfig from 'configs/app';

const instance = axios.create({
  baseURL: appConfig.baseUrl,
});

export const getTodos = createAsyncThunk('getTodos', async () => {
  const res = await instance.get('todos');

  return res.data;
});

export const getTodo = createAsyncThunk('getTodo', async (id) => {
  const res = await instance.get(`todos/${id}`);

  return res.data;
});
