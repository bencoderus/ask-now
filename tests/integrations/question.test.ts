import 'reflect-metadata';
import faker from 'faker';
import { container } from 'tsyringe';
import supertest from 'supertest';
import TestService from '../../src/services/test.service';
import app from '../../src/app';
import UserFactory from '../factories/user.factory';
import QuestionService from '../../src/services/question.service';

const request = supertest(app);
const testService = container.resolve(TestService);

beforeEach(async () => {
  await testService.setup();
});

afterEach(async () => {
  await testService.teardown();
});

test('A user can ask a question', async () => {
  const { token } = await UserFactory.login();

  const response = await request
    .post('/questions')
    .send({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: 'Typescript, Express, NodeJs'
    })
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);
});

test('A user can ask a question without the required parameters', async () => {
  const { token } = await UserFactory.login();

  const response = await request
    .post('/questions')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(422);
  expect(response.body.status).toBe(false);
});

test('A user can edit his own question.', async () => {
  const { user, token } = await UserFactory.login();

  const questionService = container.resolve(QuestionService);
  const payload = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    tags: 'Typescript, Express, NodeJs'
  };

  const question = await questionService.create(payload, user);

  payload.title = faker.lorem.sentence();

  const response = await request
    .patch(`/questions/${question.id}`)
    .send(payload)
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);
});

test('A user can not edit someone elses question.', async () => {
  const { user } = await UserFactory.login({
    username: 'bencoderus123',
    email: 'bencoderus123@mail.com'
  });

  const authUser = await UserFactory.login({
    username: 'bencoderus12',
    email: 'bencoderus12@mail.com'
  });

  const questionService = container.resolve(QuestionService);

  const payload = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    tags: 'Typescript, Express, NodeJs'
  };

  const question = await questionService.create(payload, user);

  payload.title = faker.lorem.sentence();

  const response = await request
    .patch(`/questions/${question.id}`)
    .set('Authorization', `Bearer ${authUser.token}`)
    .send(payload);

  expect(response.status).toBe(403);
  expect(response.body.status).toBe(false);
});

test('A user can delete his own question.', async () => {
  const { user, token } = await UserFactory.login();

  const questionService = container.resolve(QuestionService);
  const payload = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    tags: 'Typescript, Express, NodeJs'
  };

  const question = await questionService.create(payload, user);

  payload.title = faker.lorem.sentence();

  const response = await request
    .delete(`/questions/${question.id}`)
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);
});

test('A user can not delete someone elses question.', async () => {
  const { user } = await UserFactory.login({
    username: 'bencoderus123',
    email: 'bencoderus123@mail.com'
  });

  const authUser = await UserFactory.login({
    username: 'bencoderus12',
    email: 'bencoderus12@mail.com'
  });

  const questionService = container.resolve(QuestionService);

  const question = await questionService.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: 'Typescript, Express, NodeJs'
    },
    user
  );

  const response = await request
    .delete(`/questions/${question.id}`)
    .set('Authorization', `Bearer ${authUser.token}`);

  expect(response.status).toBe(403);
  expect(response.body.status).toBe(false);
});

test('A user can subscribe to a question.', async () => {
  const { user } = await UserFactory.login({
    username: 'bencoderus123',
    email: 'bencoderus123@mail.com'
  });

  const authUser = await UserFactory.login({
    username: 'bencoderus12',
    email: 'bencoderus12@mail.com'
  });

  const questionService = container.resolve(QuestionService);

  const question = await questionService.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: 'Typescript, Express, NodeJs'
    },
    user
  );

  const response = await request
    .post(`/questions/${question.id}/subscribe`)
    .set('Authorization', `Bearer ${authUser.token}`);

  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);
});

test('A user can not subscribe to a question he is already subscribed to.', async () => {
  const authUser = await UserFactory.login({
    username: 'bencoderus12',
    email: 'bencoderus12@mail.com'
  });

  const questionService = container.resolve(QuestionService);

  const question = await questionService.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: 'Typescript, Express, NodeJs'
    },
    authUser.user
  );

  const response = await request
    .post(`/questions/${question.id}/subscribe`)
    .set('Authorization', `Bearer ${authUser.token}`);

  expect(response.status).toBe(403);
  expect(response.body.status).toBe(false);
});

test('A user can  unsubscribe from a question', async () => {
  const authUser = await UserFactory.login({
    username: 'bencoderus12',
    email: 'bencoderus12@mail.com'
  });

  const questionService = container.resolve(QuestionService);

  const question = await questionService.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: 'Typescript, Express, NodeJs'
    },
    authUser.user
  );

  const response = await request
    .post(`/questions/${question.id}/unsubscribe`)
    .set('Authorization', `Bearer ${authUser.token}`);

  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);
});

test('A user can not unsubscribe from a question he is not subscribed to.', async () => {
  const { user } = await UserFactory.login({
    username: 'bencoderus123',
    email: 'bencoderus123@mail.com'
  });

  const authUser = await UserFactory.login({
    username: 'bencoderus12',
    email: 'bencoderus12@mail.com'
  });

  const questionService = container.resolve(QuestionService);

  const question = await questionService.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: 'Typescript, Express, NodeJs'
    },
    user
  );

  const response = await request
    .post(`/questions/${question.id}/unsubscribe`)
    .set('Authorization', `Bearer ${authUser.token}`);

  expect(response.status).toBe(403);
  expect(response.body.status).toBe(false);
});
