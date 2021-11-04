import 'reflect-metadata';
import supertest from 'supertest';
import { container } from 'tsyringe';
import app from '../../src/app';
import NotificationService from '../../src/services/notification.service';
import TestService from '../../src/services/test.service';
import constants from '../../src/utils/constants';
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

    const service = container.resolve(NotificationService);
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

    const service = container.resolve(NotificationService);
    const notification = await service.notifyReceiver(
      user.id,
      'Test notification',
      'Hello world'
    );

    const response = await request
      .patch(`/user/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  test('As a user can not mark an invalid notification as read', async () => {
    const { token } = await UserFactory.login();

    const response = await request
      .patch(`/user/notifications/12233/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(constants.notificationNotFound);
  });
});
