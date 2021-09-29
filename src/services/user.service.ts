import HttpException from '../exceptions/http.exception';
import { UserInterface } from '../interfaces/models/user.interface';
import User from '../models/user.model';
import AuthToken from '../utils/auth-token';
import constants from '../utils/constants';
import HashManager from '../utils/hash-manager';

export default class UserService {
  public async createUser(data: Readonly<Record<string, string>>): Promise<{
    user: UserInterface;
    token: string;
  }> {
    const emailExists = await User.exists({ email: data.email });

    if (emailExists) {
      throw new HttpException('Email already exists', 400);
    }

    const usernameExists = await User.exists({ username: data.username });

    if (usernameExists) {
      throw new HttpException('Username already exists', 400);
    }

    const hashed = HashManager.hash(data.password);

    const createdUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: hashed
    });

    const { token } = await AuthToken.generateToken(createdUser);

    return { user: createdUser, token };
  }

  public async login(data: Record<string, string>): Promise<{
    user: UserInterface;
    token: string;
  }> {
    const user = await User.findOne({ email: data.email });

    if (!(user && HashManager.compare(data.password, user.password))) {
      throw new HttpException(constants.invalidCredentials, 400);
    }

    const { token } = await AuthToken.generateToken(user);

    return {
      user,
      token
    };
  }
}
