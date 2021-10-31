import { injectable } from 'tsyringe';
import HttpException from '../exceptions/http.exception';
import {
  BaseUserInterface,
  UserInterface,
  UserLoginInterface
} from '../interfaces/models/user.interface';
import User from '../models/user.model';
import AuthToken from '../utils/authToken';
import constants from '../utils/constants';
import { hash, compare } from '../utils/hash.util';

@injectable()
export default class UserService {
  public async createUser(data: BaseUserInterface): Promise<UserInterface> {
    const emailExists = await User.exists({ email: data.email });

    if (emailExists) {
      throw new HttpException('Email already exists', 400);
    }

    const usernameExists = await User.exists({ username: data.username });

    if (usernameExists) {
      throw new HttpException('Username already exists', 400);
    }

    const hashed = await hash(data.password);

    return User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: hashed
    });
  }

  public async login(data: UserLoginInterface): Promise<{
    user: UserInterface;
    token: string;
  }> {
    const user = await User.findOne({ email: data.email });
    const passwordMatches =
      user && (await compare(data.password, user.password));

    if (!(user && passwordMatches)) {
      throw new HttpException(constants.invalidCredentials, 400);
    }

    const { token } = await AuthToken.generateToken(user);

    return {
      user,
      token
    };
  }
}
