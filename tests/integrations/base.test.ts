import supertest from 'supertest';
import app from '../../src/app';
import TestService from '../../src/utils/test-service';

const request = supertest(app);
const testService = new TestService();

beforeAll(async () => {
  await testService.setup();
});

afterAll(async () => {
  await testService.teardown();
});

test('As a user i can access the base route.', async () => {
  const response = await request.get('/');

  expect(response.status).toBe(200);
});
