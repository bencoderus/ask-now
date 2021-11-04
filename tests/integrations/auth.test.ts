import supertest from 'supertest';
import app from '../../src/app';
import { UserInterface } from '../../src/interfaces/models/user.interface';
import TestService from '../../src/services/test.service';
import constants from '../../src/utils/constants';
import UserFactory, {
  defaultPassword as password
} from '../factories/user.factory';

const request = supertest(app);
const testService = new TestService();

beforeEach(async () => {
  await testService.setup();
});

afterEach(async () => {
  await testService.teardown();
});

const payload = {
  firstName: 'Benjamin',
  lastName: 'Iduwe',
  username: 'bencoderus',
  email: 'bencoderus@gmail.com',
  password
};

describe('Test registration', () => {
  test('A guest can create an account.', async () => {
    const response = await request.post('/auth/register').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe(constants.accountCreated);
  });

  test('A guest can not create an account with an existing email', async () => {
    const user: UserInterface = await UserFactory.create();
    payload['email'] = user.email;
    const response = await request.post('/auth/register').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(constants.emailExists);
  });

  test('A guest can not create an account with an existing username', async () => {
    const user: UserInterface = await UserFactory.create();
    payload['username'] = user.username;
    const response = await request.post('/auth/register').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(constants.usernameExists);
  });

  test('A guest can not create an account with an invalid email', async () => {
    const user: UserInterface = await UserFactory.create();
    payload['email'] = 'bencoderus';
    const response = await request.post('/auth/register').send(payload);

    expect(response.status).toBe(422);
    expect(response.body.status).toBe(false);
  });
});

describe('Test login', () => {
  test('A guest can login into his account with a valid credential.', async () => {
    const user: UserInterface = await UserFactory.create();

    const response = await request.post('/auth/login').send({
      email: user.email,
      password
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe(constants.loginSuccess);
    expect(response.body.data).toHaveProperty('token');
  });

  test('A guest can not login an account with an invalid email', async () => {
    const user: UserInterface = await UserFactory.create();

    const response = await request.post('/auth/register').send({
      email: 'bencoderus',
      password
    });

    expect(response.status).toBe(422);
    expect(response.body.status).toBe(false);
  });

  test('A guest can not login with an invalid credential.', async () => {
    const user: UserInterface = await UserFactory.create();

    const response = await request.post('/auth/login').send({
      email: user.email,
      password: 'password123'
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(constants.invalidCredentials);
  });
});
