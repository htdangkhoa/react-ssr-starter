import 'isomorphic-fetch';

import appConfig from 'configs/app';

const request = (url, options) =>
  new Promise((resolve, reject) =>
    fetch(`${appConfig.baseUrl}${url}`, options)
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
