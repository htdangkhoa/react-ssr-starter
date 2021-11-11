import 'isomorphic-fetch';
import appConfig from 'configs/app';

/**
 * @param {string} url
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
const request = (url, init) =>
  new Promise((resolve, reject) => {
    fetch(`${appConfig.baseUrl}${url}`, init)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();

          throw new Error(text);
        }

        return res.json();
      })
      .then(resolve)
      .catch(reject);
  });

export default request;
