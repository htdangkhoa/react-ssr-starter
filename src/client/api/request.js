import 'isomorphic-fetch';
import appConfig from 'configs/app';

/**
 * @param {string} url
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
const request = (url, init) =>
  new Promise((resolve, reject) =>
    fetch(`${appConfig.baseUrl}${url}`, init)
      .then(async (res) => {
        if (!res.ok) {
          const message = [res.status, res.statusText && `: ${res.statusText}`].filter(Boolean).join('');

          const err = new Error(message);
          err.response = res;

          return reject(err);
        }

        return res.json();
      })
      .then((json) => resolve(json))
      .catch((err) => reject(err)),
  );

export default request;
