import supertest from 'supertest';
import app from '../../src/app';
import { NotificationInterface } from '../../src/interfaces/models/user.interface';
import NotificationService from '../../src/services/notification.service';
import TestService from '../../src/services/test.service';
import UserFactory from '../factories/user.factory';

const request = supertest(app);
const testService = new TestService();

beforeEach(async () => {
  await testService.setup();
});

afterEach(async () => {
  await testService.teardown();
});

describe('Notification', () => {
  test('As a user can view notifications', async () => {
    const { user, token } = await UserFactory.login();

    const service = new NotificationService();
    service.notifyReceiver(user.id, 'Test notification', 'Hello world');

    const response = await request
      .get('/user/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test('As a user can mark notification as read', async () => {
    const { user, token } = await UserFactory.login();

    const service = new NotificationService();
    service.notifyReceiver(user.id, 'Test notification', 'Hello world');

    const notification: NotificationInterface[] = await service.findByUser(
      user.id
    )[0];

    console.log(notification);
  });
});
