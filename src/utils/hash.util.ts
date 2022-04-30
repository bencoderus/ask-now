import bcrypt from 'bcryptjs';
import config from '../config';

export const hash = (value: string): Promise<string> => {
  return bcrypt.hash(value, config.saltRounds);
};

export const compare = (
  value: string,
  hashedValue: string
): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};
