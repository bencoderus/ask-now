import faker from 'faker';
import { UserInterface } from '../../src/interfaces/models/user.interface';
import UserService from '../../src/services/user.service';
import HashManager from '../../src/utils/hash-manager';

export default class UserFactory {
  static async create(): Promise<UserInterface> {
    const service = new UserService();

    return service.createUser({
      firstName: faker.unique.name,
      lastName: faker.unique.name,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: HashManager.hash('password')
    });
  }

  static async login(): Promise<{ user: UserInterface; token: string }> {
    const user: UserInterface = await this.create();

    const service = new UserService();

    return service.login({
      email: user.email,
      password: 'password'
    });
  }
}
