import jwt from 'jsonwebtoken';
import config from '../config';

const { jwtSecret } = config;
const { jwtExpiresIn } = config;

export default class AuthToken {
  public static async generateToken(payload: any): Promise<{
    payload: any;
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
      const decoded = jwt.verify(token, jwtSecret);
      return { verified: true, decoded };
    } catch (error) {
      return { verified: false, decoded: null };
    }
  }
}
