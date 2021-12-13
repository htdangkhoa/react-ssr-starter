import httpAdapter from 'axios/lib/adapters/http';
import axios from 'axios';
import nock from 'nock';
import appConfig from 'configs/client';

axios.defaults.adapter = httpAdapter;

const user = {
  id: 1,
  name: 'Leanne Graham',
  phone: '1-770-736-8031 x56442',
  email: 'Sincere@april.biz',
  website: 'hildegard.org',
};

nock(appConfig.baseUrl)
  .get('/users')
  .reply(200, {
    success: true,
    users: [user],
  })
  .get('/users/1')
  .reply(200, {
    success: true,
    user,
  });
