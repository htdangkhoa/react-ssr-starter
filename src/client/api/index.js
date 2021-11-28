import { createAsyncThunk } from '@reduxjs/toolkit';

import request from './request';

export const getUsers = createAsyncThunk('getUsers', async () => {
  const res = await request('users');

  return res;
});

export const getUser = createAsyncThunk('getUser', async (id) => {
  const res = await request(`users/${id}`);

  return res;
});
