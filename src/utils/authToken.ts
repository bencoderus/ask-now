import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { UserInterface } from '../interfaces/models/user.interface';

const { jwtSecret, jwtExpiresIn } = config;

export default class AuthToken {
  public static async generateToken(payload: UserInterface): Promise<{
    payload: UserInterface;
    token: string;
  }> {
    try {
      const token = jwt.sign({ payload }, jwtSecret, {
        expiresIn: jwtExpiresIn
      });

      return { payload, token };
    } catch (error) {
      throw new Error('Unable to generate token');
    }
  }

  public static async verifyToken(token: string): Promise<{
    verified: boolean;
    decoded: any;
  }> {
    try {
      const decoded: JwtPayload | string = jwt.verify(token, jwtSecret);
      return { verified: true, decoded };
    } catch (error) {
      return { verified: false, decoded: null };
    }
  }
}
