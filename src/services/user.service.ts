import HttpException from '../exceptions/http.exception';
import User from '../models/user.model';
import AuthToken from '../utils/auth-token';
import HashManager from '../utils/hash-manager';

export default class UserService {
  public async createUser(data: any): Promise<{
    user: any;
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

    return { user: createdUser.toJSON(), token };
  }

  public async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email });
    const password = user ? user.password : '';

    if (!user) {
      throw new HttpException('Credentials are invalid', 400);
    }

    const isValid = HashManager.compare(data.password, password);

    if (!isValid) {
      throw new HttpException('Password does not match', 400);
    }

    const { token } = await AuthToken.generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }
}
