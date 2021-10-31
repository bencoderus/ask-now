import bcrypt from 'bcrypt';
import config from '../config';

const saltRounds: number = config.saltRounds;

export const hash = (value: string): Promise<string> => {
  return bcrypt.hash(value, saltRounds);
};

export const compare = (value: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(value, hash);
};
