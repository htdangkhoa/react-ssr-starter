import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

describe('server side rendering', () => {
  describe('GET /', () => {
    it('should redirect to /home', async () => {
      await request.get('/').expect('Location', '/home');
    });
  });

  describe('GET /home', () => {
    it('should render html', async () => {
      await request.get('/home').expect('content-type', /text\/html/i);
    });
  });

  describe('GET /todo-info/1', () => {
    it('should render html', async () => {
      await request.get('/todo-info/1').expect('content-type', /text\/html/i);
    });
  });

  describe('GET /page-not-found', () => {
    it('should render html', async () => {
      await request.get('/page-not-found').expect(404);
    });
  });
});
