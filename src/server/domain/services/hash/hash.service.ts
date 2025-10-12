import { compare, hash } from 'bcrypt';

export class HashService {
  hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}