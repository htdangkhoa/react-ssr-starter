import { createAsyncThunk } from '@reduxjs/toolkit';

import request from './request';

export const getUsers = createAsyncThunk('getUsers', async () => {
  try {
    const { data } = await request.get('users');

    return data;
  } catch (error) {
    throw error.response.data.error;
  }
});

export const getUser = createAsyncThunk('getUser', async (id) => {
  try {
    const { data } = await request.get(`users/${id}`);

    return data;
  } catch (error) {
    throw error.response.data.error;
  }
});
