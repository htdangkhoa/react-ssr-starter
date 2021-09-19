import 'isomorphic-fetch';

import appConfig from 'configs/app';

const request = (url, options) =>
  new Promise((resolve, reject) =>
    fetch(`${appConfig.baseUrl}${url}`, options)
      .then(async (res) => {
        const raw = await res.text();

        if (!res.ok) {
          const err = new Error(raw);
          err.response = res;

          return reject(err);
        }

        return res.json();
      })
      .then((json) => resolve(json))
      .catch((err) => reject(err)),
  );

export default request;
