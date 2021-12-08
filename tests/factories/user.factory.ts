import faker from 'faker';
import { UserInterface } from '../../src/interfaces/models/user.interface';
import UserService from '../../src/services/user.service';

export const defaultPassword = 'password';
export default class UserFactory {
  static async create(
    data: Record<string, string> = {}
  ): Promise<UserInterface> {
    const service = new UserService();
    const { firstName, lastName, username, email } = data;

    return service.createUser({
      firstName: firstName ?? faker.unique.name,
      lastName: lastName ?? faker.unique.name,
      email: email ?? faker.internet.email(),
      username: username ?? faker.unique.name,
      password: defaultPassword
    });
  }

  static async login(
    data: Record<string, string> = {}
  ): Promise<{ user: UserInterface; token: string }> {
    const user: UserInterface = await this.create(data);

    const service = new UserService();

    return service.login({
      email: user.email,
      password: 'password'
    });
  }
}
