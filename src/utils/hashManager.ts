import bcrypt from 'bcrypt';

const saltRounds = 10;

export default class HashManager {
  public static hash(value: string): string {
    return bcrypt.hashSync(value, saltRounds);
  }

  public static compare(plainValue: string, hashValue: string): boolean {
    return bcrypt.compareSync(plainValue, hashValue);
  }
}
