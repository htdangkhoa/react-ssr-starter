import appConfig from 'configs/app';

/**
 * Loading node-fetch@3 in CJS
 * References: https://github.com/node-fetch/node-fetch/issues/1279#issuecomment-915063354
 */
// eslint-disable-next-line no-new-func
const _importDynamic = new Function('modulePath', 'return import(modulePath)');

const nFetch = (...args) => _importDynamic('node-fetch').then(({ default: fetch }) => fetch(...args));

if (!globalThis.fetch) {
  globalThis.fetch = nFetch;
}

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
