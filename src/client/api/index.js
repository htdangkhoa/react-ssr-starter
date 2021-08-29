import nFetch from 'node-fetch';
import { createAsyncThunk } from '@reduxjs/toolkit';

import appConfig from 'configs/app';

if (!globalThis.fetch) {
  globalThis.fetch = nFetch;
}

const request = (url, options) =>
  new Promise((resolve, reject) =>
    fetch(`${appConfig.baseUrl}${url}`, options)
      .then((res) => {
        if (!res.ok) {
          const err = new Error(res.statusText);
          err.response = res;

          return reject(err);
        }

        return res.json();
      })
      .then((json) => resolve(json))
      .catch((err) => reject(err)),
  );

export const getUsers = createAsyncThunk('getUsers', async () => {
  const res = await request('users');

  return res;
});

export const getUser = createAsyncThunk('getUser', async (id) => {
  const res = await request(`users/${id}`);

  return res;
});
